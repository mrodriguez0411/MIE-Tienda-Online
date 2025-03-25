import { useEffect, useState } from 'react';
import {
    Control,
    useFieldArray,
    FieldErrors,
    UseFormRegister,
} from 'react-hook-form';
import { ProductFormValues } from '../../../lib/validator';
import {
    IoIosAddCircleOutline,
    IoIosCloseCircleOutline,
} from 'react-icons/io';
import { supabase } from '../../../supabase/client';

interface Props {
    control: Control<ProductFormValues>;
    errors: FieldErrors<ProductFormValues>;
    register: UseFormRegister<ProductFormValues>;
}

const headersVariants = ['Stock', 'Precio', 'Categoría', 'Caja/Envase', ''];

export const VariantsInput = ({
    control,
    errors,
    register,
}: Props) => {
    const { fields, remove, append } = useFieldArray({
        control,
        name: 'variants',
    });

    const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

    const addVariant = () => {
        append({
            stock: 0,
            price: 0,
            category: '',
            variant_name: '',
            category_id: '',
        });
    };

    const removeVariant = (index: number) => {
        remove(index);
    };

    useEffect(() => {
        const fetchCategories = async () => {
            const { data, error } = await supabase
                .from('categories')
                .select('id, name');
            if (error) {
                console.error('Error fetching categories:', error);
            } else {
                setCategories(data.map(category => ({ id: category.id.toString(), name: category.name })));
            }
        };

        fetchCategories();
    }, []);
    /*useEffect(() => {
        const fetchCategories = async () => {
            const { data, error } = await supabase
                .from('categories')
                .select('id, name');
            if (error) {
                console.error('Error fetching categories:', error);
            } else {
                setCategories(data);
            }
        };

        fetchCategories();
    }, []);*/

    return (
        <div className='flex flex-col gap-3'>
            <div className='space-y-4 border-b border-slate-200 pb-6'>
                <div className='grid grid-cols-5 gap-4 justify-start'>
                    {headersVariants.map((header, index) => (
                        <p
                            key={index}
                            className='text-xs font-semibold text-slate-800'
                        >
                            {header}
                        </p>
                    ))}
                </div>
                {fields.map((field, index) => (
                    <div key={field.id}>
                        <div className='grid grid-cols-5 gap-4 items-center'>
                            <input
                                type='number'
                                placeholder='Stock'
                                {...register(`variants.${index}.stock`, {
                                    valueAsNumber: true,
                                })}
                                className='border rounded-md px-3 py-1.5 text-xs font-semibold placeholder:font-normal focus:outline-none appearance-none'
                            />

                            <input
                                type='number'
                                step='0.01'
                                placeholder='Precio'
                                {...register(`variants.${index}.price`, {
                                    valueAsNumber: true,
                                })}
                                className='border rounded-md px-3 py-1.5 text-xs font-semibold placeholder:font-normal focus:outline-none appearance-none'
                            />

                            <select
                                {...register(`variants.${index}.category_id`)} 
                                className='border rounded-md px-3 py-1.5 text-xs font-semibold placeholder:font-normal focus:outline-none appearance-none'
                            >
                                <option value=''>Selecciona una categoría</option>
                                {categories.map(category => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>

                            <input
                                type='text'
                                placeholder='Caja/Envase'
                                {...register(`variants.${index}.variant_name`)}
                                className='border rounded-md px-3 py-1.5 text-xs font-semibold placeholder:font-normal focus:outline-none appearance-none'
                            />

                            <div className='flex justify-end'>
                                <button
                                    type='button'
                                    onClick={() => removeVariant(index)}
                                    className='p-1'
                                >
                                    <IoIosCloseCircleOutline size={20} />
                                </button>
                            </div>
                        </div>

                        {errors.variants?.[index] && (
                            <p className='text-red-500 text-xs mt-1'>
                                {/* Aquí puedes mostrar el primer error */}
                            </p>
                        )}
                    </div>
                ))}
            </div>

            <button
                type='button'
                onClick={addVariant}
                className='px-4 py-2 text-slate-800 rounded-md text-sm font-semibold tracking-tight flex items-center gap-1 self-center hover:bg-slate-100'
            >
                <IoIosAddCircleOutline size={16} />
                Añadir Variante
            </button>

            {fields.length === 0 && errors.variants && (
                <p className='text-red-500 text-xs mt-1'>
                    Debes añadir al menos una variante
                </p>
            )}
        </div>
    );
};

export default VariantsInput;