import { useQuery } from '@tanstack/react-query';
import { getSession, getUserRole } from '../../actions';
import { toast } from 'react-hot-toast';
import { Session } from '@supabase/supabase-js';
import { useEffect } from 'react';

export const useUser = () => {
  const { 
    data: sessionData, 
    isLoading: isLoadingSession,
    error: sessionError
  } = useQuery<{ session: Session | null }>({
    queryKey: ['user'],
    queryFn: getSession,
    retry: false,
    refetchOnWindowFocus: true,
  });

  // Manejar errores de sesión
  if (sessionError) {
    console.error('Error al obtener la sesión:', sessionError);
    toast.error('Error al cargar la sesión del usuario');
  }

  const user = sessionData?.session?.user;
  if (user) {
    console.log('Sesión obtenida:', {
      userId: user.id,
      email: user.email,
      user_metadata: user.user_metadata
    });
  }

  const { 
    data: userRole, 
    isLoading: isLoadingRole,
    error: roleError 
  } = useQuery<string | null>({
    queryKey: ['userRole', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        console.log('No hay ID de usuario, no se puede obtener el rol');
        return null;
      }
      try {
        console.log('Obteniendo rol para el usuario ID:', user.id);
        const role = await getUserRole(user.id);
        console.log('Rol obtenido para el usuario:', { 
          userId: user.id, 
          role,
          userMetadata: user.user_metadata
        });
        return role;
      } catch (error) {
        console.error('Error al obtener el rol del usuario:', error);
        toast.error('Error al cargar el rol del usuario');
        return 'customer'; // Valor por defecto en caso de error
      }
    },
    enabled: !!user?.id,
    retry: 1,
    refetchOnWindowFocus: true
  });

  // Logs adicionales
  useEffect(() => {
    if (userRole) {
      console.log('Rol cargado exitosamente:', userRole);
    }
  }, [userRole]);

  useEffect(() => {
    if (roleError) {
      console.error('Error en la consulta del rol:', roleError);
    }
  }, [roleError]);

  // Manejar errores de rol
  if (roleError) {
    console.error('Error al obtener el rol del usuario:', roleError);
    toast.error('Error al cargar el rol del usuario');
  }

  // Debug: Mostrar información del estado actual
  console.log('Estado actual:', {
    user,
    userRole,
    isAdmin: userRole === 'admin',
    sessionError: sessionError?.message,
    roleError: roleError?.message
  });

  // Combinar los datos del usuario con su rol
  const role = userRole || 'customer';
  const userWithRole = user ? {
    ...user,
    role
  } : null;

  const isAdmin = role === 'admin';
  
  console.log('Usuario con rol:', { 
    userId: user?.id, 
    role,
    isAdmin
  });

  return {
    session: sessionData?.session ? {
      ...sessionData.session,
      user: userWithRole
    } : null,
    user: userWithRole,
    isLoading: isLoadingSession || (!!user && isLoadingRole),
    isAdmin,
  };
};