import Button from './ui/Button'
import { useModal } from '../hooks/useModal'
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import Modal, { ModalFooter } from './ui/Modal';
import InputWrapper from "./form/InputWrapper";
import InputText from './form/InputText';
import Select from './form/Select';
import DatePicker from './form/DatePicker';
import AreaSelector from './form/AreaSelector';
import useNotyf from '../hooks/useNotyf';
import { useState } from 'react';
import LoaderSquare from './ui/Loader';
import { addNewReport } from '../services/dataService';

export default function LaporModal({ onReportAdded }) {
    const { isOpen, openModal, closeModal } = useModal();
    const notyf = useNotyf();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        judul: '',
        desa: '',
        kecamatan: '',
        kako: '',
        provinsi: '',
        kasus: 'Judi Online',
        waktu: new Date().toISOString().split('T')[0]
    });

    const [areaData, setAreaData] = useState({
        selectedProvince: '',
        selectedRegency: '',
        selectedDistrict: '',
        selectedVillage: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => { return { ...prev, [name]: value } });
    }

    const handleAreaChange = (type, value) => {
        setAreaData(prev => ({ ...prev, [type]: value }));

        if (type === 'selectedProvince') {
            setFormData(prev => ({ ...prev, provinsi: value }));
        } else if (type === 'selectedRegency') {
            setFormData(prev => ({ ...prev, kako: value }));
        } else if (type === 'selectedDistrict') {
            setFormData(prev => ({ ...prev, kecamatan: value }));
        } else if (type === 'selectedVillage') {
            setFormData(prev => ({ ...prev, desa: value }));
        }
    }

    const handleSubmit = async () => {
        if (!formData.judul || !formData.desa || !formData.kecamatan || !formData.kako || !formData.provinsi) {
            notyf.error('Semua field harus diisi');
            return;
        }

        setIsLoading(true);

        try {
            await addNewReport(formData);

            setFormData({
                judul: '',
                desa: '',
                kecamatan: '',
                kako: '',
                provinsi: '',
                kasus: 'Judi Online',
                waktu: new Date().toISOString().split('T')[0]
            });
            setAreaData({
                selectedProvince: '',
                selectedRegency: '',
                selectedDistrict: '',
                selectedVillage: ''
            });
            closeModal();

            notyf.success('Laporan berhasil disubmit!');

            if (onReportAdded) onReportAdded();
        } catch (error) {
            notyf.error(`Laporan gagal disubmit: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    }

    const handleCloseModal = () => {
        closeModal();
        setFormData({
            judul: '',
            desa: '',
            kecamatan: '',
            kako: '',
            provinsi: '',
            kasus: 'Judi Online',
            waktu: new Date().toISOString().split('T')[0]
        });
        setAreaData({
            selectedProvince: '',
            selectedRegency: '',
            selectedDistrict: '',
            selectedVillage: ''
        });
    };

    return (
        <>
            <Button onClick={openModal} className="flex justify-center gap-2">
                <PlusCircleIcon className="size-5" />
                Lapor Kejadian Lokal
            </Button>

            <Modal isOpen={isOpen} onClose={handleCloseModal} title="Lapor Kejadian" className="w-[560px]">
                <div className="flex flex-col gap-4">
                    <InputWrapper label="Judul Kasus">
                        <InputText
                            name="judul"
                            value={formData.judul}
                            onChange={handleInputChange}
                            disabled={isLoading}
                        />
                    </InputWrapper>

                    <InputWrapper label="Jenis Kasus">
                        <Select
                            name="kasus"
                            value={formData.kasus}
                            onChange={handleInputChange}
                            disabled={isLoading}
                            options={{
                                'Judi Online': 'Judi Online',
                                'Pinjaman Online Ilegal': 'Pinjaman Online Ilegal'
                            }}
                        />
                    </InputWrapper>

                    <InputWrapper label="Lokasi Kejadian">
                        <AreaSelector
                            selectedProvince={areaData.selectedProvince}
                            selectedRegency={areaData.selectedRegency}
                            selectedDistrict={areaData.selectedDistrict}
                            selectedVillage={areaData.selectedVillage}
                            onProvinceChange={(value) => handleAreaChange('selectedProvince', value)}
                            onRegencyChange={(value) => handleAreaChange('selectedRegency', value)}
                            onDistrictChange={(value) => handleAreaChange('selectedDistrict', value)}
                            onVillageChange={(value) => handleAreaChange('selectedVillage', value)}
                            disabled={isLoading}
                        />
                    </InputWrapper>

                    <InputWrapper label="Waktu Kejadian">
                        <DatePicker
                            name="waktu"
                            value={formData.waktu}
                            onChange={handleInputChange}
                            disabled={isLoading}
                        />
                    </InputWrapper>
                </div>

                <ModalFooter>
                    <Button color="gray" onClick={handleCloseModal} disabled={isLoading}>
                        Tutup
                    </Button>
                    {!isLoading
                        ? <Button onClick={handleSubmit}>Submit</Button>
                        : <LoaderSquare className={!isLoading && 'hidden'} />
                    }
                </ModalFooter>
            </Modal>
        </>
    )
}
