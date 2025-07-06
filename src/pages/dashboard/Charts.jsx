import { useEffect, useState } from "react";
import Card from "../../components/ui/Card";
import Select from "../../components/form/Select";
import Chart from "react-apexcharts";
import { useTheme } from "../../context/ThemeContext";
import req, { errorReqHandler } from "../../req/req";
import LaporModal from "../../components/LaporModal";

const monthNames = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember'
];

const options = {
    chart: {
        height: 240,
        toolbar: { show: false },
        background: 'transparent'
    },
    plotOptions: {
        bar: {
            horizontal: false,
            columnWidth: '40%',
            borderRadius: 4,
            borderRadiusApplication: 'end'
        }
    },
    dataLabels: { enabled: false },
    stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
    },
    xaxis: {
        categories: monthNames.map((value) => value.substring(0,3)),
        axisBorder: { show: false },
        axisTicks: { show: false },
    },
    legend: {
        show: true,
        position: 'top',
        horizontalAlign: 'left',
    },
    yaxis: {
        title: {
            text: undefined
        }
    },
    grid: {
        yaxis: {
            lines: { show: true }
        }
    },
    fill: { opacity: 1 },
    tooltip: {
        custom: ({series, seriesIndex, dataPointIndex, w}) => {
            return `
                <div class="grid place-items-center bg-white dark:bg-gray-800 rounded-md shadow-md px-4 py-2">
                    <p class="text-gray-900 dark:text-white mb-0">
                        ${monthNames[dataPointIndex]}: <strong>${series[seriesIndex][dataPointIndex]}</strong> kasus
                    </p>
                </div>
            `
        },
        x: { show: false },
        y: { show: true }
    },
}

export default function Charts() {
    const { theme } = useTheme();

    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState({});
    const [availableYears, setAvailableYears] = useState([]);
    const [selectedYear, setSelectedYear] = useState('');
    const [caseType, setCaseType] = useState('all');

    useEffect(() => {
        getLaporan();

        return () => {
            setData([]);
        }
    }, []);

    useEffect(() => {
        getCasesByMonth();

        return () => {
            setFilteredData({});
        }
    }, [data, caseType]);

    const getLaporan = async () => {
        try {
            const res = await req.get('laporan')
                .catch((error) => { throw error; });

            if (res.status !== 200)
                throw new Error(res.data.message);

            setData(res.data.laporan);
            getCasesByMonth();
        } catch (error) {
            errorReqHandler(error);
        }
    }

    const getCasesByMonth = () => {
        const monthCounts = {};
        const yearCounts = [];

        data.forEach(item => {
            if (caseType !== 'all' && item.Kasus !== caseType) return;

            const date = new Date(item.Waktu);
            const monthYear = `${date.getMonth() + 1}-${date.getFullYear()}`;

            if (!yearCounts.includes(date.getFullYear())) yearCounts.push(date.getFullYear());

            if (!monthCounts[monthYear]) monthCounts[monthYear] = 0;
            monthCounts[monthYear]++;
        });

        yearCounts.sort().reverse();
        setAvailableYears(yearCounts);
        setSelectedYear(yearCounts[0]);

        setFilteredData(monthCounts);
    }

    return (
        <div className="flex flex-col gap-6 w-full">
            <Card title="Grafik Batang Kasus Kejadian Judi Online & Pinjaman Online Ilegal">
                <div className="flex flex-col justify-center items-center">
                    <div className="flex flex-wrap justify-end items-center gap-2 lg:gap-4 w-full mt-4">
                        <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-700 dark:text-gray-400">Jenis Kasus</span>
                            <div className="flex w-32">
                                <Select value={caseType} onChange={(e) => setCaseType(e.target.value)}
                                    options={{
                                        'all': 'Semua',
                                        'Judi Online': 'Judi Online',
                                        'Pinjaman Online Ilegal': 'Pinjaman Online Ilegal',
                                    }}
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-700 dark:text-gray-400">Tahun</span>
                            <div className="flex w-32">
                                <Select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}
                                    options={availableYears.reduce((a, v) => ({...a, [v]: v}), {})} />
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-white/10 rounded-lg w-full mt-6">
                        <Chart type='bar' height={240}
                            options={{
                                ...options,
                                colors: [theme === 'light' ? '#155dfc' : '#51a2ff'],
                                theme: { mode: theme }
                            }}
                            series={[{
                                name: `Kasus ${selectedYear ?? ''}`,
                                data: monthNames.map((value, index) => filteredData[`${index+1}-${selectedYear}`] ?? 0)
                            }]}
                        />
                    </div>
                </div>
            </Card>
            <div className="flex justify-end items-center gap-2">
                <LaporModal onReportAdded={getLaporan} />
            </div>
        </div>
    )
}
