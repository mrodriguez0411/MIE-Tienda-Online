import { useState, useEffect } from "react";
import { IoEllipsisVerticalCircleSharp } from "react-icons/io5";
import { MdDeleteForever } from "react-icons/md";
import { TiEdit } from "react-icons/ti";
import { Link } from "react-router-dom";
import { useProducts, useDeleteProduct } from "../../../hooks";
import { Loader } from "../../shared/Loader"; 
import { Pagination } from "../../shared/Pagination";
import { supabase } from "../../../supabase/client";

// Formatear precio en formato ARS
const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(price);
};

const tableHeaders = [
  "",
  "Nombre",
  "Tipo",
  "Precio",
  "Stock",
  "Categoria",
  "Fecha de alta",
  "Acciones",
];

export const TableProducts = () => {
  const [selectedVariants, setSelectedVariants] = useState<{ [key: number]: number }>({});
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const { mutate, isPending } = useDeleteProduct();

  // Cargar categorías desde Supabase
  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name");

      if (error) {
        console.error("Error al obtener categorías:", error);
      } else {
        // ✅ Convertir id a número por seguridad
        const formattedCategories = data.map((item) => ({
          id: Number(item.id),
          name: item.name,
        }));
        setCategories(formattedCategories);
      }
    };

    fetchCategories();
  }, []);

  // Manejar cambio de variante seleccionada
  const handleVariantChange = (productId: number, variantIndex: number) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [productId]: variantIndex,
    }));
  };

  // Abrir/Cerrar menú de acciones
  const handleMenuOpen = (index: number) => {
    setOpenMenu(openMenu === index ? null : index);
  };

  // Estado de paginación
  const [page, setPage] = useState(1);
  const { products, isLoading, totalProducts } = useProducts({ page });

  // Si está cargando o pendiente, mostrar el Loader
  if (!products || isLoading || !totalProducts || isPending) return <Loader />;

  // Eliminar producto
  const handleDeleteProduct = (id: number) => {
    mutate(id.toString());
    setOpenMenu(null);
  };

  // Obtener el nombre de la categoría
  const getCategoryName = (categoryId: number | string | null) => {
    if (!categoryId) return "Desconocida";
    const category = categories.find((cat) => cat.id === Number(categoryId));
    return category ? category.name : "Desconocida";
  };

  return (
    <div className="flex flex-col flex-1 border border-cyan-800 rounded-lg bg-white">
      <h1 className="font-bold text-xl mt-1 ml-3 ">PRODUCTOS</h1>
      <div className="relative w-full h-full">
        <table className="text-sm w-full caption-bottom overflow-auto">
          <thead className="border-b border-cyan-400 pb-3">
            <tr className="text-sm font-bold">
              {tableHeaders.map((header, index) => (
                <th key={index} className="h-12 px-4 text-left">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => {
              const selectedVariantIndex = selectedVariants[product.id] ?? 0;
              const selectedVariant = product.variants[selectedVariantIndex];

              return (
                <tr key={product.id}>
                  <td className="p-4 align-middle sm:table-cell">
                    <img
                      src={product.images[0] || "/img/products/notimage.jpeg"}
                      alt="Imagen de Producto"
                      loading="lazy"
                      decoding="async"
                      className="w-16 h-16 aspect-square rounded-md object-contain"
                    />
                  </td>
                  <td className="p-4 font-medium tracking-tighter">{product.name}</td>

                  {/* Selector de variantes */}
                  <td className="p-4 font-medium tracking-tighter">
                    <select
                      className="border border-gray-200 rounded-md p-1 w-full"
                      onChange={e => handleVariantChange(product.id, Number(e.target.value))}
                      value={selectedVariantIndex}
                    >
                      {product.variants.map((variant, variantIndex) => (
                        <option key={variant.id} value={variantIndex}>
                          {variant.variant_name}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td className="p-4 font-medium tracking-tighter">{formatPrice(selectedVariant.price)}</td>
                  <td className="p-4 font-medium tracking-tighter">{selectedVariant.stock}</td>
                  <td className="p-4 font-medium tracking-tighter">{getCategoryName(selectedVariant.category_id)}</td>

                  <td className="p-4 font-medium tracking-tighter">
                    {product.created_at
                      ? new Date(product.created_at).toLocaleDateString("es-ES", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "Fecha no disponible"}
                  </td>

                  {/* Menú de acciones */}
                  <td className="relative">
                    <button className="text-slate-800" onClick={() => handleMenuOpen(index)}>
                      <IoEllipsisVerticalCircleSharp size={25} className="text-cyan-800 ml-5" />
                    </button>
                    {openMenu === index && (
                      <div className="absolute right-0 mt-2 bg-white border-slate-800 rounded-md shadow-xl z-10 w-[120px]" role="menu">
                        <Link to={`/dashboard/productos/editar/${product.slug}`} className="flex items-center gap-1 w-full text-left px-4 py-2 text-xs font-medium text-cyan-700 hover:bg-cyan-100">
                          Editar <TiEdit size={13} className="inline-block" />
                        </Link>
                        <button className="block w-full text-left px-4 py-2 text-xs font-medium text-red-700 hover:bg-red-100" onClick={() => handleDeleteProduct(product.id)}>
                          Eliminar <MdDeleteForever size={15} className="inline-block" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <Pagination page={page} setPage={setPage} totalItems={totalProducts} />
    </div>
  );
};
