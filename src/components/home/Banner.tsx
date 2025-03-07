import { Link } from 'react-router-dom';

export const Banner = () => {
  return (
    <div className="relative bg-gray-900 text-white">
        <div
            className="absolute inset-0  bg-cover bg-center opacity-70 h-full"
            style={{ backgroundImage: 'url(/img/1.jpg)' }} />

        <div className="absolute inset-0 bg-black opacity-50"/>

        <div className="relative z-10 flex flex-col items-center justify-center py-20 px-4 text-center lg:py-40 lg:px-8">
            <h1 className="text-4xl font-bold mb-4 lg:text-6xl">Bienvenidos a MIE-Tienda Online!
            </h1>
            <p className="text-lg mb-8 lg:text-2xl">Encuentra los mejores productos a los mejores precios.
            </p>
            <Link to='/productos' className="bg-cyan-900 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-full shadow-lg transition duration-300 ease-in-out">
            Ver Productos
            </Link>
        </div>
        
    </div>
  )
}
