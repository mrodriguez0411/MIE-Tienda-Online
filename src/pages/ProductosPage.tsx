import { CardProduct } from "../components/products/CardProduct";
import { ContainerFilter } from "../components/products/ContainerFilter";
import { AllProducts } from "../data/initialData";
import { prepareProducts } from "../helpers";

export const ProductosPage = () => {
  const preparedProducts = prepareProducts(AllProducts);
  
  return <>
    <h1 className="text-5xl font-semibold text-center mb-12">
      Productos
    </h1>
    <div className="grid grid-cols-3 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {/*FILTROS*/}
      <ContainerFilter/>
      <div className="col-span-2 lg:col-span-2 xl:col-span-4  flex-col gap-12 ">
        <div className="grid grid-cols-2 gap-3 gap-y-10 xl:grid-cols-4">
            {preparedProducts.map(product =>(
              <CardProduct 
                              key={product.id} 
                              name={product.name} 
                              price={product.price}
                              img={product.img[0]}
                              descriptions={product.descriptions}
                              types={product.types}
                              variants={product.variants}
                              />
            ) ) }
        </div>
      </div>

    </div>
  
  </>;
    
  
}
