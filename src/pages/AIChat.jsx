import { useEffect, useRef, useState } from "react";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { initializeDatabase } from "../services/databaseService";
import { startScraping } from "../services/scrapingService";
import InputText from "../components/form/InputText";
import { LoaderCircle } from "../components/ui/Loader";
import { findSimilarLocation } from "../services/dataService";
import { analyzeLocation } from "../services/geminiService";
import ScrapingSidebar from "../components/ScrapingSidebar";
import KasusModal from "../components/KasusModal";
import LaporModal from "../components/LaporModal";
import ReactMarkdown from "react-markdown";

export default function AIChat() {
    const [messages, setMessages] = useState([{
        sender: 'system',
        text: '**Selamat datang di ChakrAI!** 👋\n\nDi mana lokasi Anda saat ini? (sebutkan nama desa, kecamatan, kabupaten/kota, dan provinsi Anda)',
        timestamp: new Date(),
    }]);
    const [inputText, setInputText] = useState('');
    const [chatState, setChatState] = useState('awal');
    const [isLoading, setIsLoading] = useState(false);
    const chatBoxRef = useRef(null);

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [dataRefresh, setDataRefresh] = useState(false);

    useEffect(() => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    }, [messages]);

    const addMessage = (sender, text) => {
        setMessages(prev => [...prev, { sender, text, timestamp: new Date() }]);
    };

    const handleSendMessage = async () => {
        if (!inputText.trim()) return;

        addMessage('user', inputText);
        setIsLoading(true);

        try {
            if (chatState === 'awal') {
                // Cek lokasi di database lokal
                const locationResult = await findSimilarLocation(inputText);

                if (locationResult.found) {
                    // Jika lokasi ditemukan di database
                    const recentCase = locationResult.cases[0];
                    const caseType = recentCase.Kasus;

                    if (caseType === 'Pinjaman Online Ilegal') {
                        addMessage('system', `**Peringatan Keamanan**\n\nHai, kami mendeteksi bahwa di sekitar **${locationResult.location}** terdeteksi aktivitas/kejadian **Pinjaman Online Ilegal**.\n\nBerhati-hatilah terhadap penawaran pinjaman cepat melalui aplikasi tidak resmi.\n\n💡 **Tips:** Jangan pernah mengirim KTP/foto diri ke pihak tidak dikenal`);
                    } else {
                        addMessage('system', `**Peringatan Keamanan**\n\nHai, kami mendeteksi bahwa di sekitar **${locationResult.location}** saat ini, aktivitas **judi online** cukup rawan terjadi.\n\nHati-hati dengan ajakan yang menjanjikan uang cepat. Hindari tautan mencurigakan dan catat pengeluaran harian.\n\n💡 **Tips:** Jangan sembarangan klik tautan judi, slot, atau mengandung kata 'gacor'`);
                    }
                } else {
                    // Jika lokasi tidak ditemukan, gunakan Gemini AI untuk analisis
                    const aiResponse = await analyzeLocation(inputText);
                    addMessage('system', aiResponse);
                }
                setChatState('bertanya_bantuan');
            } else if (chatState === 'bertanya_bantuan') {
                const lowerInput = inputText.toLowerCase();
                if (lowerInput.includes('ya') || lowerInput.includes('iya') || lowerInput.includes('iy')) {
                    addMessage('system', 'Mau tips terkait keuangan atau lainnya?');
                    setChatState('konsultasi');
                } else if (lowerInput.includes('tidak') || lowerInput.includes('tdk') || lowerInput.includes('gak') || lowerInput.includes('gk')) {
                    addMessage('system', '**Terima kasih** telah menggunakan aplikasi ChakrAI. Semoga informasi yang diberikan bermanfaat! 🙏');
                    setChatState('selesai');
                } else {
                    addMessage('system', 'Maaf, apa ada yang bisa dibantu lagi?');
                }
            } else if (chatState === 'konsultasi') {
                if (inputText.toLowerCase().includes('keuangan')) {
                    addMessage('system', '*Sedang menyiapkan tips keuangan...*');
                    const financialAdvice = await getFinancialAdvice();
                    addMessage('system', financialAdvice);
                } else if (inputText.toLowerCase().includes('lain')) {
                    addMessage('system', 'Maaf, aplikasi ini hanya mendeteksi risiko **Judi Online** dan **Pinjaman Online Ilegal** di sekitar Anda serta **Literasi Keuangan**');
                } else {
                    addMessage('system', 'Ada yang bisa dibantu lagi?');
                }
            }
        } catch (error) {
            console.error('Error:', error);
            addMessage('system', 'Maaf, terjadi kesalahan. Silakan coba lagi nanti.');
        } finally {
            setIsLoading(false);
            setInputText('');
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const formatTimestamp = (date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    useEffect(() => {
        initializeDatabase();
        startScraping();
    }, []);

    const handleDataRefresh = () => {
        setDataRefresh(!dataRefresh);
    };

    return (
        <div className="relative flex justify-center items-start gap-8 h-screen overflow-hidden max-h-screen">
            {sidebarOpen && <div
                className="fixed inset-0 z-40 bg-gray-900/50 lg:hidden"
                onClick={() => setSidebarOpen(false)}
            />}

            <div className={`grow max-w-7xl ${sidebarOpen ? 'lg:mr-96' : 'lg:mr-0'} h-full pr-4`}>
                <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center flex-wrap gap-2 w-full">
                        <h2 className="text-2xl font-semibold">Chat dengan ChakrAI</h2>
                        <Button onClick={() => setSidebarOpen(prev => !prev)}>
                            Database Scrapping
                        </Button>
                    </div>

                    <Card className="w-full">
                        <div ref={chatBoxRef} className="flex flex-col gap-3 w-full h-[50vh] lg:h-[60vh] max-h-[60vh] overflow-y-auto custom-scrollbar scroll-smooth pb-4 pr-2">
                            {messages.map((msg, index) => (
                                <div key={index} className={`flex flex-col max-w-4/5 animate-fade-in ${msg.sender === 'user' ? 'self-end' : 'self-start'}`}>
                                    <div className={`${msg.sender === 'user' ? 'bg-blue-600 dark:bg-blue-400 text-white dark:text-gray-800 rounded-bl-lg' : 'bg-gray-100 dark:bg-gray-800 border dark:border-gray-900 rounded-br-lg'}
                                        rounded-t-lg shadow-sm px-4 py-2`}
                                    >
                                        {msg.sender === 'user' ? msg.text : <ReactMarkdown>{msg.text}</ReactMarkdown>}
                                    </div>
                                    <div className={`text-sm text-gray-300 dark:text-white/80 mt-1 ${msg.sender === 'user' ? 'self-end' : 'self-start'}`}>
                                        {formatTimestamp(msg.timestamp)}
                                    </div>
                                </div>
                            ))}
                            {isLoading && <div className={`flex flex-col max-w-4/5 animate-fade-in self-start`}>
                                <div className={`flex justify-center bg-gray-100 dark:bg-gray-800 border dark:border-gray-900 rounded-t-lg rounded-br-lg shadow-sm w-16 p-2`}>
                                    <LoaderCircle className="translate-y-1.5" />
                                </div>
                            </div>}
                        </div>

                        <div className="flex gap-2 w-full mt-4">
                            <div className="grow">
                                <InputText value={inputText} placeholder="Ketik pesan Anda di sini..." disabled={isLoading}
                                    onChange={(e) => setInputText(e.target.value)} onKeyDown={handleKeyDown} />
                            </div>
                            <Button onClick={handleSendMessage} disabled={isLoading || !inputText.trim()} className="flex flex-nowrap gap-2">
                                <PaperAirplaneIcon className="size-5" />
                                <span className="hidden lg:inline-flex">Kirim</span>
                            </Button>
                        </div>
                    </Card>

                    <div className="flex justify-stretch gap-4 w-full">
                        <KasusModal />
                        <LaporModal />
                    </div>
                </div>
            </div>

            <ScrapingSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} onDataRefresh={handleDataRefresh} />
        </div>
    )
}