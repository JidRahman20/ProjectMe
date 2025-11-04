import { FormData, FormErrors } from "../types";

export const validateForm = (form: FormData, minDate: string): { isValid: boolean; errors: FormErrors } => {
  const newErrors: FormErrors = {
    kegiatan: "",
    tanggalPermintaan: "",
    tanggalPengiriman: "",
    untukBagian: "",
    yangMengajukan: "",
    approval: "",
    tamu: "",
    jumlahTamu: "",
    lokasi: "",
    waktu: "",
  };
  
  let isValid = true;

  if (!form.kegiatan) {
    newErrors.kegiatan = "Kegiatan / Event wajib diisi";
    isValid = false;
  }
  
  if (!form.tanggalPermintaan) {
    newErrors.tanggalPermintaan = "Tanggal permintaan wajib diisi";
    isValid = false;
  } else if (form.tanggalPermintaan < minDate) {
    newErrors.tanggalPermintaan = "Tanggal permintaan tidak boleh terlewat dari hari ini";
    isValid = false;
  }
  
  if (!form.tanggalPengiriman) {
    newErrors.tanggalPengiriman = "Tanggal pengiriman wajib diisi";
    isValid = false;
  } else if (form.tanggalPengiriman < minDate) {
    newErrors.tanggalPengiriman = "Tanggal pengiriman tidak boleh terlewat dari hari ini";
    isValid = false;
  }
  
  if (!form.untukBagian.trim()) {
    newErrors.untukBagian = "Untuk Bagian wajib diisi";
    isValid = false;
  }
  
  if (!form.yangMengajukan.trim()) {
    newErrors.yangMengajukan = "Yang Mengajukan wajib diisi";
    isValid = false;
  }
  
  if (!form.approval.trim()) {
    newErrors.approval = "Approval wajib dipilih";
    isValid = false;
  }
  
  if (!form.tamu) {
    newErrors.tamu = "Tamu wajib diisi";
    isValid = false;
  }
  
  if (!form.jumlahTamu || form.jumlahTamu <= 0) {
    newErrors.jumlahTamu = "Jumlah tamu wajib diisi dan lebih dari 0";
    isValid = false;
  }
  
  if (!form.lokasi) {
    newErrors.lokasi = "Lokasi pengiriman wajib diisi";
    isValid = false;
  }
  
  if (!form.waktu) {
    newErrors.waktu = "Waktu wajib diisi";
    isValid = false;
  }

  return { isValid, errors: newErrors };
};
