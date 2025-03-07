import { Link } from "react-router-dom";
import { FiPlus } from "react-icons/fi";
import { useState } from "react";
import { VariantProduct } from "../../interfaces";
import { formatPrice } from "../../helpers";
import { useCartStore } from "../../store/cart.store";
import toast from "react-hot-toast";

interface Props {
  img: string;
  name: string;
  price: number;
  slug: string;
  variants: VariantProduct[];
  //destacated:boolean;
}

export const CardProduct = ({
  img,
  name,
  price,
  slug,
  variants,
}: Props) => {
  /*PARA VER EL STOCK USAMOS UN USESTATE*/
  const [activeType, setActiveType] = useState<{
    name:string;
    variant_name: string;
  }>(variants[0]);

  const addItem = useCartStore((state) => state.addItem);

  const handleAddClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (selectedVariant && selectedVariant.stock > 0) {
      addItem({
        variantId: selectedVariant.id,
        productId: slug,
        name,
        image: img,
        variant_name: activeType.name,
        category: selectedVariant.category,
        price: selectedVariant.price,
        quantity: 1,
      });
      toast.success("Producto añadido al carrito", {
        position: "bottom-right",
      });
    } else {
      toast.error("Producto agotado", {
        position: "bottom-right",
      });
    }
  };

  //seleccionamos la variante que tenga el mismo tipo que el tipo activo
  const selectedVariant = variants.find(
    (variant) => variant.variant_name === activeType.variant_name
  );
  const stock = selectedVariant?.stock || 0;

  return (
    <div className="flex flex-col gap-6 relative">
      <Link
        to={`/productos/${slug}`}
        className="flex relative group overflow-hidden"
      >
        <div className="flex h-[350px] w-full items-center justify-center py-2 lg:h-[250px]">
          <img src={img} alt={name} className="object-contain h-full w-full" />
        </div>

        <button
          className="bg-white border border-slate-200 absolute w-full bottom-0 py-3 rounded-3xl flex items-center justify-center gap-1 text-sm font-medium hover:bg-cyan-200 translate-y-[100%] transition-all duration-300 group-hover:translate-y-0"
          onClick={handleAddClick}
        >
          <FiPlus />
          Añadir al carrito
        </button>
      </Link>
      <div className="flex flex-col gap-1 items-center">
        <p className="text-[15px] font-medium">{name}</p>
        <p className="text-[15px] font-medium">{formatPrice(price)}</p>
        <div className="flex gap-3">
          {variants.map((variant) => (
            <span
              key={variant.variant_name}
              className={`
        grid place-items-center px-3 py-1 cursor-pointer border rounded-md
        ${
          activeType.variant_name === variant.variant_name
            ? "border-black bg-cyan-100"
            : ""
        }
      `}
              onClick={() => setActiveType(variant)}
            >
              {variant.variant_name}{" "}
            </span>
          ))}
        </div>
      </div>
      <div className="absolute top-2 left-2 rounded-md bg-gray-800 text-white">
        {stock === 0 && <span>Agotado</span>}
      </div>
    </div>
  );
};
