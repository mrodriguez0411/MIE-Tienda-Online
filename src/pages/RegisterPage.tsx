import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, Navigate } from "react-router-dom";
import { z } from "zod";
import { useRegister, useUser } from "../hooks";
import { LuLoader } from "react-icons/lu";
import { Loader } from "../components/shared/Loader";

//validación del form con zod

export const userRegisterSchema = z.object({
  email: z.string().email("Ingrese una dirección de correo válida"),
  password: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .regex(/[A-Z]/, "La contraseña debe contener al menos una letra mayúscula")
    .regex(/\d/, "La contraseña debe contener al menos un número")
    .regex(
      /[^a-zA-Z0-9]/,
      "La contraseña debe contener al menos un carácter especial"
    ),
  firstName: z.string().min(1, "Debe ingresar un nombre"),
  lastName: z.string().min(1, "Debe ingresar el apellido"),
  phone: z.string().optional(),
});
export type UserRegisterFormValues = z.infer<typeof userRegisterSchema>;

export const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserRegisterFormValues>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phone: "",
    },
    resolver: zodResolver(userRegisterSchema),
  });
  const{mutate, isPending} = useRegister();
  
  const onRegister = handleSubmit((data) => {
    const{email, password, firstName, lastName, phone} = data;

    mutate({email, password, firstName, lastName, phone})
  });

  const {session, isLoading} = useUser();
  if(isLoading) return <Loader/>
  if(session) return <Navigate to='/'/>

  return (
    <div className="h-full flex flex-col items-center mt-12 gap-5">
      <h1 className="text-4xl font-bold capitalize">Regístrate</h1>
      <p className="text-center text-gray-700">
        Por favor, complete los siguientes campos para crear su cuenta.
      </p>
      {isPending ? (
        <div className="w-full h-full flex justify-center mt-20">
            <LuLoader className="animate-spin" size={60}/>
        </div>
      ):(
        <>
        <form
          className="flex flex-col items-center gap-4 w-full mt-10 sm:w[400px] lg:w-[500px]"
          onSubmit={onRegister}
        >
          <input
            type="text"
            placeholder="Ingrese su nombre"
            className="border border-cyan-800 text-black px-5 py-4 placeholder: text-black text-sm rounded-full w-full"
            {...register("firstName")}
          />
          {errors.firstName && (
            <p className="text-red-600">{errors.firstName.message}</p>
          )}

          <input
            type="text"
            placeholder="Ingrese su apellido"
            className="border border-cyan-800 text-black px-5 py-4 placeholder: text-black text-sm rounded-full w-full"
            {...register("lastName")}
          />
          {errors.lastName && (
            <p className="text-red-600">{errors.lastName.message}</p>
          )}

          <input
            type="text"
            placeholder="Ingrese su número de teléfono"
            className="border border-cyan-800 text-black px-5 py-4 placeholder: text-black text-sm rounded-full w-full"
            {...register("phone")}
          />
          <input
            type="email"
            placeholder="Ingrese su correo electrónico"
            className="border border-cyan-800 text-black px-5 py-4 placeholder: text-black text-sm rounded-full w-full"
            {...register("email")}
          />
          {errors.email && <p className="text-red-600">{errors.email.message}</p>}

          <input
            type="password"
            placeholder="Ingrese su contraseña"
            className="border border-cyan-800 text-black px-5 py-4 placeholder: text-black text-sm rounded-full w-full"
            {...register("password")}
          />
          {errors.password && <p className="text-red-600">{errors.password.message}</p>}

          <button className="bg-cyan-700 text-white uppercase font-semibold tracking-tighter text-xs py-4 rounded-full mt-5 w-full hover:bg-cyan-600">
            Registrarse
          </button>
        </form>

        <p className="text-center text-gray-700 mt-6">
          ¿Ya tienes una cuenta?
          <Link to="/login" className="text-cyan-700 font-semibold ml-2">
            Inicia Sesión
          </Link>
        </p>
      </>
      )

      }
    </div>
  );
};
