import { LuMinus, LuPlus } from "react-icons/lu";
import { Separador } from "../components/shared/Separador";
import { formarPrice } from "../helpers";
import { CiDeliveryTruck } from "react-icons/ci";
import { Link } from "react-router-dom";
import { BsChatLeftText } from "react-icons/bs";
import {ProductDescription}  from "../components/product/ProductDescription";
import { GridImages } from "../components/product/GridImages";

export const ProductoPage = () => {
  return (
    <>
      <div className="h-fit flex flex-col md:flex-row gap-16 mt-8">
        {/*galeria de imagenes del producto*/}
        <GridImages images={[0]}/>
        <div className="felx-1 space-y-5">
          <h1 className="text-3xl font-bold tracking-tight">prueba</h1>
          <div className="flex gap-5 items-center">
            <span className="tracking-wide text-lg font-semibold">
              {formarPrice(1200)}
            </span>
            <div className="relative">
              <span>AGOTADO</span>
            </div>
          </div>

          <Separador />
          <ul className="space-y-2 ml-7 my-10">
            <li className="text-sm flex items-center gap-2 tracking-tight font-medium">
              <span className="bg-black w-[5px] h-[5px] rounded-full" />
              Lapices de colores pasteles
            </li>
          </ul>
          <div className="flex flex-col gap-3">
            <p>No se que poner</p>
            <div className="flex gap-3">
              <button
                className={`w-8 h-8 rounded-full justify-center items-center
                            ${true ? "border-slate-900" : ""}
                            `}
              >
                <span
                  className="w[26px] h-[26px] rounded-full"
                  style={{ backgroundColor: "cyan" }}
                />
              </button>
            </div>
          </div>
          {/*Ver de poner opciones del producto, puede ser la variantes*/}
          <div className="flex flex-col gap-3">
            <p>No se</p>
          </div>

          {/*tipos*/}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-medium">Tipos disponibles</p>

            <div className="felx gap-3">
              <select className="border border-cyan-300 rounded-lg px-3 py-1">
                <option value="">No se</option>
              </select>
            </div>
          </div>

          {/*COMPRA*/}
          {false ? (
            <button
              className="bg-slate-200 uppercase font-semibold tracking-widest text-xs py-4 rounded-full transition-all
                duration-300 hover:bg-cyan-300 w-full"
            >
              Agotado
            </button>
          ) : (
            <>
              {/*CONTADOR*/}
              <div className="space-y-3">
                <p className="text-sm font-medium">Cantidad:</p>
                <div className="felx gap-8 px-5 py-3 border border-slate-200 w-fit rounded-full">
                  <button>
                    <LuMinus size={15} />
                  </button>
                  <span className="text-slate-500 text-sm">1</span>
                  <button>
                    <LuPlus size={15} />
                  </button>
                </div>
              </div>
              {/*Botones de accion*/}
              <div className="flex felx-gap-3">
                <button
                  className="bg-slate-200 uppercase font-semibold tracking-widest text-xs py-4 rounded-full transition-all
                duration-300 hover:bg-cyan-300"
                >
                  Agregar al Carrito
                </button>
                <button className="bg-black text-white uppercase font-semibold tracking-widest text-xs py-4 rounded-full">
                  Comprar Ahora
                </button>
              </div>
            </>
          )}
          <div className="flex pt-2">
            <div className="flex flex-col gap-1 flex-1 items-center">
              <CiDeliveryTruck size={35} />
              <p className="text-xs font-semibold">Envío gratis</p>
            </div>
            <div>
                <Link to="#" className="flex flex-col gap-1 flex-1 items-center justify-center">
                    <BsChatLeftText size={30}/>
                    <p className="flex flex-col items-center text-xs">
                        <span className="font-semibold">
                            Necesitas ayuda con tu pedido?
                        </span>
                        No dudes en contactarnos
                    </p>
                </Link>
            </div>
          </div>
        </div>
      </div>

      <ProductDescription />
    </>
  );
};
