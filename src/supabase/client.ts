import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';
import { UserMetadata } from '../types/auth';

export type AdminAuthUser = Database['auth']['Tables']['users']['Row'];
export type AdminAuthUserList = { users: { user: AdminAuthUser }[] };

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create a separate client for admin operations
const supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    flowType: 'pkce'
  }
});

// Export the public client as default
export default supabaseAdmin;

// Export admin-specific methods
export const supabaseAdminAuth = {
  listUsers: async (): Promise<{ users: { user: Database['auth']['Tables']['users']['Row'] }[] }> => {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers();
    if (error) throw error;
    return {
      users: data.users.map((user: any) => ({
        user: {
          id: user.id,
          email: user.email,
          user_metadata: user.user_metadata,
          created_at: user.created_at,
          updated_at: user.updated_at
        }
      }))
    };
  },
  createUser: async (email: string, password: string, userMetadata: UserMetadata): Promise<{ user: Database['auth']['Tables']['users']['Row'] }> => {
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      user_metadata: userMetadata,
      email_confirm: true
    });
    if (error) throw error;
    return { user: data.user };
  },
  updateUserById: async (userId: string, userMetadata: UserMetadata): Promise<{ user: Database['auth']['Tables']['users']['Row'] }> => {
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      user_metadata: userMetadata
    });
    if (error) throw error;
    return { user: data.user };
  },
  deleteUser: async (userId: string): Promise<void> => {
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (error) throw error;
  }
};

export const createSupabaseClient = (options?: any) => {
  return createClient<Database>(supabaseUrl, supabaseKey, {
    auth: {
      flowType: 'pkce'
    }
  });
};
