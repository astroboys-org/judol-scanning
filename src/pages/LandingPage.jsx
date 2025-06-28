import { Link } from 'react-router'

export default function LandingPage() {
    return (
        <div className="flex flex-col justify-center items-center gap-8 h-screen lg:-ml-64 -mt-12">
            <div className="flex gap-2 flex-nowrap">
                <img src="/vite.svg" alt="Logo" className="size-10 mt-3" />
                <h1 className="text-5xl font-semibold">ChakrAI</h1>
            </div>
            <h2 className="text-2xl font-semibold">Asisten Cerdas untuk Keamanan Digital</h2>
            <p className="text-gray-500 dark:text-white/30 text-lg">Konsultasikan masalah keamanan digital Anda dengan ChakrAI</p>
            <Link to="/ai-chat" className="cursor-pointer hover:scale-105 active:scale-95 transition ease-linear">
                Mulai Konsultasi
            </Link>
        </div>
    )
}
