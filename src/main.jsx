import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { PageLoaderProvider } from './context/PageLoaderContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { id } from 'date-fns/locale/id';
import { registerLocale, setDefaultLocale } from  "react-datepicker";

registerLocale('id', id);
setDefaultLocale('id');

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <ThemeProvider>
            <PageLoaderProvider>
                <AuthProvider>
                    <App />
                </AuthProvider>
            </PageLoaderProvider>
        </ThemeProvider>
    </StrictMode>,
)
