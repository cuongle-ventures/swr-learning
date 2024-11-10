import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { SnackbarProvider } from 'notistack';
import { RouterProvider } from 'react-router-dom';
import router from './routers.tsx';
import ErrorBoundary from './components/ErrorBoundary.tsx';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ErrorBoundary>
            <SnackbarProvider>
                <RouterProvider router={router} />
            </SnackbarProvider>
        </ErrorBoundary>
    </StrictMode>,
);
