import { useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { VariantProduct } from '../../interfaces';
import { formatPrice } from '../../helpers';
import { Tag } from '../shared/Tag';
import { useCartStore } from '../../store/cart.store';
import toast from 'react-hot-toast';

interface Props {
	img: string;
	name: string;
	price: number;
	slug: string;
	variants: VariantProduct[];
	category: string;
}

export const CardProduct = ({
	img,
	name,
	price,
	slug,
	variants,
	category,
}: Props) => {
	const [activeVariantName, setActiveVariantName] = useState<string | null>(
		variants.length > 0 ? variants[0].variantName : null
	);

	const addItem = useCartStore(state => state.addItem);

	const selectedVariant = variants.find(
		variant => variant.variantName === activeVariantName
	);

	const stock = selectedVariant?.stock || 0;

	const handleAddClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();

		if (selectedVariant && selectedVariant.stock > 0) {
			addItem({
				variantId: selectedVariant.id,
				productId: slug,
				name,
				image: img,
				variant_name: selectedVariant.variantName,
				category: selectedVariant.category,
				price: selectedVariant.price,
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

	return (
		<div className='flex flex-col gap-6 relative'>
			<Link
				to={`/celulares/${slug}`}
				className='flex relative group overflow-hidden'
			>
				<div className='flex h-[350px] w-full items-center justify-center py-2 lg:h-[250px]'>
					<img
						src={img}
						alt={name}
						className='object-contain h-full w-full'
					/>
				</div>

				<button
					className='bg-cyan-800 border border-slate-200 absolute w-full bottom-0 py-3 rounded-3xl flex items-center justify-center gap-1 text-sm font-medium hover:bg-cyan-600 translate-y-[100%] transition-all duration-300 group-hover:translate-y-0'
					onClick={handleAddClick}
				>
					<FiPlus />
					Añadir
				</button>
			</Link>

			<div className='flex flex-col gap-1 items-center'>
				<p className='text-[15px] font-medium'>{name}</p>
				<p className='text-[15px] font-medium'>
					{formatPrice(selectedVariant?.price ?? price)}
				</p>

				{/* Selector de variantes (por nombre) */}
				<div className='flex gap-2 flex-wrap justify-center mt-2'>
					{variants.map(variant => (
						<span
							key={variant.id}
							className={`px-3 py-1 text-xs rounded-full border cursor-pointer font-medium ${
								activeVariantName === variant.variantName
									? 'bg-cyan-800 text-white border-cyan-800'
									: 'bg-white text-black border-gray-300'
							}`}
							onClick={() =>
								setActiveVariantName(variant.variantName)
							}
						>
							{variant.variantName}
						</span>
					))}
				</div>
			</div>

			{stock === 0 && (
				<div className='absolute top-2 left-2'>
					<Tag contentTag='agotado' />
				</div>
			)}
		</div>
	);
};
