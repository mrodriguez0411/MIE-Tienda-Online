import { Link } from 'react-router-dom';

interface Props{
  isDashboard?:boolean; 
}

export const Logo = ({isDashboard}:Props) => {
  return (
    <Link
      to="/"
      className={`flex items-center space-x-2 text-2xl font-bold tracking-tighter transition-all
  ${isDashboard &&  'hover:scale-105 items-start'}`}
    >
      <div className="rounded-full overflow-hidden w-20 h-20 flex-shrink-0">
        <img
          src="../../public/img/logo.jpg"
          alt="Imagen de fondo"
          className="w-full h-full object-cover  lg:block"
        />
      </div>
      <div className='flex flex-col'>
        {/* Texto para pantallas grandes */}
        <p className="hidden lg:block">
          MIE-Tienda Online
          <span className="text-cyan-600 "> Polirubro</span>
        </p>
        
      </div>
    </Link>
  );
};
