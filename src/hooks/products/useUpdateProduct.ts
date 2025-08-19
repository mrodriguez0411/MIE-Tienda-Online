import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProduct } from '../../actions';
import { ProductInput } from '../../interfaces';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export const useUpdateProduct = (productId: string) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  
  const { mutate, isPending } = useMutation({
    mutationFn: async (data: ProductInput) => updateProduct(productId, data),
    onSuccess: () => {
      // Invalidar la caché de productos
      queryClient.invalidateQueries({
        queryKey: ['products'],
      });
      
      // Mostrar notificación de éxito
      toast.success('Producto actualizado', {
        position: 'bottom-right',
      });
      
      // Navegar al listado de productos después de un breve retraso
      // Usar replace: true para evitar bucles de navegación
      setTimeout(() => {
        navigate('/dashboard/productos', { replace: true });
      }, 100);
    },
    onError: (error) => {
      console.error('Error al actualizar el producto:', error);
      toast.error('Ocurrió un error al actualizar el producto', {
        position: 'bottom-right',
      });
    },
  });
  
  return {
    mutate,
    isPending,
  };
};