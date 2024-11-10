import { createBrowserRouter } from 'react-router-dom';
import App from './App';

const router = createBrowserRouter([
    {
        path: '/',
        children: [
            {
                path: '/',
                element: <App />,
            },
            {
                path: '/how-to-create-new-task',
                element: <p>how-to-create-new-task</p>,
            },
        ],
    },
]);

export default router;
