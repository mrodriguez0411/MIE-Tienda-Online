import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "../components/shared/Navbar";
import { Footer } from "../components/shared/Footer";
import { Ofertas} from "../components/home/Ofertas";
import { Banner } from "../components/home/Banner";
import { Sheet } from "../components/shared/Sheet";
import { useGlobalStore } from "../store/global.store";

export const RootLayout = () => {
  const { pathname } = useLocation();
  
  const isSheetOpen = useGlobalStore((state) => state.isSheetOpen);
  return (
    <div className='h-screen flex flex-col font-roboto '>
      <Navbar />

      {pathname === "/" && (
        <Banner/>
      )}

      <main className="container my-5 flex-1">
        <Outlet />
      </main>

      {pathname === "/" && (
        <Ofertas/>
      )}

      {isSheetOpen && <Sheet />}
      <Footer />

    </div>
  );
};
