import { router } from '@/router/router.tsx';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from './components/ui/sonner.tsx';
import { AuthContextProvider } from './context/AuthContext.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <>
      <AuthContextProvider>
        <Toaster
          toastOptions={{
            descriptionClassName: 'font-normal text-black',
          }}
        />
        <RouterProvider router={router} />
      </AuthContextProvider>
    </>
  </StrictMode>,
);
