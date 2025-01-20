import { PreparedProducts } from "../../interfaces";
import { CardProduct } from "../products/CardProduct";

interface Props {
  title: string;
  products: PreparedProducts[];
}

export const ProductGrid = ({ title, products }: Props) => {
  return (
    //<div className="my-32">
    <div className="mt-16 mb-32">
      <h2 className="text-3xl font-semibold text-center md:text-4xl lg:text-5xl">
        {title}
      </h2>
      <div className="grid grid-cols-1 gap-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <CardProduct
            key={product.id}
            name={product.name}
            price={product.price}
            img={product.img[0]}
            descriptions={product.descriptions}
            types={product.types}
            variants={product.variants}
          />
        ))}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <CardProduct
                key={product.id}
                name={product.name}
                price={product.price}
                img={product.img[0]}
                descriptions={product.descriptions}
                types={product.types}
                variants={product.variants}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-lg mt-10">
            No hay productos disponibles
          </p>
        )}
      </div>
    </div>
  );
};
