const { createSupabaseClient } = require('./src/supabase/client');

const supabaseAdmin = createSupabaseClient({
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const adminData = {
  email: 'admin@example.com',
  password: 'password123',
  firstName: 'Admin',
  lastName: 'Admin',
};

async function createAdminUser() {
  try {
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

    const { error: signInError } = await supabaseAdmin.auth.signInWithPassword({
      email: adminData.email,
      password: adminData.password,
    });

    if (signInError) {
      throw new Error(`Error al iniciar sesión: ${signInError.message}`);
    }

    console.log('Usuario iniciado sesión exitosamente');
    console.log('ID del usuario administrador:', authData.user.id);
  } catch (error) {
    console.error('Error:', error);
  }
}

createAdminUser();
