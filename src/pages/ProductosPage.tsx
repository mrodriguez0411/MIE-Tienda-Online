import { useState } from "react";
import { CardProduct } from "../components/products/CardProduct";
import { ContainerFilter } from "../components/products/ContainerFilter";
import { prepareProducts } from "../helpers";
import { useFilterProducts, useProducts } from "../hooks";
import { Pagination } from "../components/shared/Pagination";

export const ProductosPage = () => {
  
  return 
  <>
    <h1 className="text-5xl font-semibold text-center mb-12">Productos</h1>

    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {/*FILTROS*/}
      <div>Filtros</div>
      <div className="col-span-2 flex items-center justify-center h-[500px]">
          
      </div>
      
     
       

    </div>
  </>;

};