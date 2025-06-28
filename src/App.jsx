import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router'
import { ScrollToTop } from './components/common/ScrollToTop'
import GuestLayout from './layout/Guest/GuestLayout'
import LandingPage from './pages/LandingPage'
import Error404 from './pages/Error404'
import AIChat from './pages/AIChat'

export default function App() {
    return (
        <BrowserRouter>
            <ScrollToTop />
            <Routes>
                <Route element={<GuestLayout />}>
                    <Route index path="" element={<LandingPage />} />
                    <Route path="ai-chat" element={<AIChat />} />
                </Route>

                <Route path="*" element={<Error404 />} />
            </Routes>
        </BrowserRouter>
    )
}
