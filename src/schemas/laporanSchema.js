import mongoose from "mongoose";

export const LaporanKasusSchema = new mongoose.Schema({
    Judul: {
        type: String,
        required: true,
    },
    Desa: {
        type: String,
        required: true,
    },
    Kecamatan: {
        type: String,
        required: true,
    },
    Kako: {
        type: String,
        required: true,
    },
    Provinsi: {
        type: String,
        required: true,
    },
    Kasus: {
        type: String,
        required: true,
    },
    Waktu: {
        type: Date,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
});

export const LaporanKasusModel = mongoose.model('laporan_kasus', LaporanKasusSchema);