import { createBrowserRouter, Navigate } from "react-router-dom";
import { RootLayout } from "../layouts/RootLayout";
import { HomePage, ProductosPage, AboutPage, ProductoPage, DashboardProductsPage } from "../pages";
import { DashboardLayout } from "../layouts/DashboardLayout";

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
                path: 'productos/descriptions',
                element: <ProductoPage/>

            },
            {
                path: 'nosotros',
                element: <AboutPage/>
            },
        ]
    },
    {
        path:'/dashboard',
        element: <DashboardLayout/>,
        children:[
            {
                index : true,
                element: <Navigate to='/dashboard/productos'/>,
            },
            {
                path: 'productos',
                element: <DashboardProductsPage/>
            }
        ]
    }
]);