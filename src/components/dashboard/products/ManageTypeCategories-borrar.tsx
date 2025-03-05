import { useState } from 'react';
import { supabase } from '../../../supabase/client';

interface ManageTypeCategoriesProps {
	onSave: (data: { types: string[], categories: string[] }) => void;
  }


const ManageTypeCategories = ({ onSave }) => {
	const [type, setType] = useState('');
	const [category, setCategory] = useState('');
	const [typeList, setTypeList] = useState<string[]>([]);
	const [categoryList, setCategoryList] = useState<string[]>([]);

	const handleAddType = async () => {
		if (type && !typeList.includes(type)) {
			setTypeList([...typeList, type]);
			setType('');
			await supabase.from('variants').insert([{ name: type }]);
		}
	};

	const handleAddCategory = async () => {
		if (category && !categoryList.includes(category)) {
			setCategoryList([...categoryList, category]);
			setCategory('');
			await supabase.from('variants').insert([{ name: category }]);
		}
	};

	const handleSave = () => {
		onSave({ types: typeList, categories: categoryList });
	};

	return (
		<div className='flex flex-col gap-4'>
			<div>
				<input
					type='text'
					placeholder='Nuevo Tipo'
					value={type}
					onChange={(e) => setType(e.target.value)}
					className='border rounded-md px-3 py-1.5'
				/>
				<button onClick={handleAddType} className='ml-2 px-3 py-1 bg-blue-500 text-white rounded'>Añadir Tipo</button>
			</div>

			<div>
				<input
					type='text'
					placeholder='Nueva Categoría'
					value={category}
					onChange={(e) => setCategory(e.target.value)}
					className='border rounded-md px-3 py-1.5'
				/>
				<button onClick={handleAddCategory} className='ml-2 px-3 py-1 bg-green-500 text-white rounded'>Añadir Categoría</button>
			</div>

			<button onClick={handleSave} className='px-4 py-2 bg-gray-800 text-white rounded-md'>Guardar</button>
		</div>
	);
};


