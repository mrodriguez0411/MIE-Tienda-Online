import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "../layouts/RootLayout";
import { HomePage, ProductosPage, AboutPage } from "../pages";

export const router = createBrowserRouter([
    {
        path: '/',
        element : <RootLayout/>,
        children : [
            {
                index: true,
                element: <HomePage/>            
            },
            {
                path: 'productos',
                element: <ProductosPage/>
            },
            {
                path: 'nosotros',
                element: <AboutPage/>
            },
        ]
    }
]);