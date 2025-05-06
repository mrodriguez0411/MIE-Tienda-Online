/*import { PreparedProducts } from "../../interfaces";
import { CardProduct } from "../products/CardProduct";

interface Props {
  title: string;
  products: PreparedProducts[];
}

export const ProductGrid = ({ title, products }: Props) => {
  return (
    <div className="my-32">
      <h2 className="text-3xl font-semibold text-center md:text-4xl lg:text-5xl">
        {title}
      </h2>
      <div className="grid grid-cols-1 gap-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
        {products.length > 0 ? (
          products.map((product) => (
            <CardProduct
            key={product.id}
            name={product.name}
            slug={product.slug}
            price={product.price ?? 0}
            img={
              product.images && product.images.length > 0
                ? product.images[0]
                : "default-image.jpg"
            }
            variants={product.variants} // Esto ya está correcto
            category={product.category.name}
            />
          ))
        ) : (
          <p className="text-center text-lg mt-10">
            No hay productos disponibles
          </p>
        )}
      </div>
    </div>
  );
};*/
import { Product } from "../../interfaces"; // Importar el tipo correcto
import { CardProduct } from "../products/CardProduct";

interface Props {
  title: string;
  products: Product[]; // Usar Product en lugar de PreparedProducts
}
export const ProductGrid = ({ title, products }: Props) => {
  return (
    <div className="my-32">
      <h2 className="text-3xl font-semibold text-center md:text-4xl lg:text-5xl">
        {title}
      </h2>
      <div className="grid grid-cols-1 gap-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
        {products.length > 0 ? (
          products.map((product) => (
            <CardProduct
              key={product.id}
              name={product.name}
              slug={product.slug}
              price={product.price ?? 0}
              img={
                product.images && product.images.length > 0
                  ? product.images[0]
                  : "default-image.jpg"
              }
              variants={product.variants}
              category={product.category}
            />
          ))
        ) : (
          <p className="text-center text-lg mt-10">
            No hay productos disponibles
          </p>
        )}
      </div>
    </div>
  );
};
