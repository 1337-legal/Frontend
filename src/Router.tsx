import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';

import Home from '@Pages/Home';

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
    },
]);

const Router = () => {
    return (
        <RouterProvider router={router} />
    )
}

export default Router;
