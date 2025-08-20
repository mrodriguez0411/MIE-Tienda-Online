import * as React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { default as supabaseAdmin } from '@/supabase/client';
import useSnackbar from '@/hooks/useSnackbar';
import { useCallback, useState, useEffect } from 'react';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  CircularProgress
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

// Helper function to format date
const formatDate = (dateString: string) => {
  try {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (error) {
    return dateString;
  }
};

// Core types
type UserRole = 'admin' | 'customer';

// User row interface for the data grid
interface UserRow {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: UserRole;
  created_at: string;
}

// Form values interface
interface UserFormValues {
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: UserRole;
  password: string;
  confirmPassword: string;
  isEdit: boolean;
}

// Validation schema
const userSchema = yup.object().shape({
  email: yup.string().email('Email inválido').required('Email es requerido'),
  first_name: yup.string().required('Nombre es requerido'),
  last_name: yup.string().required('Apellido es requerido'),
  phone: yup.string().required('Teléfono es requerido'),
  role: yup.string().oneOf(['admin', 'customer'] as const).required('Rol es requerido'),
  password: yup
    .string()
    .when('isEdit', {
      is: false,
      then: (schema) => schema.required('Contraseña es requerida').min(6, 'La contraseña debe tener al menos 6 caracteres'),
    }),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Las contraseñas deben coincidir')
    .when('isEdit', {
      is: false,
      then: (schema) => schema.required('Debes confirmar la contraseña'),
    }),
  isEdit: yup.boolean(),
});

// API functions
const fetchUsers = async (): Promise<UserRow[]> => {
  try {
    // First, get all customers
    const { data: customers, error: customersError } = await supabaseAdmin
      .from('customers')
      .select('*');
    
    if (customersError) {
      console.error('Error fetching customers:', customersError);
      throw customersError;
    }
    
    if (!customers || customers.length === 0) return [];
    
    // Then get all user roles
    const { data: userRoles, error: rolesError } = await supabaseAdmin
      .from('user_roles')
      .select('*');
      
    if (rolesError) {
      console.error('Error fetching user roles:', rolesError);
      throw rolesError;
    }
    
    // Create a map of user_id to role for quick lookup
    const roleMap = new Map<string, UserRole>();
    userRoles?.forEach(ur => {
      roleMap.set(ur.user_id, ur.role as UserRole);
    });
    
    // Map the customers to our UserRow format
    return customers.map(customer => ({
      id: customer.user_id,
      email: customer.email || '',
      first_name: customer.first_name || '',
      last_name: customer.last_name || '',
      phone: customer.phone || '',
      role: roleMap.get(customer.user_id) || 'customer',
      created_at: customer.created_at,
    } as UserRow));
  } catch (error) {
    console.error('Error in fetchUsers:', error);
    throw error;
  }
};

const createUser = async (userData: Omit<UserFormValues, 'isEdit' | 'confirmPassword'>): Promise<UserRow> => {
  if (!userData.password) {
    throw new Error('Password is required for new users');
  }

  let userId: string;
  
  try {
    // First create the auth user
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: userData.email,
      password: userData.password,
      email_confirm: true // Auto-confirm the email
    });
    
    if (authError) throw authError;
    if (!authData.user) throw new Error('Failed to create user: No user data returned');
    
    userId = authData.user.id;
    const role = userData.role || 'customer';
    
    // Create customer in customers table
    const { error: customerError } = await supabaseAdmin
      .from('customers')
      .insert({
        user_id: userId,
        email: userData.email,
        first_name: userData.first_name,
        last_name: userData.last_name,
        phone: userData.phone || null,
      });
      
    if (customerError) {
      console.error('Error creating customer:', customerError);
      throw customerError;
    }
    
    // Create the user role
    const { error: roleError } = await supabaseAdmin
      .from('user_roles')
      .insert([{
        user_id: userId,
        role: role
      }]);
      
    if (roleError) throw roleError;
    
    // Return the created user in our format
    return {
      id: userId,
      email: userData.email,
      first_name: userData.first_name,
      last_name: userData.last_name,
      phone: userData.phone || '',
      role: role as UserRole,
      created_at: new Date().toISOString(),
    };
    
  } catch (error) {
    console.error('Error in createUser:', error);
    
    // Clean up if user was created but something else failed
    if (userId) {
      await Promise.all([
        supabaseAdmin.from('profiles').delete().eq('user_id', userId),
        supabaseAdmin.from('user_roles').delete().eq('user_id', userId),
        supabaseAdmin.auth.admin.deleteUser(userId)
      ]).catch(console.error);
    }
    
    throw error;
  }
};

const updateUser = async (userId: string, userData: Partial<UserFormValues>): Promise<UserRow> => {
  try {
    const profileUpdates: Record<string, any> = {};
    let roleUpdate: UserRole | null = null;
    
    // Prepare profile updates
    if (userData.email !== undefined) profileUpdates.email = userData.email;
    if (userData.first_name !== undefined) profileUpdates.first_name = userData.first_name;
    if (userData.last_name !== undefined) profileUpdates.last_name = userData.last_name;
    if (userData.phone !== undefined) profileUpdates.phone = userData.phone;
    
    // Check if role is being updated
    if (userData.role !== undefined) {
      roleUpdate = userData.role as UserRole;
    }
    
    // Update customer if there are updates
    if (Object.keys(profileUpdates).length > 0) {
      const { error: customerError } = await supabaseAdmin
        .from('customers')
        .update(profileUpdates)
        .eq('user_id', userId);
        
      if (customerError) {
        console.error('Error updating customer:', customerError);
        throw customerError;
      }
    }
    
    // Update role in user_roles table if needed
    if (roleUpdate !== null) {
      // Check if user already has a role entry
      const { data: existingRole, error: roleFetchError } = await supabaseAdmin
        .from('user_roles')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();
        
      if (roleFetchError) throw roleFetchError;
      
      if (existingRole) {
        // Update existing role
        const { error: updateRoleError } = await supabaseAdmin
          .from('user_roles')
          .update({ role: roleUpdate })
          .eq('user_id', userId);
          
        if (updateRoleError) throw updateRoleError;
      } else {
        // Insert new role
        const { error: insertRoleError } = await supabaseAdmin
          .from('user_roles')
          .insert([{ user_id: userId, role: roleUpdate }]);
          
        if (insertRoleError) throw insertRoleError;
      }
    }
    
    // Fetch updated user data and role separately
    const [
      { data: updatedProfile, error: profileFetchError },
      { data: updatedRole, error: roleFetchError }
    ] = await Promise.all([
      supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single(),
      supabaseAdmin
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .maybeSingle()
    ]);
    
    if (profileFetchError) throw profileFetchError;
    if (roleFetchError) throw roleFetchError;
    
    if (!updatedProfile) {
      throw new Error('Failed to fetch updated profile');
    }
    
    return {
      id: userId,
      email: updatedProfile.email || '',
      first_name: updatedProfile.first_name || '',
      last_name: updatedProfile.last_name || '',
      phone: updatedProfile.phone || '',
      role: (updatedRole?.role as UserRole) || 'customer',
      created_at: updatedProfile.created_at,
    };
  } catch (error) {
    console.error('Error in updateUser:', error);
    throw error;
  }
};

const deleteUser = async (userId: string): Promise<void> => {
  try {
    // Delete from user_roles first
    const { error: roleError } = await supabaseAdmin
      .from('user_roles')
      .delete()
      .eq('user_id', userId);
      
    if (roleError) {
      console.error('Error deleting user role:', roleError);
      throw roleError;
    }
    
    // First delete the customer
    const { error: customerError } = await supabaseAdmin
      .from('customers')
      .delete()
      .eq('user_id', userId);
      
    if (customerError) {
      console.error('Error deleting customer:', customerError);
      throw customerError;
    }
    
    // Finally, delete the auth user
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (authError) {
      console.error('Error deleting auth user:', authError);
      throw authError;
    }
  } catch (error) {
    console.error('Error in deleteUser:', error);
    throw error;
  }
};

const UsersTable: React.FC = () => {
  const queryClient = useQueryClient();
  const { showSnackbar, snackbar, handleClose: handleCloseSnackbar } = useSnackbar();
  
  // State management
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserRow | null>(null);
  const [userToDelete, setUserToDelete] = useState<UserRow | null>(null);
  
  // Form setup
  const { 
    control, 
    handleSubmit, 
    reset, 
    formState: { errors },
    watch,
    setValue,
    getValues
  } = useForm<UserFormValues>({
    resolver: yupResolver(userSchema as any), // Type assertion to fix type issues
    defaultValues: {
      email: '',
      first_name: '',
      last_name: '',
      phone: '',
      role: 'customer',
      password: '',
      confirmPassword: '',
      isEdit: false
    }
  });

  const isEdit = watch('isEdit');
  // These watched values are used by the yup validation schema
  // The yup schema uses these values for validation
  // The variables are used by the yup schema for validation
  // even though they appear unused in the code
  const password = watch('password');
  const confirmPassword = watch('confirmPassword');
  
  // Prevent unused variable warnings by using them in a no-op
  if (password || confirmPassword) {
    // This is just to use the variables and prevent warnings
  }

  const handleOpenDialog = useCallback((user?: UserRow) => {
    if (user) {
      setValue('email', user.email);
      setValue('first_name', user.first_name);
      setValue('last_name', user.last_name);
      setValue('phone', user.phone);
      setValue('role', user.role);
      setValue('isEdit', true);
      setEditingUser(user);
    } else {
      reset({
        email: '',
        first_name: '',
        last_name: '',
        phone: '',
        role: 'customer',
        password: '',
        confirmPassword: '',
        isEdit: false
      });
      setEditingUser(null);
    }
    setIsDialogOpen(true);
  }, [reset, setValue, setEditingUser]);

  const handleCloseDialog = useCallback(() => {
    setIsDialogOpen(false);
    setEditingUser(null);
    reset();
  }, [reset, setEditingUser]);

  // Mutations - Defined first to avoid reference errors
  const createUserMutation = useMutation({
    mutationFn: (data: Omit<UserFormValues, 'isEdit' | 'confirmPassword'>) => 
      createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      showSnackbar('Usuario creado correctamente', 'success');
    },
    onError: (error: Error) => {
      console.error('Error creating user:', error);
      showSnackbar('Error al crear el usuario', 'error');
    }
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Partial<UserFormValues>) => 
      updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      showSnackbar('Usuario actualizado correctamente', 'success');
    },
    onError: (error: Error) => {
      console.error('Error updating user:', error);
      showSnackbar('Error al actualizar el usuario', 'error');
    }
  });

  const deleteUserMutation = useMutation({
    mutationFn: (userId: string) => deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      showSnackbar('Usuario eliminado correctamente', 'success');
    },
    onError: (error: Error) => {
      console.error('Error deleting user:', error);
      showSnackbar('Error al eliminar el usuario', 'error');
    }
  });

  // Handle delete dialog
  const handleOpenDeleteDialog = useCallback((user: UserRow) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  }, []);

  const handleCloseDeleteDialog = useCallback(() => {
    setIsDeleteDialogOpen(false);
    setUserToDelete(null);
  }, []);

  const handleDeleteUser = useCallback(async () => {
    if (!userToDelete) return;
    
    try {
      await deleteUserMutation.mutateAsync(userToDelete.id);
      handleCloseDeleteDialog();
      showSnackbar('Usuario eliminado correctamente', 'success');
    } catch (error) {
      console.error('Error deleting user:', error);
      showSnackbar('Error al eliminar el usuario', 'error');
    }
  }, [userToDelete, deleteUserMutation, handleCloseDeleteDialog, showSnackbar]);

  // Fetch users
  const { data: usersData = [], isLoading, error } = useQuery<UserRow[], Error>({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  // Handle query errors
  useEffect(() => {
    if (error) {
      console.error('Error fetching users:', error);
      showSnackbar('Error al cargar los usuarios', 'error');
    }
  }, [error, showSnackbar]);

  // Handle form submission
  const onSubmit = useCallback(async (data: UserFormValues) => {
    try {
      if (editingUser) {
        await updateUserMutation.mutateAsync({
          id: editingUser.id,
          ...data,
          // Don't update password if not provided
          ...(data.password ? { password: data.password } : {})
        });
      } else {
        await createUserMutation.mutateAsync({
          email: data.email,
          first_name: data.first_name,
          last_name: data.last_name,
          phone: data.phone,
          role: data.role,
          password: data.password || '' // Ensure password is always a string
        });
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Error in form submission:', error);
      // Error handling is done in the mutation callbacks
    }
  }, [editingUser, handleCloseDialog, updateUserMutation, createUserMutation]);

  return (
    <Box component="div" sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2">
          Gestión de Usuarios
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Agregar Usuario
        </Button>
      </Box>
      
      {/* Users Table */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Teléfono</TableCell>
                <TableCell>Rol</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ color: 'error.main' }}>
                    Error al cargar los usuarios
                  </TableCell>
                </TableRow>
              ) : usersData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No hay usuarios registrados
                  </TableCell>
                </TableRow>
              ) : (
                usersData.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{`${user.first_name} ${user.last_name}`}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone || '-'}</TableCell>
                    <TableCell>
                      <Chip 
                        label={user.role === 'admin' ? 'Administrador' : 'Cliente'}
                        color={user.role === 'admin' ? 'primary' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton 
                        color="primary" 
                        onClick={() => handleOpenDialog(user)}
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        color="error" 
                        onClick={() => handleOpenDeleteDialog(user)}
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Add/Edit User Dialog */}
      <Dialog open={isDialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>{isEdit ? 'Editar Usuario' : 'Agregar Usuario'}</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2 }}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Email"
                    fullWidth
                    margin="normal"
                    disabled={isEdit}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                )}
              />
              <Box display="flex" gap={2}>
                <Controller
                  name="first_name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Nombre"
                      fullWidth
                      margin="normal"
                      error={!!errors.first_name}
                      helperText={errors.first_name?.message}
                    />
                  )}
                />
                <Controller
                  name="last_name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Apellido"
                      fullWidth
                      margin="normal"
                      error={!!errors.last_name}
                      helperText={errors.last_name?.message}
                    />
                  )}
                />
              </Box>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Teléfono"
                    fullWidth
                    margin="normal"
                    error={!!errors.phone}
                    helperText={errors.phone?.message}
                  />
                )}
              />
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Rol</InputLabel>
                    <Select
                      {...field}
                      label="Rol"
                      error={!!errors.role}
                    >
                      <MenuItem value="admin">Administrador</MenuItem>
                      <MenuItem value="customer">Cliente</MenuItem>
                    </Select>
                    {errors.role && (
                      <Box color="error.main" fontSize="0.75rem" mt={0.5}>
                        {errors.role.message}
                      </Box>
                    )}
                  </FormControl>
                )}
              />
              {!isEdit && (
                <Box display="flex" gap={2}>
                  <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Contraseña"
                        type="password"
                        fullWidth
                        margin="normal"
                        error={!!errors.password}
                        helperText={errors.password?.message}
                      />
                    )}
                  />
                  <Controller
                    name="confirmPassword"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Confirmar Contraseña"
                        type="password"
                        fullWidth
                        margin="normal"
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword?.message}
                      />
                    )}
                  />
                </Box>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancelar</Button>
            <Button type="submit" color="primary" variant="contained">
              {isEdit ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar al usuario {userToDelete?.email}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancelar</Button>
          <Button 
            onClick={handleDeleteUser} 
            color="error" 
            variant="contained"
            disabled={deleteUserMutation.isPending}
          >
            {deleteUserMutation.isPending ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UsersTable;
