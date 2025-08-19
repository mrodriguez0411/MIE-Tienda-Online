import { createSupabaseClient } from '../supabase/client';

const supabaseAdmin = createSupabaseClient({
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

interface AdminData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

async function createAdminUser(adminData: AdminData) {
  try {
    // Crear usuario
    const { data: authData, error: authError } = await supabaseAdmin.auth.signUp({
      email: adminData.email,
      password: adminData.password,
      options: {
        data: {
          role: 'admin',
          first_name: adminData.firstName,
          last_name: adminData.lastName,
        },
      },
    });

    if (authError) {
      throw new Error(`Error al crear el usuario: ${authError.message}`);
    }

    if (!authData.user) {
      throw new Error('No se pudo crear el usuario');
    }

    console.log('Usuario creado exitosamente');

    // Iniciar sesión
    const { error: signInError } = await supabaseAdmin.auth.signInWithPassword({
      email: adminData.email,
      password: adminData.password,
    });

    if (signInError) {
      throw new Error(`Error al iniciar sesión: ${signInError.message}`);
    }

    console.log('Usuario iniciado sesión exitosamente');

    return authData.user.id;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// Datos del administrador
const adminData = {
  email: 'admin@example.com', // Cambia esto por el email que quieras usar
  password: 'password123', // Cambia esto por la contraseña que quieras usar
  firstName: 'Admin',
  lastName: 'Admin',
};

// Crear el usuario administrador
createAdminUser(adminData)
  .then((userId) => {
    console.log('ID del usuario administrador:', userId);
  })
  .catch((error) => {
    console.error('Error al crear el usuario administrador:', error);
  });
