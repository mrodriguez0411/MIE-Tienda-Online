import { LuMinus, LuPlus } from "react-icons/lu";
import { Separador } from "../components/shared/Separador";
import { formatPrice } from "../helpers";
import { CiDeliveryTruck } from "react-icons/ci";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BsChatLeftText } from "react-icons/bs";
import { ProductDescription } from "../components/product/ProductDescription";
import { GridImages } from "../components/product/GridImages";
import { useProduct } from "../hooks/products/useProduct";
import { useEffect, useMemo, useState } from "react";
import { VariantProduct } from "../interfaces";
import { Tag } from "../components/shared/Tag";
import { Loader } from "../components/shared/Loader";
import { useCounterStore } from "../store/counter.store";
import { useCartStore } from "../store/cart.store";
import toast from "react-hot-toast";

interface Acc {
  [key: string]: {
    name: string;
    stocks: number[];
  };
}

export const ProductoPage = () => {
  const { slug } = useParams<{ slug: string }>();

  const [currentSlug, setCurrentSlug] = useState(slug);

  const { product, isLoading, isError } = useProduct(currentSlug || '');

  const [selectedType, setSelectedType] = useState<string | null>(null);

  const [selectedStock, setSelectedStock] = useState<number | null>(null);

  const [selectedVariant, setSelectedVariant] = useState<VariantProduct | null>(
    null
  );

  const count = useCounterStore((state) => state.count);
  const increment = useCounterStore((state) => state.increment);
  const decrement = useCounterStore((state) => state.decrement);

  const addItem = useCartStore((state) => state.addItem);

  const navigate = useNavigate();

  // Agrupamos las variantes por tipo
  const types = useMemo(() => {
    return (
      product?.variants.reduce((acc: Acc, variant: VariantProduct) => {
        const { variant_name, stock } = variant;
        if (!acc[variant_name]) {
          acc[variant_name] = {
            name: variant_name,
            stocks: [],
          };
        }

        if (!acc[variant_name].stocks.includes(stock)) {
          acc[variant_name].stocks.push(stock);
        }

        return acc;
      }, {} as Acc) || {}
    );
  }, [product?.variants]);

  // Obtener el primer tipo predeterminado si no se ha seleccionado ninguno
  const availableTypes = Object.keys(types);
  useEffect(() => {
    if (!selectedType && availableTypes.length > 0) {
      setSelectedType(availableTypes[0]);
    }
  }, [availableTypes, selectedType, product]);

  // Actualizar el stock seleccionado cuando cambia el tipo
  useEffect(() => {
    if (selectedType && types[selectedType] && !selectedStock) {
      setSelectedStock(types[selectedType].stocks[0]);
    }
  }, [selectedType, types, selectedStock]);

  // Obtener la variante seleccionada
  useEffect(() => {
    if (selectedType && selectedStock) {
      const variant = product?.variants.find(
        (variant) =>
          variant.variant_name === selectedType && variant.stock === selectedStock
      );

      setSelectedVariant(variant as VariantProduct);
    }
  }, [selectedType, selectedStock, product?.variants]);

  // Obtener el stock
  const isOutOfStock = selectedVariant?.stock === 0;

  // Función para añadir al carrito
  const addToCart = () => {
    if (selectedVariant) {
      addItem({
        variantId: selectedVariant.id,
        productId: product?.id || "",
        name: product?.name || "",
        image: product?.images[0] || "",
        variant_name: selectedVariant.variant_name,
        category: selectedVariant.category,
        price: selectedVariant.price,
        quantity: count,
      });
      toast.success("Producto añadido al carrito", {
        position: "bottom-right",
      });
    }
  };

  // Función para comprar ahora
  const buyNow = () => {
    if (selectedVariant) {
      addItem({
        variantId: selectedVariant.id,
        productId: product?.id || "",
        name: product?.name || "",
        image: product?.images[0] || "",
        variant_name: selectedVariant.variant_name,
        category: selectedVariant.category,
        price: selectedVariant.price,
        quantity: count,
      });

      navigate("/checkout");
    }
  };

  // Resetear el slug actual cuando cambia en la URL
  useEffect(() => {
    setCurrentSlug(slug);

    // Reiniciar tipo, stock y variante seleccionada
    setSelectedType(null);
    setSelectedStock(null);
    setSelectedVariant(null);
  }, [slug]);

  if (isLoading) return <Loader />;

  if (!product || isError)
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <p>Producto no encontrado</p>
      </div>
    );

  return (
    <>
      <div className="h-fit flex flex-col md:flex-row gap-16 mt-8">
        {/* GALERÍA DE IMAGENES */}
        <GridImages images={product.images} />

        <div className="flex-1 space-y-5">
          <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>

          <div className="flex gap-5 items-center">
            <span className="tracking-wide text-lg font-semibold">
              {formatPrice(selectedVariant?.price || product.variants[0].price)}
            </span>

            <div className="relative">
              {isOutOfStock && <Tag contentTag="agotado" />}
            </div>
          </div>

          <Separador />

          {/* Características */}
          <ul className="space-y-2 ml-7 my-10">
            {product.features.map((feature) => (
              <li
                key={feature}
                className="text-sm flex items-center gap-2 tracking-tight font-medium"
              >
                <span className="bg-black w-[5px] h-[5px] rounded-full" />
                {feature}
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-3">
            <div className="flex gap-3">
              {availableTypes.map((variant_name) => (
                <button
                  key={variant_name}
                  className={`w-8 h-8 rounded-md flex justify-center items-center ${
                    selectedType === variant_name ? "border border-slate-800 bg-cyan-600" : ""
                  }`}
                  onClick={() => setSelectedType(variant_name)}
                >
                  <span>{types[variant_name].name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-xs font-medium">Stock disponible:</p>
            {selectedVariant?.stock || product.variants[0].stock}
          </div>

          {/* COMPRAR */}
          {isOutOfStock ? (
            <button
              className="bg-[#f3f3f3] uppercase font-semibold tracking-widest text-xs py-4 rounded-full transition-all duration-300 hover:bg-[cyan] w-full"
              disabled
            >
              Agotado
            </button>
          ) : (
            <>
              {/* Contador */}
              <div className="space-y-3">
                <p className="text-sm font-medium">Cantidad:</p>

                <div className="flex gap-8 px-5 py-3 border border-slate-200 w-fit rounded-full">
                  <button onClick={decrement} disabled={count === 1}>
                    <LuMinus size={15} />
                  </button>
                  <span className="text-slate-500 text-sm">{count}</span>
                  <button onClick={increment}>
                    <LuPlus size={15} />
                  </button>
                </div>
              </div>

              {/* BOTONES ACCIÓN */}
              <div className="flex flex-col gap-3">
                <button className="bg-[#f3f3f3] uppercase font-semibold tracking-widest text-xs py-4 rounded-full transition-all duration-300 hover:bg-[#8af3f3]" onClick={addToCart}>
                  Agregar al carritos
                </button>
                <button className="bg-black text-white uppercase font-semibold tracking-widest text-xs py-4 rounded-full" onClick={buyNow}>
                  Comprar ahora
                </button>
              </div>
            </>
          )}

          <div className="flex pt-2">
            <div className="flex flex-col gap-1 flex-1 items-center">
              <CiDeliveryTruck size={35} />
              <p className="text-xs font-semibold">Envío gratis</p>
            </div>

            <Link
              to="#"
              className="flex flex-col gap-1 flex-1 items-center justify-center"
            >
              <BsChatLeftText size={30} />
              <p className="flex flex-col items-center text-xs">
                <span className="font-semibold">¿Necesitas ayuda?</span>
                Contáctanos aquí
              </p>
            </Link>
          </div>
        </div>
      </div>

      {/* DESCRIPCIÓN */}
      <ProductDescription content={product.description} />
    </>
  );
};