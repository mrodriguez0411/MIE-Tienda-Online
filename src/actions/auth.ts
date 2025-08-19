import { createSupabaseClient, supabaseAdminAuth } from "../supabase/client";
import supabase from "../supabase/client";

interface IAuthLogin{
    email: string;
    password: string;
}

interface IAuthRegister {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    role?: 'customer' | 'admin';
}

export const signUp = async({
    email,
    password,
    firstName,
    lastName,
    phone,
    role = 'customer', // Valor por defecto
}: IAuthRegister)=>{
    try{
        // Crear cliente admin
        const supabaseAdmin = createSupabaseClient({
            auth: {
                autoRefreshToken: false,
                persistSession: false,
                flowType: 'pkce'
            }
        });

        console.log('Registrando usuario con rol:', role);

        // Crear usuario
        const { data: signUpData, error: signUpError } = await supabaseAdmin.auth.signUp({
            email,
            password,
            options: {
                data: {
                    first_name: firstName,
                    last_name: lastName,
                    phone,
                    role // Guardar el rol en los metadatos del usuario
                }
            }
        });
        
        console.log('Datos de registro:', { 
            userId: signUpData?.user?.id, 
            email: signUpData?.user?.email,
            role,
            error: signUpError 
        });

        // Si hay un error al crear el usuario, lanzar el error
        if (signUpError) throw signUpError;

        // Si el usuario se creó correctamente, actualizar el rol
        if (signUpData?.user) {
            console.log('Actualizando metadatos del usuario con rol:', role);
            const { data: updateData, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
                signUpData.user.id,
                { 
                    user_metadata: { 
                        role,
                        first_name: firstName,
                        last_name: lastName,
                        phone
                    } 
                }
            );

            if (updateError) {
                console.error('Error al actualizar metadatos del usuario:', updateError);
                throw updateError;
            }

            console.log('Usuario creado y actualizado correctamente:', updateData);
        }

        // El error ya se maneja arriba, eliminando código duplicado

        const userId = signUpData.user?.id;
        
        if (!userId) {
            throw new Error('Se generó un error al obtener el id del usuario');
        }

        // Actualizar el rol en el user_metadata
        const { data: updateData, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
            user_metadata: {
                role: role || 'customer'
            }
        });

        if (updateError) {
            throw new Error(updateError.message);
        }

        // Iniciar sesión
        const { error: signInError } = await supabaseAdmin.auth.signInWithPassword({
            email,
            password,
        });
        if (signInError){
            throw new Error('Email o contraseña incorrectos');
        }

        return {
            user: signUpData.user,
            session: signUpData.session
        };

    }catch (error){
        console.log(error);
        throw new Error('Error al registrar el usuario')
    }

};

export const signIn = async ({email, password}:IAuthLogin) =>{
    const {data, error} = await supabase.auth.signInWithPassword({
        email,
        password
    })

    if(error) {
        console.log(error);
        throw new Error('Email o contraseña incorrectos');
    }

    // Asegurarnos de que el rol esté disponible en el metadata
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) {
        console.log(userError);
        throw new Error('Error al obtener los datos del usuario');
    }

    return data;
}

export const signOut = async () =>{
    const { error } = await supabase.auth.signOut();
    if (error){
        throw new Error('Error al cerrar sesión')
    }
};

export const getSession = async ()=>{
    const {error, data} = await supabase.auth.getSession();

    if(error){
        throw new Error('Error al obtener la sesión')
    }

    return data;

}
//para las iniciales del nombre en el navbar
export const getUserData = async(userId: string) =>{
    const {data, error} = await supabase
    .from('customers')
    .select('*')
    .eq('user_id', userId)
    .single();

    if (error){
        console.log(error);
        throw new Error('Error al obtener los datos del usuario');
    }

    return data;
}
// Función para obtener el rol de un usuario por su ID
export const getUserRole = async (userId: string): Promise<string> => {
    if (!userId) {
        console.error('Error: Se requiere un ID de usuario');
        return 'customer'; // Valor por defecto
    }

    try {
        console.log(`Obteniendo rol para el usuario con ID: ${userId}`);
        
        // Primero intentamos obtener el rol desde la tabla user_roles
        const { data: roleData, error: roleError } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', userId)
            .single();

        if (!roleError && roleData) {
            console.log('Rol obtenido de la tabla user_roles:', roleData.role);
            return roleData.role;
        }

        console.log('No se encontró el rol en user_roles, buscando en metadatos...');
        
        // Si no se encuentra en user_roles, buscamos en los metadatos del usuario
        const { data: userData, error: userError } = await supabase.auth.admin.getUserById(userId);
        
        if (userError) {
            console.error('Error al obtener el usuario:', userError);
            return 'customer';
        }
        
        if (!userData?.user) {
            console.error('Usuario no encontrado para el ID:', userId);
            return 'customer';
        }
        
        // Mostrar todos los metadatos del usuario para depuración
        console.log('Datos completos del usuario:', {
            id: userData.user.id,
            email: userData.user.email,
            user_metadata: userData.user.user_metadata,
            app_metadata: userData.user.app_metadata
        });
        
        // Buscar el rol en diferentes ubicaciones de metadatos
        const role = userData.user.user_metadata?.role || 
                    userData.user.app_metadata?.role || 
                    'customer';
        
        console.log('Rol obtenido de metadatos:', role);
        
        // Sincronizar el rol en la tabla user_roles si es diferente
        if (role !== 'customer') {
            console.log('Sincronizando rol en la tabla user_roles...');
            const { error: syncError } = await supabase
                .from('user_roles')
                .upsert(
                    { user_id: userId, role },
                    { onConflict: 'user_id' }
                );
            
            if (syncError) {
                console.error('Error al sincronizar el rol:', syncError);
            } else {
                console.log('Rol sincronizado correctamente en user_roles');
            }
        }
        
        return role;
        
    } catch (error) {
        console.error('Error en getUserRole:', error);
        return 'customer'; // Valor por defecto en caso de error
    }
}