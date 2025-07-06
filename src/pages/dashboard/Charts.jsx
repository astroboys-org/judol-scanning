import { useEffect, useState } from "react";
import Card from "../../components/ui/Card";
import Select from "../../components/form/Select";
import Chart from "react-apexcharts";
import { useTheme } from "../../context/ThemeContext";
import LaporModal from "../../components/LaporModal";
import { getAllData } from "../../services/dataService";
import useNotyf from "../../hooks/useNotyf";

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

const caseTypes = [
    "Judi Online",
    "Pinjaman Online Ilegal",
];

const barchartOptions = {
    chart: { height: 240, toolbar: { show: false }, background: 'transparent' },
    plotOptions: {
        bar: { horizontal: false, columnWidth: '40%', borderRadius: 4, borderRadiusApplication: 'end' }
    },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 2, colors: ['transparent'] },
    legend: { show: true, position: 'top', horizontalAlign: 'left' },
    xaxis: {
        categories: monthNames.map((value) => value.substring(0,3)),
        axisBorder: { show: false },
        axisTicks: { show: false },
    },
    yaxis: { title: { text: undefined } },
    grid: { yaxis: { lines: { show: true } } },
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

const piechartOptions = {
    colors: ['#054a91', '#fdc500', '#3e7cb1', '#81a4cd', '#f17300', '#00296b'],
    chart: { height: 240, toolbar: { show: false }, background: 'transparent' },
    plotOptions: {
        pie: {
            donut: {
                size: '50%',
                labels: {
                    show: true,
                    total: { show: true, showAlways: true, label: 'Total Kasus', fontSize: '14px', fontWeight: 400, }
                }
            },
            expandOnClick: false,
        }
    },
    dataLabels: { enabled: true, dropShadow: { enabled: false } },
    legend: {
        show: true,
        position: 'right',
        horizontalAlign: 'center',
        fontSize: '15px',
        markers: {strokeWidth: 0.5, offsetX: -4},
    },
    stroke: { show: true, width: 2, colors: ['transparent'] },
    responsive: [{
        breakpoint: 640,
        options: {
            legend: { position: 'bottom', fontSize: '14px' }
        }
    }]
}

export default function Charts() {
    const [data, setData] = useState([]);
    const notyf = useNotyf();

    useEffect(() => {
        fetchData();

        return () => {
            setData([]);
        }
    }, []);

    const fetchData = async () => {
        try {
            const result = await getAllData();
            setData(result || []);
        } catch (error) {
            notyf.error('Error fetching data:', error);
            setData([]);
        }
    };

    const getCasesByMonth = (caseType = 'all') => {
        const monthCounts = {};
        const yearCounts = [];

        if (!Array.isArray(data)) {
            return [];
        }

        data.forEach(item => {
            if (caseType !== 'all' && item.kasus !== caseType) return;

            const date = new Date(item.waktu);
            const monthYear = `${date.getMonth() + 1}-${date.getFullYear()}`;

            if (!yearCounts.includes(date.getFullYear())) yearCounts.push(date.getFullYear());

            if (!monthCounts[monthYear]) monthCounts[monthYear] = 0;
            monthCounts[monthYear]++;
        });

        return { yearCounts: yearCounts.sort().reverse(), monthCounts: monthCounts};
    }

    return (
        <div className="flex flex-col gap-6 w-full">
            {data.length > 0 && <BarChart getCasesByMonth={getCasesByMonth} />}
            {data.length > 0 && <PieChart getCasesByMonth={getCasesByMonth} />}
            <div className="flex justify-end items-center gap-2">
                <LaporModal onReportAdded={fetchData} />
            </div>
        </div>
    )
}

function BarChart({ getCasesByMonth }) {
    const { theme } = useTheme();

    const [caseType, setCaseType] = useState('all');
    const [filteredData, setFilteredData] = useState({});
    const [availableYears, setAvailableYears] = useState([]);
    const [selectedYear, setSelectedYear] = useState('');

    useEffect(() => {
        const casesByMonth = getCasesByMonth(caseType);
        setAvailableYears(casesByMonth.yearCounts);
        setSelectedYear(casesByMonth.yearCounts[0]);
        setFilteredData(casesByMonth.monthCounts);

        return () => {
            setFilteredData({});
        }
    }, [caseType]);

    return (
        <Card title="Grafik Batang Kasus Kejadian">
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
                                options={availableYears.reduce((a, v) => ({...a, [v]: v}), {})}
                            />
                        </div>
                    </div>
                </div>
                <div className="flex w-full max-w-full overflow-x-auto custom-scrollbar">
                    <div className="bg-gray-50 dark:bg-white/10 rounded-lg min-w-xl w-full mt-6">
                        <Chart type='bar' height={240} options={{
                                ...barchartOptions,
                                colors: [theme === 'light' ? '#155dfc' : '#51a2ff'],
                                theme: { mode: theme },
                            }}
                            series={[{
                                name: `Kasus ${selectedYear ?? ''}`,
                                data: monthNames.map((value, index) => filteredData[`${index+1}-${selectedYear}`] ?? 0)
                            }]}
                        />
                    </div>
                </div>
            </div>
        </Card>
    )
}

function PieChart({ getCasesByMonth }) {
    const { theme } = useTheme();

    const [selectedMonth, setSelectedMonth] = useState((new Date().getMonth())+1);
    const [selectedYear, setSelectedYear] = useState(0);
    const [availableYears, setAvailableYears] = useState([]);
    const [filteredData, setFilteredData] = useState({});

    useEffect(() => {
        caseTypes.forEach((caseType) => {
            const casesByMonth = getCasesByMonth(caseType);
            setFilteredData(prev => ({...prev, [caseType]: casesByMonth.monthCounts}));

            const yearCounts = availableYears;
            casesByMonth.yearCounts.forEach((year) => {
                if (!yearCounts.includes(year)) yearCounts.push(year);
            });
            yearCounts.sort().reverse();
            setAvailableYears(yearCounts);
            setSelectedYear(yearCounts[0]);
        });
    }, []);

    useEffect(() => {
        // console.log(Object.keys(filteredData).map((key) => filteredData[key][`${selectedMonth}-${selectedYear}`] ?? 0));
        // console.log(Object.keys(filteredData).map((key) => key));
    }, [filteredData]);

    return (
        <Card title="Grafik Pie Perbandingan Jumlah Kasus Kejadian per Bulan">
            <div className="flex flex-col justify-center items-center">
                <div className="flex flex-wrap justify-end items-center gap-2 lg:gap-4 w-full mt-4">
                    <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-700 dark:text-gray-400">Jenis Kasus</span>
                        <div className="flex w-32">
                            <Select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}
                                options={monthNames.reduce((a, v, i) => ({...a, [i+1]: v}), {})}
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-700 dark:text-gray-400">Tahun</span>
                        <div className="flex w-32">
                            <Select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}
                                options={availableYears.reduce((a, v) => ({...a, [v]: v}), {})}
                            />
                        </div>
                    </div>
                </div>
                <div className="bg-gray-50 dark:bg-white/10 rounded-lg w-full mt-6">
                    <Chart type='donut' height={240} options={{
                            ...piechartOptions,
                            theme: { mode: theme },
                            labels: Object.keys(filteredData).map((key) => key)
                        }}
                        series={Object.keys(filteredData).map((key) => filteredData[key][`${selectedMonth}-${selectedYear}`] ?? 0)}
                    />
                </div>
            </div>
        </Card>
    )
}
