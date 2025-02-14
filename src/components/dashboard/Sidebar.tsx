import { NavLink } from "react-router-dom"
import { Logo } from "../shared/Logo"
import {dashboardLinks} from "../../constants/links"
import { AiOutlineLogout } from "react-icons/ai"
import { IoLogOutOutline } from "react-icons/io5"
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
        <button
				className='bg-red-500 w-full py-[10px] rounded-md flex items-center justify-center gap-2 font-semibold text-sm hover:underline'
				onClick={handleLogout}
			>
				<span className='hidden lg:block'>Cerrar sesión</span>
				<IoLogOutOutline size={20} className='inline-block' />
			</button>
    </div>
  )
}


