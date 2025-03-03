import { useState } from 'react';
import { CardProduct } from '../components/products/CardProduct';
import { PreparedProducts } from '../helpers';
import { useFilterProducts} from '../hooks';
import { Pagination } from '../components/shared/Pagination';
import { ContainerFilter } from '../components/products/ContainerFilter';

export const ProductosPage = () => {
	const [page, setPage] = useState(1);
	const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
	
	const {data: products = [], isLoading, totalProduct} = useFilterProducts({
		page,
		brands: selectedBrands,
	});
	
	const preparedProducts = PreparedProducts(products);

	return (
		<>
			<h1 className='text-5xl font-semibold text-center mb-12'>
				Productos
			</h1>

			<div className='grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'>
				{/* FILTROS */}
				<ContainerFilter
					setSelectedBrands={setSelectedBrands}
					selectedBrands={selectedBrands}
				/>

				{isLoading ? (
					<div className='col-span-2 flex items-center justify-center h-[500px]'>
						<p className='text-2xl'>Cargando...</p>
					</div>
				) : (
					<div className='col-span-2 lg:col-span-2 xl:col-span-4 flex flex-col gap-12'>
						<div className='grid grid-cols-2 gap-3 gap-y-10 xl:grid-cols-4'>
							{preparedProducts.map(product => (
								<CardProduct
									key={product.id}
									name={product.name}
									price={product.price}
									types={product.types}
									img={product.images[0]}
									slug={product.slug}
									description={product.description[0]}
									variants={product.variants}
								/>
							))}
						</div>

						{/* TODO: Paginación */}
						<Pagination
							totalItems={totalProduct}
							page={page}
							setPage={setPage}
						/>
					</div>
				)}
			</div>
		</>
	);
};

/*function useFilterProducts(arg0: { page: any; brands: any; }): { data?: never[] | undefined; isLoading: any; totalProducts: any; } {
	throw new Error('Function not implemented.');
}*/
