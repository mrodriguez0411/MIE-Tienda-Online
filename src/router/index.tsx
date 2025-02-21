import { createBrowserRouter, Navigate } from "react-router-dom";
import { RootLayout } from "../layouts/RootLayout";
import { HomePage, AboutPage, DashboardProductsPage, DashboardNewProductsPage, LoginPage, RegisterPage, DashboardProductSlugPage, ProductosPage, ProductoPage} from "../pages";
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
                path: 'productos/:slug',
                element: <ProductoPage/>

            },
            {
                path: 'nosotros',
                element: <AboutPage/>
            },
            {
                path: 'login',
                element: <LoginPage/>
            },
            {
                path: 'registro',
                element: <RegisterPage/>
            }
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
            },
            {
                path: 'productos/new',
                element: <DashboardNewProductsPage/>
            },
            {
                path: 'productos/editar/:slug',
                element: <DashboardProductSlugPage/>
            },
            
        ]
    },
    
]);
