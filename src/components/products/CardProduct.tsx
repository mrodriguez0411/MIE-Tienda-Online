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
	colors: {variant_name: string}[];
	variants: VariantProduct[];
}

export const CardProduct = ({
	img,
	name,
	price,
	slug,
	variants,
}: Props) => {
	const [activeColor, setActiveColor] = useState<{
		variant_name: string;
	}>(variants[0]);

	const addItem = useCartStore(state => state.addItem);

	const handleAddClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();

		if (selectedVariant && selectedVariant.stock > 0) {
			addItem({
				variantId: selectedVariant.id,
				productId: slug,
				name,
				image: img,
				variant_name: activeColor.variant_name,
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
	// Identificar la variante seleccionada según el color activo
	const selectedVariant = variants.find(
		variant => variant.variant_name === activeColor.variant_name
	);

	const stock = selectedVariant?.stock || 0;

	return (
		<div className='flex flex-col gap-6 relative'>
			<Link
				to={`/productos/${slug}`}
				className='flex relative group overflow-hidden '
			>
				<div className='flex h-[350px] w-full items-center justify-center py-2 lg:h-[250px]'>
					<img
						src={img}
						alt={name}
						className='object-contain h-full w-full'
					/>
				</div>

				<button
					className='bg-cyan-200 border border-slate-200 absolute w-full bottom-0 py-3 rounded-3xl flex items-center justify-center gap-1 text-sm font-medium hover:bg-cyan-300 translate-y-[100%] transition-all duration-300 group-hover:translate-y-0'
					onClick={handleAddClick}
				>
					<FaCartPlus  />
					Añadir
				</button>
			</Link>

			<div className='flex flex-col gap-1 items-center'>
				<p className='text-[15px] font-medium'>{name}</p>
				<p className='text-[15px] font-medium'>
					{formatPrice(price)}
				</p>

				<div className='flex gap-3'>
        {variants.map((color) => (
            <span
              key={color.variant_name}
              className={`
        grid place-items-center px-3 py-1 cursor-pointer border rounded-full font-semibold ${
          activeColor.variant_name === color.variant_name
            ? "border-black bg-cyan-200"
            : ""
        }
      `}
              onClick={() => setActiveColor(color)}
            >
              {color.variant_name}{" "}
            </span>
          ))}
				</div>
			</div>

			<div className='absolute top-2 left-2'>
				{stock === 0 && <Tag contentTag='agotado' />}
			</div>
		</div>
	);
};