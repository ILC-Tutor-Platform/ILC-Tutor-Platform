import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import { router } from '@/router/router.tsx'
import { AuthContextProvider } from './context/AuthContext.tsx'
import { Toaster } from './components/ui/sonner.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <>
    <AuthContextProvider>
    <Toaster toastOptions={{
      descriptionClassName: "font-normal text-black",
    }}/>
    <RouterProvider router={router} />
    </AuthContextProvider>
    </>
  </StrictMode>,
)