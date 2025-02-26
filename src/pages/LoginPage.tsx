import { useState } from "react";
import { LuLoader } from "react-icons/lu";
import { Link, Navigate } from "react-router-dom";
import { useLogin, useUser } from "../hooks";
import { Loader } from "../components/shared/Loader";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const {mutate, isPending} = useLogin();
  const { session, isLoading } = useUser();

  const onLogin = (e: React.FormEvent)=>{
    e.preventDefault();
    mutate({email, password});
  };
  if (isLoading) return <Loader />;

	if (session) return <Navigate to='/' />;
  
  return (
    <div className="h-full flex flex-col items-center mt-12 gap-5">
      <h1 className="text-4xl font-bold capitalize">Iniciar Sesión</h1>
      <p className="text-center text-gray-700">
        Por favor, ingrese sus credenciales para acceder a su cuenta.
      </p>

      {isPending ? (
        <div className="w-full h-full flex justify-center mt-20">
          <LuLoader className="animate-spin" size={60} />
        </div>
      ) : (
        <>
          <form className="flex flex-col items-center gap-4 w-full mt-10 sm:w[400px] lg:w-[500px]" onSubmit={onLogin}>
            <input
              type="email"
              placeholder="Ingrese su correo electrónico"
              className="border border-cyan-800 text-black px-5 py-4 placeholder: text-black text-sm rounded-full w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Ingrese su contraseña"
              className="border border-cyan-800 text-black px-5 py-4 placeholder: text-black text-sm rounded-full w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p className="text-center text-gray-700 mt-6">
              <Link to="/registro" className="text-cyan-700 font-semibold ml-2">
                ¿Olvidaste tu contraseña?
              </Link>
            </p>

            <button className="bg-cyan-700 text-white uppercase font-semibold tracking-tighter text-xs py-4 rounded-full mt-5 w-full hover:animate-bounce">
              Iniciar Sesión
            </button>
          </form>

          <p className="text-center text-gray-700 mt-6">
            ¿No tienes una cuenta?
            <Link to="/registro" className="text-cyan-700 font-semibold ml-2">
              Regístrate aquí
            </Link>
          </p>
        </>
      )}
    </div>
  );
};
