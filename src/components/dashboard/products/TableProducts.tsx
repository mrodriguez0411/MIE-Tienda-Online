import { useState } from "react";
import { IoEllipsisVerticalCircleSharp } from "react-icons/io5";
import { MdDeleteForever } from "react-icons/md";
import { TiEdit } from "react-icons/ti";
import { Link } from "react-router-dom";
import { useProducts, useDeleteProduct } from "../../../hooks";
import { Loader } from "../../shared/Loader"; 
import { Pagination } from "../../shared/Pagination";

// Definición de la función formatPrice
const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(price);
  };
//Armado de los emcabezados de la tabla
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

    const [selectedVariants, setSelectedVariants] = useState<{
        [key:string]: number;
    }>({});

  //creo el estado para desplegar menú de editar o eliminar producto
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  
  const{mutate, isPending } = useDeleteProduct();

  const handleVariantChange = (productId: string, variantIndex: number) =>{
    setSelectedVariants({
        ...setSelectedVariants,
        [productId]: variantIndex,
    })
  };

  const handleMenuOpen = (index : number) => {
    if (openMenu === index ){
        setOpenMenu(null)
    }else{
        setOpenMenu(index);

    }
  };
  //traemos el hook para cargar los productos
  const [page, setPage] = useState(1);
  const { products, isLoading, totalProducts} = useProducts({page});

  if(!products || isLoading || !totalProducts || isPending) return <Loader/>; 
 

  //funcion para borrar el producto
  const handleDeleteProduct = (id: string) => {
    mutate(id);
    setOpenMenu(null);

  }
    

  return (
    <div className="flex flex-col flex-1 border border-cyan-200 rounded-lg bg-white">
      <h1 className="font-bold text-xl">Productos</h1>
      {/*Armado de Tabla*/}
      <div className="relative w-full h-full">
        <table className="text-sm w-full caption-bottom overflow-auto">
          <thead className="border-b border-cyan-100 pb-3">
            <tr className="text-sm font-bold">
              {tableHeaders.map((header, index) => (
                <th key={index} className="h-12 px-4 text-left">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((products, index) => {

              const selectedVariantIndex = selectedVariants[products.id] ?? 0;
              const selectedVariant = products.variants[selectedVariantIndex];

              return (
                <tr key={index}>
                  <td className="p-4 align-middle sm:table-cell">
                    <img
                      src={
                        products.images[0] ||
                        "../../../../public/img/products/notimage.jpeg"
                      }
                      alt="Imagen de Producto"
                      loading="lazy"
                      decoding="async"
                      className="w-16 h-16 aspect-square rounded-md object-contain"
                    />
                  </td>
                  <td className="p-4 font-medium tracking-tighter">
                    {products.name}
                  </td>
                  <td className="p-4 font-medium tracking-tighter">
                    <select className="border border-gray-200 rounded-md p-1 w-full"
                        onChange={e => handleVariantChange(products.id, Number(e.target.value))}
                        value={selectedVariantIndex}
                    >

                      {products.variants.map((variant, variantIndex) => (
                        <option key={variant.id} value={variantIndex}>
                          {variant.type_name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-4 font-medium tracking-tighter">
                    {formatPrice(selectedVariant.price)}
                  </td>
                  <td className="p-4 font-medium tracking-tighter">
                    {selectedVariant.stock}
                  </td>
                  <td className="p-4 font-medium tracking-tighter">
                    {selectedVariant.category}
                  </td>
                  <td className="p-4 font-medium tracking-tighter">
                    {new Date(products.created_at).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </td>
                  <td className="relative">
                    <button
                      className="text-slate-800"
                      onClick={() => handleMenuOpen(index)}
                    >
                      <IoEllipsisVerticalCircleSharp
                        size={25}
                        className="text-cyan-950"
                      />
                    </button>
                    {openMenu === index && (
                      <div
                        className="absolute right-0 mt-2 bg-white border-slate-700 rounded-md shadow-xl z-10 w-[120px]"
                        role="menu"
                      >
                        <Link
                          to={`/dashboard/productos/editar/${products.slug}`}
                          className="flex items-center gap-1 w-full text-left px-4 py-2 text-xs font-medium text-cyan-700 hover:bg-cyan-100"
                        >
                          Editar
                          <TiEdit size={13} className="inline-block" />
                        </Link>
                        <button
                          className="block w-full text-left px-4 py-2 text-xs font-medium text-red-700 hover:bg-red-100"
                          onClick={() => handleDeleteProduct(products.slug)}
                        >
                          Eliminar
                          <MdDeleteForever size={15} className="inline-block" />
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
      {/* Paginación */}
      <Pagination
        page={page}
        setPage={setPage}
        totalItems={totalProducts}
      />
    </div>
  );
};
