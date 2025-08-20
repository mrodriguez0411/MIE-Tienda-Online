import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Sidebar } from "../components/dashboard";
import { useUser } from "../hooks";
import { useEffect, useState } from "react";
import supabase from "../supabase/client";

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-700"></div>
  </div>
);

export const DashboardLayout = () => {
  const { session, isAdmin: isUserAdmin, isLoading } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Handle authentication and authorization
  useEffect(() => {
    let isMounted = true;

    const checkAuthAndRole = async () => {
      try {
        // If still loading user data, wait
        if (isLoading) {
          console.log('Loading user data...');
          return;
        }

        // If no session, redirect to login
        if (!session?.user) {
          console.log('No active session, redirecting to login');
          navigate('/login', { replace: true, state: { from: location } });
          return;
        }

        console.log('User session found, checking admin status...');
        
        // Check if user is admin from useUser hook or user metadata
        let isAdmin = isUserAdmin || session.user.user_metadata?.role === 'admin';
        
        // If not admin yet, check database
        if (!isAdmin) {
          console.log('Checking admin status in database for user:', session.user.id);
          const { data: userRole, error } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', session.user.id)
            .single();

          if (error || !userRole || userRole.role !== 'admin') {
            console.log('User is not an admin, redirecting to /productos');
            if (isMounted) {
              navigate('/productos', { replace: true });
            }
            return;
          }
          isAdmin = true;
        }

        console.log('User is authorized as admin');
        if (isMounted) {
          setIsAuthorized(true);
        }
      } catch (error) {
        console.error('Error during authentication check:', error);
        if (isMounted) {
          navigate('/login', { replace: true, state: { from: location } });
        }
      } finally {
        if (isMounted) {
          setIsCheckingAuth(false);
        }
      }
    };

    checkAuthAndRole();

    return () => {
      isMounted = false;
    };
  }, [session, isUserAdmin, isLoading, navigate, location]);

  // Show loading spinner while checking auth
  if (isCheckingAuth || isLoading) {
    return <LoadingSpinner />;
  }

  // If not authorized, don't render anything (will be redirected)
  if (!isAuthorized) {
    return null;
  }

  // If we get here, the user is authenticated and is an admin
  return (
    <div className="flex bg-gray-100 min-h-screen font-roboto">
      <Sidebar />
      <main className="container m-5 mt-7 flex-1 text-slate-800 ml-[140px] lg:ml-[270px]">
        <Outlet />
      </main>
    </div>
  );
};
