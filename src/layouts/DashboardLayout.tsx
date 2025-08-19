import { Outlet, useNavigate } from "react-router-dom";
import { Sidebar } from "../components/dashboard";
import { useUser } from "../hooks";
import { useEffect, useState, useCallback } from "react";
import supabase from "../supabase/client";

export const DashboardLayout = () => {
  const { session, isAdmin: isUserAdmin } = useUser();
  const navigate = useNavigate();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuthAndRole = useCallback(async () => {
    console.log('Verificando autenticación y rol...');
    
    // Si no hay sesión, redirigir a login
    if (!session?.user) {
      console.log('No hay sesión activa, redirigiendo a login');
      return { shouldRedirect: true, redirectTo: '/login' };
    }

    console.log('Usuario autenticado, verificando rol...');
    
    // Si el hook useUser ya nos dice que es admin, continuar
    if (isUserAdmin) {
      console.log('Usuario es administrador (según useUser)');
      return { shouldRedirect: false };
    }

    // Si no es admin según useUser, verificar en la base de datos
    try {
      console.log('Buscando rol en la base de datos para el usuario:', session.user.id);
      
      const { data: userRole, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .single();

      if (error || !userRole) {
        console.log('No se encontró rol en la base de datos, revisando metadatos...');
        const role = session.user.user_metadata?.role || 'customer';
        console.log('Rol en metadatos:', role);
        
        if (role !== 'admin') {
          console.log('Usuario no es administrador, redirigiendo a /productos');
          return { shouldRedirect: true, redirectTo: '/productos' };
        }
      } else if (userRole.role !== 'admin') {
        console.log('Usuario no es administrador según la base de datos, redirigiendo a /productos');
        return { shouldRedirect: true, redirectTo: '/productos' };
      }

      console.log('Usuario es administrador');
      return { shouldRedirect: false };
      
    } catch (error) {
      console.error('Error al verificar el rol:', error);
      return { shouldRedirect: true, redirectTo: '/productos' };
    }
  }, [session, isUserAdmin]);

  useEffect(() => {
    let isMounted = true;

    const initialize = async () => {
      if (!isMounted) return;
      
      setIsLoading(true);
      const { shouldRedirect, redirectTo } = await checkAuthAndRole();
      
      if (!isMounted) return;
      
      if (shouldRedirect && redirectTo) {
        console.log(`Redirigiendo a: ${redirectTo}`);
        navigate(redirectTo, { replace: true });
      } else {
        console.log('Usuario autorizado, mostrando dashboard');
        setIsInitialized(true);
      }
      
      setIsLoading(false);
    };

    initialize();

    return () => {
      isMounted = false;
    };
  }, [checkAuthAndRole, navigate]);

  // Mostrar indicador de carga mientras se verifica todo
  if (isLoading || !isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-700"></div>
      </div>
    );
  }

  // Si llegamos aquí, el usuario está autenticado y es administrador

  return (
    <div className="flex bg-gray-100 min-h-screen font-roboto">
      <Sidebar />
      <main className="container m-5 mt-7 flex-1 text-slate-800 ml-[140px] lg:ml-[270px]">
        <Outlet />
      </main>
    </div>
  );
};
