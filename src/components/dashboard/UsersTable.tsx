import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  Tooltip,
  Select,
  MenuItem
} from '@mui/material';
import { DataGrid, GridColDef, GridRowParams } from '@mui/x-data-grid';
import { Edit, Delete, Add } from '@mui/icons-material';
import { UserMetadata } from '../../types/auth';
//import { Database } from '../../types/database';
import { getUsers, createUser, updateUser, deleteUser } from '../../actions/users';

export default function UsersTable() {
  const queryClient = useQueryClient();
  const [editingUserEmail, setEditingUserEmail] = useState<string>('');
  const [editingUserMetadata, setEditingUserMetadata] = useState<UserMetadata | null>(null);
  const [editingUserPassword, setEditingUserPassword] = useState<string>('');

  const { data: users, isLoading } = useQuery({
    queryKey: ['users'] as const,
    queryFn: async (): Promise<Database['auth']['Tables']['users']['Row'][]> => {
      try {
        const result = await getUsers();
        return result;
      } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
      }
    }
  });

  const createUserMutation = useMutation({
    mutationFn: async (userData: NewUser) => {
      try {
        const data = await createUser(userData);
        return data;
      } catch (error: any) {
        console.error('Error creating user:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error: unknown) => {
      console.error('Error creating user:', error);
    }
  });

  const updateUserMutation = useMutation({
    mutationFn: async (userData: UpdateUser) => {
      try {
        const data = await updateUser(userData);
        return data;
      } catch (error: any) {
        console.error('Error updating user:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error: unknown) => {
      console.error('Error updating user:', error);
    }
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      try {
        await deleteUser(userId);
      } catch (error: any) {
        console.error('Error deleting user:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error: unknown) => {
      console.error('Error deleting user:', error);
    }
  });

  const handleOpenDialog = (type: 'create' | 'edit', user?: Database['auth']['Tables']['users']['Row']) => {
    if (type === 'edit' && user) {
      setEditingUserEmail(user.email || '');
      setEditingUserMetadata(user.user_metadata);
    } else {
      setEditingUserEmail('');
      setEditingUserMetadata(null);
    }
  };

  const handleCloseDialog = () => {
    setEditingUserEmail('');
    setEditingUserMetadata(null);
    setEditingUserPassword('');
  };

  const handleUpdate = async () => {
    if (!editingUserMetadata || !users) return;

    const userData: UpdateUser = {
      id: users.find(u => u.email === editingUserEmail)?.id || '',
      user_metadata: editingUserMetadata
    };

    try {
      await updateUserMutation.mutateAsync(userData);
      handleCloseDialog();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDelete = async (userId: string) => {
    try {
      await deleteUserMutation.mutateAsync(userId);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleCreateUser = async () => {
    if (!editingUserMetadata || !editingUserPassword) return;

    const userData: NewUser = {
      email: editingUserEmail,
      password: editingUserPassword,
      user_metadata: editingUserMetadata
    };

    try {
      await createUserMutation.mutateAsync(userData);
      handleCloseDialog();
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const columns: GridColDef[] = [
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'user_metadata.first_name', headerName: 'First Name', width: 150 },
    { field: 'user_metadata.last_name', headerName: 'Last Name', width: 150 },
    { field: 'user_metadata.phone', headerName: 'Phone', width: 150 },
    { field: 'user_metadata.role', headerName: 'Role', width: 150 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <>
          <Tooltip title="Edit">
            <IconButton onClick={() => handleOpenDialog('edit', params.row)}>
              <Edit />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton onClick={() => handleDelete(params.row.id)}>
              <Delete />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];

  const [openDialog, setOpenDialog] = useState(false);
  const [actionType, setActionType] = useState<'create' | 'edit'>('create');

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Users</h2>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setActionType('create');
            setOpenDialog(true);
          }}
          startIcon={<Add />}
        >
          Add User
        </Button>
      </div>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={users || []}
          columns={columns}
          loading={isLoading}
          disableRowSelectionOnClick
          getRowId={(row: Database['auth']['Tables']['users']['Row']) => row.id}
          onRowClick={(params: GridRowParams<Database['auth']['Tables']['users']['Row']>) => handleOpenDialog('edit', params.row)}
          slots={{
            noRowsOverlay: () => <div className="flex items-center justify-center h-full">No users found</div>
          }}
        />
      </div>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {actionType === 'create' ? 'Create User' : 'Edit User'}
        </DialogTitle>
        <DialogContent>
          {actionType === 'create' && (
            <TextField
              margin="dense"
              label="Email"
              fullWidth
              value={editingUserEmail}
              onChange={(e) => setEditingUserEmail(e.target.value)}
            />
          )}
          {actionType === 'create' && (
            <TextField
              margin="dense"
              label="Password"
              type="password"
              fullWidth
              value={editingUserPassword}
              onChange={(e) => setEditingUserPassword(e.target.value)}
            />
          )}
          <TextField
            margin="dense"
            label="First Name"
            fullWidth
            value={editingUserMetadata?.first_name || ''}
            onChange={(e) => setEditingUserMetadata((prev: UserMetadata | null) => ({
              ...prev,
              first_name: e.target.value
            }))}
          />
          <TextField
            margin="dense"
            label="Last Name"
            fullWidth
            value={editingUserMetadata?.last_name || ''}
            onChange={(e) => setEditingUserMetadata((prev: UserMetadata | null) => ({
              ...prev,
              last_name: e.target.value
            }))}
          />
          <TextField
            margin="dense"
            label="Phone"
            fullWidth
            value={editingUserMetadata?.phone || ''}
            onChange={(e) => setEditingUserMetadata((prev: UserMetadata | null) => ({
              ...prev,
              phone: e.target.value
            }))}
          />
          <Select
            value={editingUserMetadata?.role || ''}
            onChange={(e) => setEditingUserMetadata((prev: UserMetadata | null) => ({
              ...prev,
              role: e.target.value
            }))}
            fullWidth
          >
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="user">User</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          {actionType === 'create' && (
            <Button onClick={handleCreateUser}>Create</Button>
          )}
          {actionType === 'edit' && (
            <Button onClick={handleUpdate}>Update</Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
};
