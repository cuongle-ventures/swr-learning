import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { SnackbarProvider } from 'notistack';
import { RouterProvider } from 'react-router-dom';
import router from './routers.tsx';
import ErrorBoundary from './components/ErrorBoundary.tsx';
import FilterPostProvider from './components/FilterPostProvider.tsx';
import { SWRDevTools } from 'swr-devtools';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ErrorBoundary>
            <SWRDevTools>
                <SnackbarProvider>
                    <FilterPostProvider>
                        <RouterProvider router={router} />
                    </FilterPostProvider>
                </SnackbarProvider>
            </SWRDevTools>
        </ErrorBoundary>
    </StrictMode>,
);
