import { useState, useEffect, useCallback, useRef } from 'react';
import Select from './Select';

export default function AreaSelector({
    selectedProvince,
    selectedRegency,
    selectedDistrict,
    selectedVillage,
    onProvinceChange,
    onRegencyChange,
    onDistrictChange,
    onVillageChange,
    disabled = false
}) {
    const [provinces, setProvinces] = useState([]);
    const [regencies, setRegencies] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [villages, setVillages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [selectedProvinceCode, setSelectedProvinceCode] = useState('');
    const [selectedRegencyCode, setSelectedRegencyCode] = useState('');
    const [selectedDistrictCode, setSelectedDistrictCode] = useState('');
    const [selectedVillageCode, setSelectedVillageCode] = useState('');

    const onRegencyChangeRef = useRef(onRegencyChange);
    const onDistrictChangeRef = useRef(onDistrictChange);
    const onVillageChangeRef = useRef(onVillageChange);

    useEffect(() => {
        onRegencyChangeRef.current = onRegencyChange;
        onDistrictChangeRef.current = onDistrictChange;
        onVillageChangeRef.current = onVillageChange;
    }, [onRegencyChange, onDistrictChange, onVillageChange]);

    const resetDependentFields = useCallback(() => {
        setDistricts([]);
        setVillages([]);
        setSelectedRegencyCode('');
        setSelectedDistrictCode('');
        setSelectedVillageCode('');
        if (onRegencyChangeRef.current) onRegencyChangeRef.current('');
        if (onDistrictChangeRef.current) onDistrictChangeRef.current('');
        if (onVillageChangeRef.current) onVillageChangeRef.current('');
    }, []);

    const resetDistrictFields = useCallback(() => {
        setVillages([]);
        setSelectedDistrictCode('');
        setSelectedVillageCode('');
        if (onDistrictChangeRef.current) onDistrictChangeRef.current('');
        if (onVillageChangeRef.current) onVillageChangeRef.current('');
    }, []);

    const resetVillageField = useCallback(() => {
        setSelectedVillageCode('');
        if (onVillageChangeRef.current) onVillageChangeRef.current('');
    }, []);

    useEffect(() => {
        const loadProvinces = async () => {
            try {
                setIsLoading(true);
                const { provinsi } = await import('daftar-wilayah-indonesia');
                const provincesData = provinsi();
                setProvinces(provincesData);
            } catch (error) {
                setProvinces([]);
            } finally {
                setIsLoading(false);
            }
        };

        loadProvinces();
    }, []);

    useEffect(() => {
        const loadRegencies = async () => {
            if (!selectedProvinceCode) {
                setRegencies([]);
                setDistricts([]);
                setVillages([]);
                return;
            }

            try {
                const { kabupaten } = await import('daftar-wilayah-indonesia');
                const regenciesData = kabupaten(selectedProvinceCode);
                setRegencies(regenciesData);
                resetDependentFields();
            } catch (error) {
                setRegencies([]);
            }
        };

        loadRegencies();
    }, [selectedProvinceCode, resetDependentFields]);

    useEffect(() => {
        const loadDistricts = async () => {
            if (!selectedRegencyCode) {
                setDistricts([]);
                setVillages([]);
                return;
            }

            try {
                const { kecamatan } = await import('daftar-wilayah-indonesia');
                const districtsData = kecamatan(selectedRegencyCode);
                setDistricts(districtsData);
                resetDistrictFields();
            } catch (error) {
                setDistricts([]);
            }
        };

        loadDistricts();
    }, [selectedRegencyCode, resetDistrictFields]);

    useEffect(() => {
        const loadVillages = async () => {
            if (!selectedDistrictCode) {
                setVillages([]);
                return;
            }

            try {
                const { desa } = await import('daftar-wilayah-indonesia');
                const villagesData = desa(selectedDistrictCode);
                setVillages(villagesData);
                resetVillageField();
            } catch (error) {
                setVillages([]);
            }
        };

        loadVillages();
    }, [selectedDistrictCode, resetVillageField]);

    const getProvinceName = (code) => {
        const province = provinces.find(p => p.kode === code);
        return province ? province.nama : '';
    };

    const getRegencyName = (code) => {
        const regency = regencies.find(r => r.kode === code);
        return regency ? regency.nama : '';
    };

    const getDistrictName = (code) => {
        const district = districts.find(d => d.kode === code);
        return district ? district.nama : '';
    };

    const getVillageName = (code) => {
        const village = villages.find(v => v.kode === code);
        return village ? village.nama : '';
    };

    if (isLoading) {
        return (
            <div className="flex flex-col gap-4">
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                </div>
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                </div>
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                </div>
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Provinsi
                </label>
                <Select
                    value={selectedProvinceCode}
                    onChange={(e) => {
                        const selectedCode = e.target.value;
                        setSelectedProvinceCode(selectedCode);
                        const selectedProvince = provinces.find(p => p.kode === selectedCode);
                        onProvinceChange(selectedProvince ? selectedProvince.nama : '');
                    }}
                    disabled={disabled}
                    options={{
                        '': 'Pilih Provinsi',
                        ...Object.fromEntries(
                            provinces.map(province => [province.kode, province.nama])
                        )
                    }}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Kabupaten/Kota
                </label>
                <Select
                    value={selectedRegencyCode}
                    onChange={(e) => {
                        const selectedCode = e.target.value;
                        setSelectedRegencyCode(selectedCode);
                        const selectedRegency = regencies.find(r => r.kode === selectedCode);
                        onRegencyChange(selectedRegency ? selectedRegency.nama : '');
                    }}
                    disabled={disabled || !selectedProvinceCode}
                    options={{
                        '': 'Pilih Kabupaten/Kota',
                        ...Object.fromEntries(
                            regencies.map(regency => [regency.kode, regency.nama])
                        )
                    }}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Kecamatan
                </label>
                <Select
                    value={selectedDistrictCode}
                    onChange={(e) => {
                        const selectedCode = e.target.value;
                        setSelectedDistrictCode(selectedCode);
                        const selectedDistrict = districts.find(d => d.kode === selectedCode);
                        onDistrictChange(selectedDistrict ? selectedDistrict.nama : '');
                    }}
                    disabled={disabled || !selectedRegencyCode}
                    options={{
                        '': 'Pilih Kecamatan',
                        ...Object.fromEntries(
                            districts.map(district => [district.kode, district.nama])
                        )
                    }}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Desa/Kelurahan
                </label>
                <Select
                    value={selectedVillageCode}
                    onChange={(e) => {
                        const selectedCode = e.target.value;
                        setSelectedVillageCode(selectedCode);
                        const selectedVillage = villages.find(v => v.kode === selectedCode);
                        onVillageChange(selectedVillage ? selectedVillage.nama : '');
                    }}
                    disabled={disabled || !selectedDistrictCode}
                    options={{
                        '': 'Pilih Desa/Kelurahan',
                        ...Object.fromEntries(
                            villages.map(village => [village.kode, village.nama])
                        )
                    }}
                />
            </div>
        </div>
    );
} 