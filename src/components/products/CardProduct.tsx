import { Link } from "react-router-dom";
import { FiPlus } from "react-icons/fi";
import { useState } from "react";
import { VariantProduct } from "../../interfaces";
import { formarPrice } from "../../helpers";
import { Json } from "../../supabase/supabase";

interface Props {
  img: string; 
  name: string;
  price: number;
  descriptions: Json;
  types: { name: string; type: string }[];
  variants: VariantProduct[];
  destacated:boolean;
}

export const CardProduct = ({
  img,
  name,
  price,
  descriptions,
  types,
  variants,
}: Props) => {
    /*PARA VER EL STOCK USAMOS UN USESTATE*/
    const [activeType, setActiveType] = useState<{
        name: string;
        type: string;
    }>(types[0]);
    //seleccionamos la variante que tenga el mismo tipo que el tipo activo
    const variant = variants.find((variant) => variant.type === activeType.type);
    const stock = variant?.stock || 0;


  return (
    <div className="flex flex-col gap-6 relative">
      <Link to={"/product/${descriptions}"} className="flex relative group overflow-hidden">
        <div className="flex h-[350px] w-full items-center justify-center py-2 lg:h-[250px]">
          <img src={img} alt={name} className="object-contain h-full w-full" />
        </div>
        <button className="bg-white border border-slate-200 absolute w-full bottom-0 py-3 rounded-3xl flex items-center justify-center gap-1 text-sm font-medium hover:bg-cyan-200 translate-y-[100%] transition-all duration-300 group-hover:translate-y-0">
          <FiPlus />
          Añadir al carrito
        </button>
      </Link>
      <div className="flex flex-col gap-1 items-center">
        <p className="text-[15px] font-medium">{name}</p>
        <p className="text-[15px] font-medium">{formarPrice(price)}</p>
        <div className="flex gap-3">
            {types.map((type, index) => (
                <span key={type.type}
                className={'grid place-items-center w-5 h-5 rounded-full cursor-pointer' }
                >
                    {type.type}
                </span>
            ))}
        </div>
      </div>
      <div className="absolute top-2 left-2">
        {stock === 0 && <span>Agotado</span>}
      </div>
    </div>
  );
};
