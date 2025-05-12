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
    price: number;
  };
}

export const ProductoPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [currentSlug, setCurrentSlug] = useState(slug);

  const { product, isLoading, isError } = useProduct(currentSlug || "");

  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedStock, setSelectedStock] = useState<number | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<VariantProduct | null>(null);

  const count = useCounterStore((state) => state.count);
  const increment = useCounterStore((state) => state.increment);
  const decrement = useCounterStore((state) => state.decrement);

  const addItem = useCartStore((state) => state.addItem);
  const navigate = useNavigate();

  // ✅ Normalizamos las variantes para que coincidan con la interfaz
  const preparedVariants: VariantProduct[] = useMemo(() => {
    return (
      product?.variants.map((v) => ({
        id: v.id,
        stock: v.stock,
        price: v.price,
        category: {
          id: v.category_id,
          name: v.category
        },
        variantName: v.variant_name,
        category_id: v.category_id,
        product_id: v.product_id
      })) ?? []
    );
  }, [product?.variants]);

  const types = useMemo(() => {
    return (
      preparedVariants.reduce((acc: Acc, variant: VariantProduct) => {
        const { variantName, stock, price } = variant;
        if (!acc[variantName]) {
          acc[variantName] = {
            name: variantName,
            stocks: [],
            price,
          };
        }
        if (!acc[variantName].stocks.includes(stock)) {
          acc[variantName].stocks.push(stock);
        }
        return acc;
      }, {} as Acc) || {}
    );
  }, [preparedVariants]);

  const availableTypes = Object.keys(types);
  useEffect(() => {
    if (!selectedType && availableTypes.length > 0) {
      setSelectedType(availableTypes[0]);
    }
  }, [availableTypes, selectedType]);

  useEffect(() => {
    if (selectedType && types[selectedType] && !selectedStock) {
      setSelectedStock(types[selectedType].stocks[0]);
    }
  }, [selectedType, types, selectedStock]);

  useEffect(() => {
    if (selectedType) {
      const variant = preparedVariants.find(
        (v) => v.variantName === selectedType
      );
      setSelectedVariant(variant || null);
    }
  }, [selectedType, preparedVariants]);

  const isOutOfStock = selectedVariant?.stock === 0;
  const selectedPrice =
    selectedVariant?.price ?? preparedVariants[0]?.price ?? 0;

  const addToCart = () => {
    if (selectedVariant && product) {
      addItem({
        variantId: selectedVariant.id,
        productId: product.id,
        name: product.name,
        image: product.images?.[0] || "",
        variant_name: selectedVariant.variantName,
        category: selectedVariant.category.name,
        price: selectedVariant.price,
        quantity: count,
      });
      toast.success("Producto añadido al carrito", {
        position: "bottom-right",
      });
    }
  };

  const buyNow = () => {
    if (selectedVariant && product) {
      addItem({
        variantId: selectedVariant.id,
        productId: product.id,
        name: product.name,
        image: product.images?.[0] || "",
        variant_name: selectedVariant.variantName,
        category: selectedVariant.category.name,
        price: selectedVariant.price,
        quantity: count,
      });
      navigate("/checkout");
    }
  };

  useEffect(() => {
    setCurrentSlug(slug);
    setSelectedType(null);
    setSelectedStock(null);
    setSelectedVariant(null);
  }, [slug]);

  if (isLoading) return <Loader />;
  if (!product || isError) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <p>Producto no encontrado</p>
      </div>
    );
  }

  return (
    <>
      <div className="h-fit flex flex-col md:flex-row gap-16 mt-8">
        <GridImages images={product.images} />

        <div className="flex-1 space-y-5">
          <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>

          <div className="flex gap-5 items-center">
            <span className="tracking-wide text-lg font-semibold">
              {formatPrice(selectedPrice)}
            </span>
            {isOutOfStock && <Tag contentTag="agotado" />}
          </div>

          <Separador />

          <ul className="space-y-2 ml-7 my-10">
            {product.features.map((feature) => (
              <li key={feature} className="text-sm flex items-center gap-2 tracking-tight font-medium">
                <span className="bg-black w-[5px] h-[5px] rounded-full" />
                {feature}
              </li>
            ))}
          </ul>

          {/* Selector de variantes */}
          <div className="flex flex-col gap-3">
            <p>Caja/Blister {selectedType && types[selectedType]?.name}</p>
            <div className="flex gap-3">
              {availableTypes.map((variantName) => (
                <button
                  key={variantName}
                  className={`w-8 h-8 rounded-full flex justify-center items-center ${
                    selectedType === variantName
                      ? "text-bold text-white border border-slate-800 bg-cyan-800"
                      : ""
                  }`}
                  onClick={() => setSelectedType(variantName)}
                >
                  <span>{variantName}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-xs font-medium">Stock disponible:</p>
            {selectedVariant?.stock ?? 0}
          </div>

          {isOutOfStock ? (
            <button className="bg-gray-300 uppercase font-semibold tracking-widest text-xs py-4 rounded-full w-full" disabled>
              Agotado
            </button>
          ) : (
            <>
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

              <div className="flex flex-col gap-3">
                <button className="bg-cyan-800 uppercase font-semibold text-xs py-4 rounded-full text-white hover:bg-cyan-600" onClick={addToCart}>
                  Agregar al carrito
                </button>
                <button className="bg-black text-white uppercase font-semibold text-xs py-4 rounded-full" onClick={buyNow}>
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
            <Link to="#" className="flex flex-col gap-1 flex-1 items-center justify-center">
              <BsChatLeftText size={30} />
              <p className="text-xs text-center">
                <span className="font-semibold">¿Necesitas ayuda?</span>
                <br />
                Contáctanos aquí
              </p>
            </Link>
          </div>
        </div>
      </div>

      <ProductDescription content={product.description} />
    </>
  );
};
export default ProductoPage;