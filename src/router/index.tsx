import { createBrowserRouter, Navigate } from "react-router-dom";
import { RootLayout } from "../layouts/RootLayout";
import { HomePage, AboutPage, DashboardProductsPage, DashboardNewProductsPage, LoginPage, RegisterPage, DashboardProductSlugPage, ProductosPage, ProductoPage, OrdersUserPage, CheckoutPage, OrderUserPage, DashboardOrdersPage, DashboardOrderPage} from "../pages";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { ClientLayout } from "../layouts/ClientLayout";
import { ThankyouPage } from "../pages/ThankyouPage";
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
            },
            {
                path: 'account',
                element: <ClientLayout/>,
                children:[
                    {
                        path:'',
                        element: <Navigate to='/account/pedidos'/>
                    },
                    {
                        path: 'pedidos',
                        element: <OrdersUserPage/>
                    },
                    {
                        path: 'pedidos/:id',
                        element: <OrderUserPage/>
                    },
                ]
            },
            
        ],
        
    },
    {
        path: '/checkout',
        element: <CheckoutPage/>
    },
    {
        path: '/checkout/:id/thank-you',
        element: <ThankyouPage/>

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
            {
                path: 'ordenes',
                element: <DashboardOrdersPage/>
            },
            {
                path: 'ordenes/:id',
                element: <DashboardOrderPage/>
            },
            
        ]
    },
    
]);
