import { Brands } from '../components/home/Brands';
import { Features } from '../components/home/Features';
import { ProductGrid } from '../components/home/ProductGrid';
import { ProductGridsSkeletons } from '../components/skeletons/ProductGridSkeletons';
import { PreparedProducts } from '../helpers';
import { useProductHome } from '../hooks';

export const HomePage = () => {
	const { recentProducts, destacatedProducts, isLoading } =
		useProductHome();

	const preparedRecentProducts = PreparedProducts(recentProducts);
	const preparedPopularProducts = PreparedProducts(destacatedProducts);

	return (
		<div>
			
			<Features />

			{isLoading ? (
				<ProductGridsSkeletons numberOfProducts={4} />
			) : (
				<ProductGrid
					title='Nuevos Productos'
					products={preparedRecentProducts}
				/>
			)}

			{isLoading ? (
				<ProductGridsSkeletons numberOfProducts={4} />
			) : (
				<ProductGrid
					title='Productos Destacados'
					products={preparedPopularProducts}
				/>
			)}

			<Brands />
		</div>
	);
};