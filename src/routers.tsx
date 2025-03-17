import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import ReactHookForm from './components/ReactHookForm';

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
    {
        path: '/form',
        element: <ReactHookForm />,
    },
]);

export default router;
