import { StateCreator, create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { ICartItem } from '../components/shared/CartItem';

export interface CartState {
    items: ICartItem[];
    totalItemsInCart: number;
    totalAmount: number;

    addItem: (item: ICartItem) => void;
    removeItem: (variantId: string) => void;
    updateQuantity: (variantId: string, productId: string, quantity: number) => void;
    cleanCart: () => void;
}

const storeApi: StateCreator<CartState> = set => ({
    items: [],
    totalItemsInCart: 0,
    totalAmount: 0,

    addItem: (item) => {
    set(state => {
        const existingItemIndex = state.items.findIndex(
            i => i.variantId === item.variantId
        );

        let updatedItems;

        if (existingItemIndex >= 0) {
            // Si la variante ya está en el carrito, sumamos la cantidad
            updatedItems = state.items.map((i, index) =>
                index === existingItemIndex
                    ? { ...i, quantity: i.quantity + item.quantity }
                    : i
            );
        } else {
            // Si la variante no está, la añadimos como un nuevo producto en el carrito
            updatedItems = [...state.items, item];
        }

        const newTotalItems = updatedItems.reduce((acc, i) => acc + i.quantity, 0);
        const newTotalAmount = updatedItems.reduce((acc, i) => acc + i.price * i.quantity, 0);

        return {
            items: updatedItems,
            totalAmount: newTotalAmount,
            totalItemsInCart: newTotalItems,
        };
    });
},

    removeItem: variantId => {
        set(state => {
            const updatedItems = state.items.filter(
                i => i.variantId !== variantId
            );

            const newTotalItems = updatedItems.reduce(
                (acc, i) => acc + i.quantity,
                0
            );

            const newTotalAmount = updatedItems.reduce(
                (acc, i) => acc + i.price * i.quantity,
                0
            );

            return {
                items: updatedItems,
                totalAmount: newTotalAmount,
                totalItemsInCart: newTotalItems,
            };
        });
    },

    updateQuantity: (variantId, productId, quantity) => {
        set(state => {
            const updatedItems = state.items.map(i =>
                i.variantId === variantId && i.productId === productId ? { ...i, quantity } : i
            );

            const newTotalItems = updatedItems.reduce(
                (acc, i) => acc + i.quantity,
                0
            );

            const newTotalAmount = updatedItems.reduce(
                (acc, i) => acc + i.price * i.quantity,
                0
            );

            return {
                items: updatedItems,
                totalAmount: newTotalAmount,
                totalItemsInCart: newTotalItems,
            };
        });
    },

    cleanCart: () => {
        set({ items: [], totalItemsInCart: 0, totalAmount: 0 });
    },
});

export const useCartStore = create<CartState>()(
    devtools(
        persist(storeApi, {
            name: 'cart-store',
        })
    )
);