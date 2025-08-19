import { supabaseAdminAuth, AdminAuthUser, AdminAuthUserList } from '../supabase/client';
import { UserMetadata } from '../types/auth';

export interface User extends AdminAuthUser {}

export interface NewUser {
  email: string;
  password: string;
  user_metadata: UserMetadata;
}

export interface UpdateUser {
  id: string;
  user_metadata: UserMetadata;
}

import { Database } from '../types/database';

export const getUsers = async (): Promise<Database['auth']['Tables']['users']['Row'][]> => {
  const { users } = await supabaseAdminAuth.listUsers();
  return users.map(user => user.user);
};

export const createUser = async (userData: NewUser): Promise<Database['auth']['Tables']['users']['Row']> => {
  const { user } = await supabaseAdminAuth.createUser(userData.email, userData.password, userData.user_metadata);
  return user;
};

export const updateUser = async (userData: UpdateUser): Promise<Database['auth']['Tables']['users']['Row']> => {
  const { user } = await supabaseAdminAuth.updateUser(userData.id, userData.user_metadata);
  return user;
};

export async function deleteUser(userId: string): Promise<void> {
  await supabaseAdminAuth.deleteUser(userId);
}

export const updateUserRole = async (userId: string, newRole: string): Promise<void> => {
    if (!userId) throw new Error('User ID is required');
    if (!newRole) throw new Error('New role is required');

    const { users } = await supabaseAdminAuth.listUsers();
    const userData = users.find((user: { user: Database['auth']['Tables']['users']['Row'] }) => user.user.id === userId);
    if (!userData) throw new Error('User not found');
    
    await supabaseAdminAuth.updateUser(userId, { 
        user_metadata: { 
            first_name: userData.user.user_metadata.first_name,
            last_name: userData.user.user_metadata.last_name,
            phone: userData.user.user_metadata.phone,
            role: newRole
        }
    });
};
