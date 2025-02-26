import { NavLink, Link } from "react-router-dom";
import { navbarLinks } from "../../constants/links";
import { HiOutlineSearch, HiOutlineShoppingBag, HiOutlineUser } from "react-icons/hi";
import { FaBarsStaggered } from "react-icons/fa6";
import { Logo } from "./Logo";
import { useGlobalStore } from "../../store/global.store";
import { useCartStore } from "../../store/cart.store";
import { useUser } from "../../hooks";
import { LuLoader } from "react-icons/lu";

export const Navbar = () => {
  
  const openSheet = useGlobalStore(state => state.openSheet);

  const totalItemsInCart = useCartStore(
    state => state.totalItemsInCart
  );

  const setActiveNavMobile = useGlobalStore(state => state.setActiveNavMobile);

  const {session, isLoading} = useUser();
  const userId = session?.user.id;

  return (
    <header className="bg-white text-black py-4 flex items-center justify-between px-5 border-b border-slate-200 lg:px-12">
      <Logo />
      <nav className="space-x-5 hidden md:flex">
        {navbarLinks.map(link => (
          <NavLink
            key={link.id}
            to={link.url}
            className={({ isActive }) => `${
              isActive ? 'text-cyan-500 underline' : ''
            } 
                transition-all duration-300 font-medium hover:text-cyan-500 hover:underline`}
          >
            {link.text}
          </NavLink>
        ))}
      </nav>
      <div className="flex gap-5 items-center" >
        <button onClick={() => openSheet('search')}>
          <HiOutlineSearch size={25} />
        </button>

        {
          isLoading ? (
            <LuLoader  className="animate-spin" size={60}/>
          ) : session ? (
            <div className="relative">
            {/*User Nav*/}
            <Link
              to="/account"
              className="border-2 border-cyan-700 w-9 h-9 rounded-full grid place-items-center text-lg font-bold"
            >
              R
            </Link>
          </div>
          ) : (
            <Link to='/login'>
              <HiOutlineUser size={25}/>
            </Link> 
          )
        }
        <button className="relative" onClick={() => openSheet('cart')}>
          <span className="absolue -bottom-2 -right-2 w-5 h-5 grid place-items-center bg-cyan-700 text-white text-xs rounded-full">
            {totalItemsInCart}
          </span>
          <HiOutlineShoppingBag size={25} />
        </button>

        <button className="md:hidden" onClick={() => setActiveNavMobile(true)}>
          <FaBarsStaggered size={25} />
        </button>
      </div>
    </header>
  );
};
