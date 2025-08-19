import { Outlet, useNavigate, Navigate } from "react-router-dom";
import { Sidebar } from "../components/dashboard";
import { useUser } from "../hooks";
import { useEffect, useState } from "react";
import supabase from "../supabase/client";

export const DashboardLayout = () => {
  const { session } = useUser();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    const checkRole = async () => {
      setRoleLoading(true);
      if (!session) {
        return;
      }

      const role = session.user.user_metadata?.role;
      setIsAdmin(role === 'admin');
      setRoleLoading(false);
    };
    checkRole();
  }, [session]);

  useEffect(() => {
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        navigate('/login', {replace: true});
      }
    });
  }, [navigate]);

  if (!session?.user || roleLoading) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/productos" replace />;
  }

  return (
    <div className="flex bg-gray-100 min-h-screen font-roboto">
      <Sidebar />
      <main className="container m-5 mt-7 flex-1 text-slate-800 ml-[140px] lg:ml-[270px]">
        <Outlet />
      </main>
    </div>
  );
};
