import { IoMdClose } from "react-icons/io";
import { useGlobalStore } from "../../store/global.store";
import { Link, NavLink } from "react-router-dom";
import { navbarLinks } from "../../constants/links";

export const NavbarMobile = () => {

    const setActiveNavMobile = useGlobalStore(state => state.setActiveNavMobile);
  return (
    <div className="bg-white text-black h-screen w-full shadow-lg animate-slide-in-left fixed z-50 flex justify-center py-32">
        <button
            className="absolute top-5 right-5"
            onClick={() => setActiveNavMobile(false)}
        >
            <IoMdClose size={30} className="text-black"/>
        </button>
        <div className="flex flex-col gap-20">
            <Link to='/' 
            onClick={() => setActiveNavMobile(false)}
            className="text-4xl font-bold tracking-tighter transition-all"
            >
                <p>
                    MIE -
                    <span className="text-cyan-500">
                        Tienda Online
                    </span> 
                </p>
            </Link>
            <nav className="flex flex-col items-center gap-5">
                {navbarLinks.map(item => (
                <NavLink
                to={item.url}
                key={item.id}
                className={({isActive}) => `${   isActive ? 'text-cyan-500 underline' : ''} transition-all duration-300 font-medium hover:text-cyan-500 hover:underline`}
                onClick={() => setActiveNavMobile(false)}>
                    {item.text}

                </NavLink>
                )
            )}
            </nav>
        </div>
    </div>
  )
}
