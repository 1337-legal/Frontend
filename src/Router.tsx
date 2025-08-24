import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';

import Account from '@Pages/Account';
import Auth from '@Pages/Auth';
import Home from '@Pages/Home';
import NotFound from '@Pages/NotFound';
import Privacy from '@Pages/Privacy';
import Terms from '@Pages/Terms';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Home />,
        errorElement: <NotFound />,
        children: []
    },
    {
        path: '/auth',
        element: <Auth />,
        errorElement: <NotFound />
    },
    {
        path: '/terms',
        element: <Terms />,
        errorElement: <NotFound />
    },
    {
        path: '/privacy',
        element: <Privacy />,
        errorElement: <NotFound />
    },
    {
        path: '/account',
        element: <Account />,
        errorElement: <NotFound />
    },
    {
        path: '*',
        element: <NotFound />
    }
]);

const Router = () => {
    return (
        <QueryClientProvider client={new QueryClient()}>
            <RouterProvider router={router} />
        </QueryClientProvider>
    )
}

export default Router;
