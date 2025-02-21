import { StateCreator, create } from "zustand";
import { devtools } from "zustand/middleware";

type SheetContent = 'cart' | 'search' | null;

export interface GoblalState{
    isSheetOpen: boolean;
    sheetContent: SheetContent;

    openSheet: (content: SheetContent) => void;
    closeSheet: () => void;
}

const storeApi:StateCreator<GoblalState> = set =>({
    isSheetOpen: false,
    sheetContent: null,

    openSheet: (content) => set(() => ({isSheetOpen: true, sheetContent: content})),
    closeSheet: () => set(() => ({isSheetOpen: false, sheetContent: null}))
});

export const useGlobalStore = create <GoblalState>()(devtools (storeApi));


