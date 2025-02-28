import { supabase } from "../supabase/client";

interface IAuthLogin{
    email: string;
    password: string;
}

interface IAuthRegister {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?:string;
}

export const signUp = async({
    email,
    password,
    firstName,
    lastName,
    phone,

}: IAuthRegister)=>{
    try{
        //creo el usuario
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });
        if (error){
            throw new Error(error.message);
        }
        const userId = data.user?.id;

        if (!userId){
            throw new Error('Se genero un error al obtener el id del usuario');
        }
        // autenticar usuario e iniciar sesion
        const {error: signInError} = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (signInError){
            throw new Error('Email o contraseña incorrectos');
        };
        //le asigno el rol por defecto que es CUSTOMER (cliente)
        const {error: roleError} = await supabase.from('user_roles').insert({
            user_id: userId,
            role: 'customer',
        });
        if (roleError){
            throw new Error('Error al registrar el rol del usuario');
        };
        //inserto los datos del usuario en tabla customer(clientes) de mi base de datos
        const {error : customerError} = await supabase.from('customers').insert({
            user_id: userId,
            first_name: firstName,
            last_name: lastName,
            email,
            phone,
        })
        if (customerError){
            throw new Error('Error al crear usuario');
        }
        return data

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

//funcion para conseguir el rol del uasuario que se loguea
export const getUserRole = async(userId: string) =>{
    const {data, error} = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .single();

    if (error){
        console.log(error);
        throw new Error('Error al obtener el role del usuario logueado');
    }

    return data.role;
};