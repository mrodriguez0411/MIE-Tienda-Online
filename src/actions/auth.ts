import { createSupabaseClient } from "../supabase/client";
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
    role,
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

        // Crear usuario
        const { data: signUpData, error: signUpError } = await supabaseAdmin.auth.signUp({
            email,
            password,
            options: {
                data: {
                    first_name: firstName,
                    last_name: lastName,
                    phone
                }
            }
        });

        if (signUpError) {
            throw new Error(signUpError.message);
        }

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
//funcion para conseguir el rol del usuario que se loguea
export const getUserRole = async(userId: string) => {
    if (!userId) {
        throw new Error('ID de usuario requerido');
    }

    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
        throw new Error('Error al obtener el usuario');
    }
    if (!user) {
        throw new Error('Usuario no encontrado');
    }
    return user.user_metadata?.role || 'customer';
}