export interface Order {
  id: string;
  tanggalPengajuan: string;
  tanggalPengiriman: string;
  kegiatan: string;
  tamu: string;
  jumlahTamu: number;
  bagian: string;
  pengaju: string;
  menu: { label: string; price?: string }[];
  status: string;
  approval?: string;
  lokasi?: string;
  waktu?: string;
  keterangan?: string;
}

export interface FormData {
  kegiatan: string;
  tanggalPermintaan: string;
  tanggalPengiriman: string;
  untukBagian: string;
  yangMengajukan: string;
  approval: string;
  tamu: string;
  jumlahTamu: number;
  lokasi: string;
  waktu: string;
  keterangan: string;
}

export interface MenuItem {
  id: number;
  jenis: string;
  satuan: string;
  qty: number;
}

export interface FormErrors {
  kegiatan: string;
  tanggalPermintaan: string;
  tanggalPengiriman: string;
  untukBagian: string;
  yangMengajukan: string;
  approval: string;
  tamu: string;
  jumlahTamu: string;
  lokasi: string;
  waktu: string;
}

export type ToastType = "success" | "error" | "info";

export type GuestType = "PERTA" | "Regular" | "Standar" | "VIP" | "VVIP";
export type TimePeriod = "Pagi" | "Siang" | "Sore" | "Malam";
