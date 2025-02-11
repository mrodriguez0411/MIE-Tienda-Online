import { NavLink } from "react-router-dom"
import { Logo } from "../shared/Logo"
import {dashboardLinks} from "../../constants/links"
import { AiOutlineLogout } from "react-icons/ai"
//import { signOut } from "../../actions"

export const Sidebar = () => {

  const handleLogout = async () =>{
    await signOut();
  }  

  return (
    <div className="w-[120px] bg-cyan-900 text-white flex flex-col gap-10 items-center p-5 fixed h-screen lg:w-[250px]">
        <Logo isDashboard/>
        <nav className="full space-y-5 flex-1">
           {
            dashboardLinks.map(link => (
                <NavLink 
                key={link.id}
                to={link.href}
                className={({isActive}) =>`flex item-center justify-center pl-0 py-3 transition-all duration-300 rounded-md font-bold lg:w-[240px]
                ${isActive ? 'text-white bg-gray-800' : 'hover:text-black hover:bg-cyan-300'} `}
                >
                {link.icon}
                <p className="font-semibold hidden pl-2 lg:block">
                    {link.tittle}
                </p>
                </NavLink>
                    
            ))
           }
        </nav>

        <button className="bg-red-500 py-10 text-black font-bold font rounded-lg flex items-center justify-center gap-2 text-sm
        hover:underline" onClick={handleLogout}> 
            <AiOutlineLogout size={25} className="inline-block"/>
            <span className="hidden lg:block">Cerrar Sesion </span>
            
        </button>
    </div>
  )
}


