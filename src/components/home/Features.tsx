import { MdLocalShipping } from 'react-icons/md';
import { IoShieldCheckmark } from 'react-icons/io5';
import { MdOutlineSupportAgent } from 'react-icons/md';
import { FaCreditCard } from 'react-icons/fa';

export const Features = () => {
  return (
    <div className="grid grid-cols-2 gap-8 mt-6 mb-16 lg:grid-cols-4 lg:gap-5">
        <div className="flex items-center gap-6">
            <MdLocalShipping size={40} className='text-slate-600'/>
            <div className='space-y-1'>
                <p className='font-semibold'>Envíos a todo el Pais</p>
                <p className='text-sm'>En todos nuestros productos</p>
            </div>
        </div>

        <div className="flex items-center gap-6">
            <IoShieldCheckmark  size={40} className='text-slate-600'/>
            <div className='space-y-1'>
                <p className='font-semibold'>Garantías</p>
                <p className='text-sm'>Todos nuestros productos poseen garantía</p>
            </div>
        </div>

        <div className="flex items-center gap-6">
            <FaCreditCard size={40} className='text-slate-600'/>
            <div className='space-y-1'>
                <p className='font-semibold'>Medios de Pagos</p>
                <p className='text-sm'>Elegí pagar con débito, efectivo o transferencia </p>
            </div>
        </div>

        <div className="flex items-center gap-6">
            <MdOutlineSupportAgent size={40} className='text-slate-600'/>
            <div className='space-y-1'>
                <p className='font-semibold'>Soporte</p>
                <p className='text-sm'>Envianos tu consulta en cualquier momento</p>
            </div>
        </div>

        
    </div>
  )
}


