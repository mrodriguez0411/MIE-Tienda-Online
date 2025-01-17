import { Link } from "react-router-dom";
import { socialLinks } from "../../constants/links";
import { FaWhatsappSquare } from "react-icons/fa";
export const Footer = () => {
  return (<footer className='py-14 bg-cyan-950 px-12 flex justify-between gap-10 text-slate-300 text-sm flex-wrap mt-10 md:flex-nowrap'>
    <Link to='/' className={`text-2xl font-bold tracking-tighter transition-all text-white flex-1`}>
            MIE - Tienda Online
    </Link>
    <div className="flex flex-col gap-5 flex-1">
        <p className="font-semibold uppercase tracking-tighter">Contacto</p>
        <div className="flex text-6xl flex-col gap-5">
        <FaWhatsappSquare />

        
    </div>    
    </div>
    <div className="flex flex-col gap-5 flex-1">
        <p className="font-semibold uppercase tracking-tighter">Políticas</p>
        <nav className="flex flex-col gap-2 text-xs font-medium">
            <Link to='#' className="text-slate-300 hover:text-white">Políticas de devolución</Link>
            <Link to='#' className="text-slate-300 hover:text-white">Políticas de privacidad</Link>
            <Link to='#' className="text-slate-300 hover:text-white">Términos de uso</Link>
        </nav>
    </div>
    <div className="flex flex-col gap-5 flex-1">
        <p className="font-semibold uppercase tracking-tighter">Síguenos</p>
        <div className="flex">
        {
            socialLinks.map((link) => (
                    <a 
                    key={link.id} 
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-300 border border-gray-8000 w-full h-full py-3.5 flex items-center justify-center transition-all hover:bg-white hover:text-gray-900 rounded-md">
                    {link.icon}
                    </a>
                ))
        }
    </div>    
    </div>
  </footer>
  );   
};
