import { JSONContent } from '@tiptap/react';
import { z } from 'zod';

export const userRegisterSchema = z.object({
	email: z.string().email('El correo electrónico no es válido'),
	password: z
		.string()
		.min(6, 'La contraseña debe tener al menos 6 caracteres'),
	fullName: z.string().min(1, 'El nombre completo es requerido'),
	phone: z.string().optional(),
});

export const addressSchema = z.object({
	addressLine1: z
		.string()
		.min(1, 'Debe cargar al menos una dirección')
		.max(100, 'La dirección no debe exceder los 100 carácteres'),
	addressLine2: z
		.string()
		.max(100, 'La dirección no debe exceder los 100 carácteres')
		.optional(),
	city: z
		.string()
		.min(1, 'Debe ingresar la ciudad')
		.max(50, 'La ciudad no debe exceder los 50 carácteres'),
	state: z
		.string()
		.min(1, 'Debe ingresar la  Provincia')
		.max(50, 'El estado no debe exceder los 50 carácteres'),
	postalCode: z
		.string()
		.max(10, 'El código postal no debe exceder los 10 carácteres')
		.optional(),
	country: z.string().min(1, 'Debe ingresar el Pais'),
});



export type UserRegisterFormValues = z.infer<
	typeof userRegisterSchema
>;
export type AddressFormValues = z.infer<typeof addressSchema>;

const isContentEmpty = (value: JSONContent): boolean =>{
    if (!value || !Array.isArray(value.content) || value.content.length == 0){
        return true;
    }
    return !value.content.some(
        node=>
            node.type === 'paragraph'&& node.content && Array.isArray(node.content) && 
            node.content.some(
                textNode => textNode.type === 'text' && 
                textNode.text && 
                textNode.text.trim() !== ''
            )
    );
};

export const productSchema = z.object({
    name: z.string().min(1, 'Debe cargar el nombre del producto'),
    brand: z.string().min(1, 'Debe cargar la marca del producto'),
	slug: z.string(),
    //features: z.string().min(1, 'Debe cargar la caracteristica del producto').regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'El campo no admite números 0 carcateres especiales'),
    features: z.array(
        z.object({
        value: z
        .string()
        .min(1, 'Debe cargar las carcateristicas del producto'),
        })
    ),
    description: z.custom<JSONContent>(value =>  !isContentEmpty(value), 
        { message: 'Debe cargar las descripciones del producto'}),
    
variants: z
		.array(
			z.object({
				id: z.string().optional(),
				stock: z.number(),
				price: z.number().min(0.01, 'El precio debe ser mayor a 0'),
				category: z.string().min(1, 'Debe Asignar una Categoria'),
				variantName: z
					.string()
					.min(1, 'Debe rellenar este campo'),
				category_id: z.string(),
			})
		)
		.min(1, 'Debe haber al menos una variante'),
	images: z.array(z.any()).min(1, 'Debe haber al menos una imagen'),
});

export type ProductFormValues = z.infer<typeof productSchema>;



