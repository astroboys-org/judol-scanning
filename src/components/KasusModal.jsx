import { useModal } from "../hooks/useModal";
import Button from "./ui/Button";
import { ArchiveBoxIcon } from "@heroicons/react/24/outline";
import Modal from "./ui/Modal";
import { useEffect, useState } from "react";
import { getAllData } from "../services/dataService";

export default function KasusModal() {
    const { isOpen, openModal, closeModal } = useModal();
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getAllData();
                setData(result || []);
            } catch (error) {
                console.error('Error fetching data:', error);
                setData([]);
            }
        };

        fetchData();

        return () => {
            setData([]);
        }
    }, []);

    const getCasesByMonth = () => {
        const monthCounts = {};

        if (!Array.isArray(data)) {
            return [];
        }

        data.forEach(item => {
            const date = new Date(item.Waktu);
            const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;

            if (!monthCounts[monthYear]) {
                monthCounts[monthYear] = 0;
            }
            monthCounts[monthYear]++;
        });

        return Object.entries(monthCounts).map(([key, value]) => ({
            month: key,
            count: value
        }));
    };

    const getCasesByRegion = () => {
        const regionCounts = {};

        if (!Array.isArray(data)) {
            return [];
        }

        data.forEach(item => {
            if (!regionCounts[item.Kako]) {
                regionCounts[item.Kako] = 0;
            }
            regionCounts[item.Kako]++;
        });

        return Object.entries(regionCounts).map(([key, value]) => ({
            region: key,
            count: value
        }));
    };

    return (
        <>
            <Button color="gray" onClick={openModal} className="flex justify-center gap-2 w-full">
                <ArchiveBoxIcon className="size-5" />
                Dashboard Kasus
            </Button>

            <Modal isOpen={isOpen} onClose={closeModal} isFullScreen={true} title="Visualisasi Kasus">
                <div className="grid lg:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-4 bg-gray-50 dark:bg-white/20 rounded-lg shadow-md p-4">
                        <h3 className="text-xl font-semibold border-b dark:border-gray-900 pb-2">Jumlah Kejadian per Bulan</h3>
                        <div className="flex flex-col gap-2 items-start text-sm h-80 overflow-y-auto no-scrollbar">
                            {getCasesByMonth().map((item, index) => (
                                <div key={index} className="border dark:border-gray-800 rounded-sm w-full p-2">
                                    <div className="flex justify-between items-center">
                                        <span>{item.month}</span>
                                        <span className="font-semibold">{item.count}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col gap-4 bg-gray-50 dark:bg-white/20 rounded-lg shadow-md p-4">
                        <h3 className="text-xl font-semibold border-b dark:border-gray-900 pb-2">Jumlah Kejadian per Region</h3>
                        <div className="flex flex-col gap-2 items-start text-sm h-80 overflow-y-auto no-scrollbar">
                            {getCasesByRegion().map((item, index) => (
                                <div key={index} className="border dark:border-gray-800 rounded-sm w-full p-2">
                                    <div className="flex justify-between items-center">
                                        <span>{item.region}</span>
                                        <span className="font-semibold">{item.count}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    )
}
