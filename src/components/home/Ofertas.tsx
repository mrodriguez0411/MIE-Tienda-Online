import { Link } from 'react-router-dom';

export const Ofertas = () => {
  return (
    <div className="relative bg-gray-900 text-white py-20">
        <div
            className="absolute inset-0  bg-cover bg-center opacity-70 h-full"
            style={{ backgroundImage: 'url(/img/3.jpg)' }} />
        
        <div className="container z-10 relative p-5 md:p-0 ">
            <div className='w-full text-black bg-white p-12 space-y-5 md:w-[50%] lg:w-[40%] rounded-md'>
                <p className='text-xs uppercase font-semibold'>
                    Suscríbete para recibir nuestras Ofertas
                </p>
                <p className='text-xs font-medium w-[80%] leading-5'>
                    Recibe las mejores ofertas en tu correo
                </p>
                <form className='flex flex-col gap-5 xl:flex-row '>
                    <input type='email' placeholder='Correo Electrónico' className='border border-slate-300 focus:outline-none rounded-full py-3 px-5 w-full text-xs font-medium'/>
                    <button className='bg-gray-900 text-white font-semibold rounded-md uppercase tracking-wider py-3 text-xs xl:px-5'>Suscribirme</button>
                </form>
            </div>
        </div>
    </div>
  )
}
