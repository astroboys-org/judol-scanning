import { useState, useEffect } from 'react';
import { getAllScrapedData, getDataByCategory, searchScrapedData, exportDatabaseToJSON, importDatabaseFromJSON } from '../services/databaseService';
import { getInsightsFromScrapedData, extractInformationFromScrapedData } from '../services/aiService';
import { startScraping } from '../services/scrapingService';
import { DB_CONFIG } from '../services/databaseService';
import InputText from "./form/InputText";
import FileUpload from "./form/FileUpload";
import Select from "./form/Select";
import Button from "./ui/Button";
import Badge from "./ui/Badge";
import useNotyf from '../hooks/useNotyf';
import Card from './ui/Card';
import { XMarkIcon } from '@heroicons/react/24/outline';
import LoaderSquare from './ui/Loader';

export default function ScrapingSidebar({ isOpen, setIsOpen, onDataRefresh }) {
    const notyf = useNotyf();

    const [tabScrapping, setTabScrapping] = useState(true);
    const [scrapedData, setScrapedData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [insights, setInsights] = useState('');
    const [importFile, setImportFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            loadData();
        }
    }, [isOpen]);

    useEffect(() => {
        filterData();
    }, [searchTerm, selectedCategory, scrapedData]);

    const loadData = async () => {
        const data = await getAllScrapedData();
        setScrapedData(data);
        setFilteredData(data);
    };

    const filterData = async () => {
        let result = [];

        if (searchTerm) {
            result = await searchScrapedData(searchTerm, selectedCategory !== 'all' ? selectedCategory : null);
        } else if (selectedCategory !== 'all') {
            result = await getDataByCategory(selectedCategory);
        } else {
            result = [...scrapedData];
        }

        setFilteredData(result);
    };

    const loadInsights = async () => {
        setIsLoading(true);
        try {
            const insightText = await getInsightsFromScrapedData();
            setInsights(insightText);
        } catch (error) {
            console.error('Error loading insights:', error);
            notyf.error('Gagal memuat insight dari data');
        } finally {
            setIsLoading(false);
        }
    };

    const handleExport = async () => {
        const success = await exportDatabaseToJSON();
        if (success) {
            notyf.success('Database berhasil diekspor');
        } else {
            notyf.error('Gagal mengekspor database');
        }
    };

    const handleImport = (e) => {
        setImportFile(e.target.files[0]);
    };

    const processImport = () => {
        if (!importFile) {
            notyf.open({ type: 'warning', message: 'Pilih file untnuk diimpor' });
            return;
        }

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const success = await importDatabaseFromJSON(e.target.result);
                if (success) {
                    notyf.success('Database berhasil diimpor');
                    await loadData();
                    if (onDataRefresh) onDataRefresh();
                } else {
                    notyf.error('Gagal mengimpor database');
                }
            } catch {
                notyf.error('Format file tidak valid');
            }
        };
        reader.readAsText(importFile);
    };

    const handleStartScraping = async () => {
        setIsLoading(true);
        notyf.open({ type: 'info', message: 'Memulai proses scraping...' });

        try {
            // Jalankan proses scraping
            await startScraping();

            // Ambil data hasil scraping
            const scrapedData = await getAllScrapedData();

            // Jika ada data yang berhasil di-scrape
            if (scrapedData.length > 0) {
                notyf.open({ type: 'info', message: 'Mengekstrak informasi penting dari hasil scraping...' });

                // Proses batch data untuk menghindari token limit
                const batchSize = 10;
                let processedData = [];

                for (let i = 0; i < scrapedData.length; i += batchSize) {
                    const batch = scrapedData.slice(i, i + batchSize);
                    const extractedInfo = await extractInformationFromScrapedData(batch);
                    processedData = [...processedData, ...extractedInfo];
                }

                // Update data dengan informasi yang diekstrak
                if (processedData.length > 0) {
                    // Gabungkan data yang sudah diekstrak dengan data asli
                    const updatedData = scrapedData.map(item => {
                        const extractedItem = processedData.find(extracted => extracted.url === item.url);
                        if (extractedItem) {
                            return {
                                ...item,
                                title: extractedItem.title || item.title,
                                category: extractedItem.category || item.category,
                                location: extractedItem.location || item.location
                            };
                        }
                        return item;
                    });

                    // Simpan data yang sudah diperbarui
                    await saveScrapedData(updatedData);
                }
            }

            notyf.success('Proses scraping dan ekstraksi informasi selesai');

            loadData(); // Muat ulang data setelah scraping
        } catch (error) {
            console.error('Error saat scraping:', error);
            notyf.error('Gagal menjalankan scraping');
        } finally {
            setIsLoading(false);
        }
    };

    const getBadgeColor = (category) => {
        switch (category) {
            case 'Judi Online': return 'red';
            case 'Pinjol Ilegal': return 'yellow';
            case 'Kredit Ilegal': return 'white';
            case 'Judi Sabung Ayam': return 'gray';
            default: return 'blue';
        }
    };

    return (
        <div className={`fixed lg:absolute top-0 right-0 flex flex-col dark:bg-gray-900 dark:lg:bg-transparent w-96 h-screen mt-20 lg:mt-0 ${isOpen ? 'translate-x-0' : 'translate-x-full pl-20'} transition-all duration-300 ease-in-out origin-right z-50`}>
            <Card title="Database Kasus Ilegal" className="w-full max-h-[90vh] lg:max-h-fit"
                rightIcon={
                    <div className="text-gray-400 dark:text-white/30 hover:text-gray-600 dark:hover:text-white/50 cursor-pointer transition" onClick={() => setIsOpen(false)}>
                        <XMarkIcon className="size-5" />
                    </div>
                }>
                <div className="flex flex-col items-center">
                    <div className="relative grid grid-cols-2 gap-2 rounded-lg bg-gray-50 dark:bg-gray-800 border dark:border-gray-900 shadow-md box-border p-1 w-full mb-4">
                        <div className={`menu-item ${tabScrapping ? 'menu-item-active' : 'menu-item-inactive'} justify-center cursor-pointer`} onClick={() => setTabScrapping(true)}>
                            Data Scraping
                        </div>
                        <div className={`menu-item ${!tabScrapping ? 'menu-item-active' : 'menu-item-inactive'} justify-center cursor-pointer`} onClick={() => setTabScrapping(false)}>
                            Insights
                        </div>
                    </div>

                    {tabScrapping
                        ? <div className="flex flex-col items-center gap-4">
                            <div className="flex flex-col gap-2 w-full">
                                <InputText placeholder="Cari data..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                                <Select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} options={{
                                    "all": "Semua Kategori",
                                    "Judi Online": "Judi Online",
                                    "Pinjol Ilegal": "Pinjol Ilegal",
                                    "Kredit Ilegal": "Kredit Ilegal",
                                    "Judi Sabung Ayam": "Judi Sabung Ayam"
                                }} />

                                <div className="flex justify-end items-center gap-2">
                                    <Button color="yellow" onClick={handleStartScraping} className={isLoading && 'hidden'}>
                                        Mulai Scraping
                                    </Button>
                                    <Button color="green" onClick={handleExport} className={isLoading && 'hidden'}>
                                        Export
                                    </Button>

                                    <LoaderSquare className={!isLoading && 'hidden'} />
                                </div>
                            </div>

                            <div className="flex flex-wrap justify-end gap-2 w-full mt-4">
                                <FileUpload onChange={handleImport} accept=".json" />
                                <Button onClick={processImport}>Import</Button>
                            </div>

                            <div className="flex overflow-y-auto no-scrollbar border dark:border-gray-900 rounded-lg w-full h-72 mt-6">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-100 dark:bg-gray-800">
                                        <tr>
                                            <th className="font-semibold p-1.5">#</th>
                                            <th className="font-semibold p-1.5">Judul</th>
                                            <th className="font-semibold p-1.5">Kategori</th>
                                            <th className="font-semibold p-1.5">Lokasi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredData.length > 0 ? (
                                            filteredData.map((item, index) => (
                                                <tr key={index}>
                                                    <td className="font-light p-1.5">{index + 1}</td>
                                                    <td className="font-light p-1.5">
                                                        <a href={item.url} target="_blank" className="text-blue-600 dark:text-blue-400 cursor-pointer text-ellipsis">
                                                            {item.title}
                                                        </a>
                                                    </td>
                                                    <td className="font-light p-1.5">
                                                        <Badge color={getBadgeColor(item.category)}>
                                                            {item.category}
                                                        </Badge>
                                                    </td>
                                                    <td className="font-light p-1.5">{item.location}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="text-center font-light p-1.5">
                                                    Tidak ada data yang ditemukan
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            <div className="text-sm">
                                Menampilkan {filteredData.length} dari {scrapedData.length} data
                            </div>
                        </div>
                        : <div className="flex flex-col items-center gap-4 min-h-[80vh]">
                            <Button onClick={loadInsights} className={isLoading && 'hidden'}>
                                Generate Insights
                            </Button>

                            <LoaderSquare className={isLoading ? 'mt-2' : 'hidden'} />

                            {insights
                                ? <div className="bg-gray-100 dark:bg-gray-800 text-sm rounded-lg max-h-[65vh] lg:max-h-[80vh] overflow-y-auto no-scrollbar p-4">
                                    <div dangerouslySetInnerHTML={{ __html: insights.replace(/\n/g, '<br />') }} />
                                </div>
                                : <div className={`text-gray-600 dark:text-white/30 text-center ${isLoading && 'hidden'}`}>
                                    Klik tombol di atas untuk menghasilkan insights
                                </div>
                            }
                        </div>
                    }
                </div>
            </Card>
        </div>
    )
}