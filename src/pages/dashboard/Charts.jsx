import { useEffect, useState } from "react";
import Card from "../../components/ui/Card";
import { getAllData } from "../../services/dataService";
import Select from "../../components/form/Select";
import Chart from "react-apexcharts";
import { useTheme } from "../../context/ThemeContext";

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
    colors: ["#2b7fff"],
    chart: {
        type: 'bar',
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
        width: 4,
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
                        ${monthNames[dataPointIndex]}: <strong>${series[seriesIndex][dataPointIndex]}</strong>
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
    const [dataPerMonth, setDataPerMonth] = useState({});
    const [yearsData, setYearsData] = useState([]);
    const [selectedYear, setSelectedYear] = useState('');

    useEffect(() => {
        setData(getAllData());

        return () => {
            setData();
        }
    }, []);

    useEffect(() => {
        getCasesByMonth();

        return () => {
            setDataPerMonth({});
        }
    }, [data]);

    const getCasesByMonth = () => {
        const monthCounts = {};
        const yearCounts = [];

        data.forEach(item => {
            const date = new Date(item.Waktu);
            const monthYear = `${date.getMonth() + 1}-${date.getFullYear()}`;

            if (!yearCounts.includes(date.getFullYear())) yearCounts.push(date.getFullYear());

            if (!monthCounts[monthYear]) monthCounts[monthYear] = 0;
            monthCounts[monthYear]++;
        });

        yearCounts.sort().reverse();
        setYearsData(yearCounts);
        setSelectedYear(yearCounts[0]);

        setDataPerMonth(monthCounts);
    }

    const handleYearChange = (e) => {
        setSelectedYear(e.target.value);
    }

    return (
        <div className="flex flex-col w-full">
            <Card title="Grafik Kasus Kejadian Judol & Pinjol">
                <div className="flex flex-col justify-center items-center">
                    <div className="flex justify-end items-center gap-4 w-full">
                        <span className="font-medium text-gray-700 dark:text-gray-400">Tahun</span>
                        <div className="flex w-32">
                            <Select value={selectedYear} onChange={handleYearChange}
                                options={yearsData.reduce((a, v) => ({...a, [v]: v}), {})} />
                        </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-white/10 rounded-lg w-full mt-6">
                        <Chart type='bar' height={240} options={{...options, theme: { mode: theme }}} series={[{
                            name: `Kasus ${selectedYear ?? ''}`,
                            data: monthNames.map((value, index) => dataPerMonth[`${index+1}-${selectedYear}`] ?? 0)
                        }]} />
                    </div>
                </div>
            </Card>
        </div>
    )
}
