import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { ProductFormValues, productSchema } from "../../../lib/validator"
import { useNavigate } from "react-router-dom";
import { TiArrowBack } from "react-icons/ti";
import { SectionFormProduct } from "./SeccionFormProduct";
import { InputForm } from "./InputForm";
import { FeaturesInput } from "./FeaturesInput";
import { generateSlug } from "../../../helpers";
import { useEffect } from "react";

interface Props {
	titleForm: string;
}

export const FormNewProduct = ({ titleForm }: Props) => {
    const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		watch,
		control,
  
    } = useForm<ProductFormValues>({
            resolver: zodResolver(productSchema)
        
    });
    
    const navigate = useNavigate();

    const onSubmit = handleSubmit(data => {
		console.log(data);
	});

    //slug
    const watchName = watch('name');

    useEffect(() => 
        {
            if (!watchName) {
              return;
            }
            const generatedSlug = generateSlug(watchName);
            setValue('slug', generatedSlug, { shouldValidate: true });
          }, [watchName, setValue]);

 
    return( 
    <div className="flez flex-col gap-6 relative">
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
                <button className="bg-white p-1.5 rounded-md shadow-sm border border-slate-300 transition-all group hover:scale-105"
                onClick={()=> navigate(-1)}
                >
                    <TiArrowBack size={25} className="transition-all group-hover:scale-125"/>
                </button>
                <h2 className='font-bold tracking-tight text-2xl capitalize'>
						{titleForm}
				</h2>
            </div>
        </div>
        
        <form className="grid grid-cols-1 lg:grid-cols-3 gap-8 auto-rows-max flex-1 mt-5"
            onSubmit={onSubmit}
        >
            <SectionFormProduct 
            titleSection='Detalles del Producto'
            className="lg:col-span-2 lg:row-span-2"
            >
                <InputForm
                    type="text"
                    placeholder="Ejemplo: Lapices colores "
                    label="nombre"
                    name='name'
                    register={register}
                    errors={errors}
                    required
                />
                <FeaturesInput control={control} errors={errors} /> 
            </SectionFormProduct>
            <SectionFormProduct
            titleSection='Marca del Producto'
            className="lg:col-span-1 lg:row-span-1">
            <InputForm
                    type="text"
                    placeholder="Ejemplo: lapices-colores "
                    label="slug"
                    name='slug'
                    register={register}
                    errors={errors}
            />
            <InputForm
                    type="text"
                    placeholder="Ejemplo: Faber "
                    label="marca"
                    name='brand'
                    register={register}
                    errors={errors}
                    required
            />
            </SectionFormProduct>

            <SectionFormProduct 
                titleSection="Variantes del Producto"
                className="lg-col-span-2 h-fit"
            >
                <VariantsInput
                
                
                />
            </SectionFormProduct>









            <div className='flex gap-3 absolute top-0 right-0 '>
					<button
						className='border border-slate-400 text-slate-600 py-2 px-3 text-sm font-medium rounded-md hover:scale-125'
						type='button'
						onClick={() => navigate(-1)}
					>
						Cancelar
					</button>
					<button className='bg-cyan-900 text-white py-2 px-3 text-sm font-medium rounded-md hover:scale-125 hover:bg-cyan-950'  type='submit'>
						Guardar Producto
					</button>
				</div>
        </form>
    </div>
    );
};
