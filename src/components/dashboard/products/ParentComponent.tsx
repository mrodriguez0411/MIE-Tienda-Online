import { useForm } from 'react-hook-form';
import VariantsInput from './VariantsInput';
import { ProductFormValues } from '../../../lib/validator';

export const ParentComponent = () => {
    const { control, register, setValue, formState: { errors } } = useForm<ProductFormValues>({
        defaultValues: {
            variants: [], // Asegúrate de inicializar correctamente los valores predeterminados
        },
    });

    return (
        <form>
            <VariantsInput
                control={control}
                register={register}
                setValue={setValue} // ✅ Pasar setValue correctamente
                errors={errors}
            />
        </form>
    );
};