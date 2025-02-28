import { zodResolver } from "@hookform/resolvers/zod"
import { set, useForm } from "react-hook-form"
import { ProductFormValues, productSchema } from "../../../lib/validator"
import { useNavigate, useParams } from "react-router-dom";
import { TiArrowBack } from "react-icons/ti";
import { SectionFormProduct } from "./SeccionFormProduct";
import { InputForm } from "./InputForm";
import { FeaturesInput } from "./FeaturesInput";
import { generateSlug } from "../../../helpers";
import { useEffect } from "react";
import { VariantsInput } from "./VariantsInput";
import { InputImages } from "./InputImages";
import { Editor } from "./Editor";
import { useCreateProduct, useProducts, useUpdateProduct } from "../../../hooks";
import { Loader } from "../../shared/Loader";

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
    
    const { slug } = useParams<{slug: string}>();

    const{ product, isLoading } = useProducts(slug || '');
    const { mutate:createProduct, isPending} = useCreateProduct();
    const {mutate: updateProduct, isPending: isUpdatePending} = useUpdateProduct(product?.id || '');


    const navigate = useNavigate();

    
    
    useEffect(() => {
        if(product && !isLoading) {
            setValue('name', product.name);
            setValue('brand', product.brand); 
            setValue('slug', product.slug);
            setValue('description', product.description);
            setValue('features', product.features.map((f: string ) => ({ value: f })));
            setValue('images', product.images);
            setValue('variants', product.variants.map(v => ({
                    id: v.id, 
                    stock: v.stock,
                    price: v.price,
                    category: v.category,
                    typeName: v.typeName,
               })));
        }

    }, [product, isLoading, setValue]);

    const onSubmit = handleSubmit(data => {

        const features = data.features.map(feature => (            
            feature.value),
        );
		if(slug){
            updateProduct({
                name: data.name,
                brand: data.brand,
                description: data.description,
                features,
                slug: data.slug,
                images: data.images,
                variants: data.variants,
            });
            
        }else{
        
        createProduct({
                name: data.name,
                brand: data.brand,
                description: data.description,
                features,
                slug: data.slug,
                images: data.images,
                variants: data.variants,
            });
        }
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

          if (isPending) return <Loader />;

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
        
        <form className="grid grid-cols-1 lg:grid-cols-3 gap-4 auto-rows-max flex-1 mt-3"
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
                className="lg:col-span-2 lg:row-span-2"
            >
                <VariantsInput
                    control={control}
                    errors={errors}
                    register={register}
                />
            </SectionFormProduct>

            <SectionFormProduct 
                titleSection="Imágenes del Producto"
                className="lg-col-span-1 h-fit"
            >
                <InputImages
                    watch={watch}
                    setValue={setValue}
                    errors={errors}
                />
            </SectionFormProduct>

            <SectionFormProduct 
                titleSection="Descripción del Producto"
                className="col-span-full"
            >

            <Editor
                setValue={setValue}
                errors={errors}
                initialContent={product?.description}
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
