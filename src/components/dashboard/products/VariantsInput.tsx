import { useEffect, useState } from 'react';
import {
  Control,
  useFieldArray,
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
} from 'react-hook-form';
import { ProductFormValues } from '../../../lib/validator';
import {
  IoIosAddCircleOutline,
  IoIosCloseCircleOutline,
} from 'react-icons/io';
import supabase from '../../../supabase/client';

interface Props {
  control: Control<ProductFormValues>;
  errors: FieldErrors<ProductFormValues>;
  register: UseFormRegister<ProductFormValues>;
  setValue: UseFormSetValue<ProductFormValues>;
}

const headersVariants = ['Stock', 'Precio', 'Categoría', 'Caja/Envase', ''];

export const VariantsInput = ({
  control,
  errors,
  register,
  setValue,
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
      category_id: '',
      variantName: '',
      category: '',
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
        console.error('Error al obtener categorías:', error);
      } else {
        setCategories(
          data.map((category) => ({ id: category.id, name: category.name }))
        );
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const handleCategoryUpdate = (e: Event) => {
      const custom = e as CustomEvent;
      const { index, value } = custom.detail;

      if (typeof setValue === 'function') {
        setValue(`variants.${index}.category`, value); // ✅ Actualiza el campo visible
      } else {
        console.error(
          "Error: setValue no es una función válida. Asegúrate de que el componente padre pase correctamente setValue al componente VariantsInput."
        );
      }
    };

    window.addEventListener('update-category', handleCategoryUpdate);
    return () => {
      window.removeEventListener('update-category', handleCategoryUpdate);
    };
  }, [setValue]);

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
                className='border rounded-md px-3 py-1.5 text-xs font-semibold placeholder:font-normal focus:outline-none'
              />

              <input
                type='number'
                step='0.01'
                placeholder='Precio'
                {...register(`variants.${index}.price`, {
                  valueAsNumber: true,
                })}
                className='border rounded-md px-3 py-1.5 text-xs font-semibold placeholder:font-normal focus:outline-none'
              />

              <select
                {...register(`variants.${index}.category_id`, {
                  required: 'Seleccionar una categoría es obligatorio',
                  onChange: (e) => {
                    const selectedId = e.target.value;
                    const selectedCategory = categories.find(
                      (cat) => cat.id === selectedId
                    );
                    if (selectedCategory) {
                      setValue(`variants.${index}.category_id`, selectedCategory.id); // ✅ Actualiza category_id
                      setValue(`variants.${index}.category`, selectedCategory.name); // ✅ Actualiza category
                    }
                  },
                })}
                className='border rounded-md px-3 py-1.5 text-xs font-semibold placeholder:font-normal focus:outline-none'
              >
                <option value=''>Selecciona una categoría</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>

              <input
                type='text'
                placeholder='Caja/Envase'
                {...register(`variants.${index}.variantName`)}
                className='border rounded-md px-3 py-1.5 text-xs font-semibold placeholder:font-normal focus:outline-none'
              />

              <div className='flex justify-end'>
                <button
                  type='button'
                  onClick={() => removeVariant(index)}
                  className='p-1 text-red-500 hover:scale-105'
                >
                  <IoIosCloseCircleOutline size={20} />
                </button>
              </div>
            </div>

            {errors.variants?.[index]?.category_id && (
              <p className='text-red-500 text-xs mt-1'>
                {errors.variants[index]?.category_id?.message}
              </p>
            )}
          </div>
        ))}
      </div>

      <button
        type='button'
        onClick={addVariant}
        className='px-4 py-2 text-slate-800 rounded-md text-sm font-semibold flex items-center gap-1 self-center hover:bg-slate-100'
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
