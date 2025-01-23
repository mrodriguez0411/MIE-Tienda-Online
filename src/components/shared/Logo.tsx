/*import { Link } from 'react-router-dom'

export const Logo = () =>{
  return (
    <Link to='/' className={`text-2xl font-bold tracking-tighter transition-all`}>
      <div className="rounded-full overflow-hidden w-20">
        <img src="../../public/img/logo.jpg" alt="Imagen de fondo" className="w-full object-cover"/>
      </div>
        <p className='hidden lg:block'>
            MIE-Tienda Online
            <span className='text-cyan-600'> Polirubro </span>
        </p>
        <p className='flex text-4xl lg:hidden'>
            <span className='-skew-x-6'>MIE - </span>
            <span className='text-cyan-600 skew-x-6'>TiendaOnline</span>    
        </p>
    </Link>
    
  );
};*/
import { Link } from 'react-router-dom';

export const Logo = () => {
  return (
    <Link
      to="/"
      className="flex items-center space-x-2 text-2xl font-bold tracking-tighter transition-all"
    >
      <div className="rounded-full overflow-hidden w-20 h-20 flex-shrink-0">
        <img
          src="../../public/img/logo.jpg"
          alt="Imagen de fondo"
          className="w-full h-full object-cover"
        />
      </div>
      <div>
        {/* Texto para pantallas grandes */}
        <p className="hidden lg:block">
          MIE-Tienda Online
          <span className="text-cyan-600"> Polirubro </span>
        </p>
        {/* Texto para pantallas pequeñas */}
        <p className="flex text-4xl lg:hidden">
          <span className="-skew-x-6">MIE - </span>
          <span className="text-cyan-600 skew-x-6">TiendaOnline</span>
        </p>
      </div>
    </Link>
  );
};
