import { useState } from 'react';
import { Link } from 'react-router-dom';
import { VariantProduct } from '../../interfaces';
import { formatPrice } from '../../helpers';
import { Tag } from '../shared/Tag';
import { useCartStore } from '../../store/cart.store';
import toast from 'react-hot-toast';
import { FaCartPlus } from 'react-icons/fa';

interface Props {
	img: string;
	name: string;
	price: number;
	slug: string;
	variants: VariantProduct[];
}

export const CardProduct = ({ img, name, price, slug, variants }: Props) => {
	// Manejo de casos en los que no hay variantes
	const initialVariant = variants.length > 0 ? variants[0] : null;

	const [activeVariant, setActiveVariant] = useState<VariantProduct | null>(initialVariant);

	const addItem = useCartStore(state => state.addItem);

	const handleAddClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();

		if (activeVariant && activeVariant.stock > 0) {
			addItem({
				variantId: activeVariant.id,
				productId: slug,
				name,
				image: img,
				variant_name: activeVariant.variant_name,
				category: activeVariant.category,
				price: activeVariant.price,
				quantity: 1,
			});
			toast.success('Producto añadido al carrito', {
				position: 'bottom-right',
			});
		} else {
			toast.error('Producto agotado', {
				position: 'bottom-right',
			});
		}
	};

	const stock = activeVariant?.stock || 0;

	return (
		<div className='flex flex-col gap-6 relative'>
			<Link to={`/productos/${slug}`} className='flex relative group overflow-hidden'>
				<div className='flex h-[350px] w-full items-center justify-center py-2 lg:h-[250px]'>
					<img src={img} alt={name} className='object-contain h-full w-full' />
				</div>

				<button
					className='bg-cyan-200 border border-slate-200 absolute w-full bottom-0 py-3 rounded-3xl flex items-center justify-center gap-1 text-sm font-medium hover:bg-cyan-300 translate-y-[100%] transition-all duration-300 group-hover:translate-y-0'
					onClick={handleAddClick}
				>
					<FaCartPlus />
					Añadir
				</button>
			</Link>

			<div className='flex flex-col gap-1 items-center'>
				<p className='text-[15px] font-medium'>{name}</p>
				<p className='text-[15px] font-medium'>{formatPrice(activeVariant?.price || price)}</p>

				<div className='flex gap-3'>
					{variants.map(variant => (
						<span
							key={variant.variant_name}
							className={`grid place-items-center px-3 py-1 cursor-pointer border rounded-full font-semibold ${
								activeVariant?.variant_name === variant.variant_name ? 'border-black bg-cyan-200' : ''
							}`}
							onClick={() => setActiveVariant(variant)}
						>
							{variant.variant_name}
						</span>
					))}
				</div>
			</div>

			<div className='absolute top-2 left-2'>{stock === 0 && <Tag contentTag='agotado' />}</div>
		</div>
	);
};
