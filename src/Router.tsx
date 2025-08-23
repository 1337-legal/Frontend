import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';

import GetStarted from '@Pages/GetStarted';
import Home from '@Pages/Home';
import Privacy from '@Pages/Privacy';
import Terms from '@Pages/Terms';

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
    },
    {
        path: "/get-started",
        element: <GetStarted />,
    },
    {
        path: "/terms",
        element: <Terms />,
    },
    {
        path: "/privacy",
        element: <Privacy />,
    }
]);

const Router = () => {
    return (
        <RouterProvider router={router} />
    )
}

export default Router;
