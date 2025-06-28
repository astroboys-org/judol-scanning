import Button from './ui/Button'
import { useModal } from '../hooks/useModal'
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import Modal, { ModalFooter } from './ui/Modal';
import InputWrapper from "./form/InputWrapper";
import InputText from './form/InputText';
import Select from './form/Select';
import DatePicker from './form/DatePicker';
import useNotyf from '../hooks/useNotyf';
import { useState } from 'react';
import { addNewReport } from '../services/dataService';

export default function LaporModal({ onReportAdded }) {
    const { isOpen, openModal, closeModal } = useModal();
    const notyf = useNotyf();
    const [formData, setFormData] = useState({
        Judul: '',
        Desa: '',
        Kecamatan: '',
        Kako: '',
        Provinsi: '',
        Kasus: 'Judi Online',
        Waktu: new Date().toISOString().split('T')[0]
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => { return { ...prev, [name]: value } });
    }

    const handleSubmit = () => {
        if (!formData.Judul || !formData.Desa || !formData.Kecamatan || !formData.Kako || !formData.Provinsi) {
            notyf.error('Semua field harus diisi');
            return;
        }

        addNewReport(formData);

        setFormData({
            Judul: '',
            Desa: '',
            Kecamatan: '',
            Kako: '',
            Provinsi: '',
            Kasus: 'Judi Online',
            Waktu: new Date().toISOString().split('T')[0]
        });
        closeModal();

        if (onReportAdded) onReportAdded();
    }

    return (
        <>
            <Button onClick={openModal} className="flex justify-center gap-2 w-full">
                <PlusCircleIcon className="size-5" />
                Lapor Kejadian Lokal
            </Button>

            <Modal isOpen={isOpen} onClose={closeModal} title="Lapor Kejadian" className="w-[560px]">
                <div className="flex flex-col gap-4">
                    <InputWrapper label="Judul Kasus">
                        <InputText name="Judul" value={formData.Judul} onChange={handleInputChange} />
                    </InputWrapper>

                    <InputWrapper label="Jenis Kasus">
                        <Select name="Kasus" value={formData.Kasus} onChange={handleInputChange}
                            options={{
                                'Judi Online': 'Judi Online',
                                'Pinjaman Online Ilegal': 'Pinjaman Online Ilegal'
                            }}
                        />
                    </InputWrapper>

                    <InputWrapper label="Desa">
                        <InputText name="Desa" value={formData.Desa} onChange={handleInputChange} />
                    </InputWrapper>

                    <InputWrapper label="Kecamatan">
                        <InputText name="Kecamatan" value={formData.Kecamatan} onChange={handleInputChange} />
                    </InputWrapper>

                    <InputWrapper label="Kabupate/Kota">
                        <InputText name="Kako" value={formData.Kako} onChange={handleInputChange} />
                    </InputWrapper>

                    <InputWrapper label="Provinsi">
                        <InputText name="Provinsi" value={formData.Provinsi} onChange={handleInputChange} />
                    </InputWrapper>

                    <InputWrapper label="Waktu Kejadian">
                        <DatePicker name="Waktu" value={formData.Waktu} onChange={handleInputChange} />
                    </InputWrapper>
                </div>

                <ModalFooter>
                    <Button color="gray" onClick={closeModal}>Tutup</Button>
                    <Button onClick={handleSubmit}>Submit</Button>
                </ModalFooter>
            </Modal>
        </>
    )
}
