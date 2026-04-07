# Product Requirements Document (PRD): Sistem Informasi Perpustakaan Terintegrasi

## 1. Executive Summary

* **Problem Statement**: Proses administrasi perpustakaan (bebas pustaka, cek Turnitin, penyerahan skripsi) saat ini bersifat manual, terfragmentasi (WA/Email/Fisik), dan menyebabkan *bottleneck* serta kesulitan monitoring data kelulusan per angkatan/prodi.
* **Proposed Solution**: Platform web berbasis **Laravel 12 & React (Inertia.js)** yang mengotomatisasi seluruh alur kerja administrasi menjadi satu pintu, mulai dari pengajuan mandiri oleh mahasiswa hingga verifikasi satu klik oleh admin.
* **Success Criteria**:
    * **Mean Time to Completion**: Penurunan waktu proses administrasi sebesar 50-70%.
    * **Administrative Task Automation Rate**: Minimal 80% tugas administratif terverifikasi secara sistem.
    * **Data Accuracy**: 100% sinkronisasi antara jumlah mahasiswa lulus dengan data repositori digital.

---

## 2. User Experience & Functionality

### User Personas
* **Mahasiswa**: Individu yang membutuhkan kepastian status bebas pustaka untuk syarat kelulusan secara mandiri, transparan, dan cepat.
* **Admin Perpustakaan**: Pengelola yang bertanggung jawab memvalidasi pengajuan dengan cepat, mengelola database skripsi, dan membutuhkan laporan statistik real-time.

### User Stories & Acceptance Criteria (AC)

| User Story | Acceptance Criteria (AC) |
| :--- | :--- |
| **Sebagai Mahasiswa**, saya ingin mengunggah file skripsi dan dokumen Turnitin secara mandiri. | • Tersedia form upload dengan validasi tipe file (PDF).<br>• Ukuran file maksimal sesuai konfigurasi server (misal 20MB). |
| **Sebagai Mahasiswa**, saya ingin melihat status proses pengajuan saya secara real-time. | • Indikator visual status (Pending, In Review, Approved, Rejected).<br>• Notifikasi alasan penolakan jika status 'Rejected'. |
| **Sebagai Mahasiswa**, saya ingin mengunduh sertifikat bebas pustaka digital. | • Tombol unduh otomatis aktif hanya setelah status 'Approved'.<br>• Sertifikat mengandung QR Code unik untuk validasi keaslian. |
| **Sebagai Admin**, saya ingin melihat dashboard ringkasan pengajuan per angkatan/prodi. | • Grafik statistik pengajuan masuk vs selesai.<br>• Filter data berdasarkan Tahun Angkatan, Fakultas, dan Prodi. |
| **Sebagai Admin**, saya ingin melakukan verifikasi pengajuan dengan satu klik. | • Tombol 'Approve' dan 'Reject' di setiap baris data.<br>• Modal popup untuk mengisi alasan jika memilih 'Reject'. |

### Non-Goals
* Tidak membangun fitur integrasi API ke pihak ketiga (Turnitin API atau SIADAK luar) untuk menjaga kerahasiaan data internal kampus.
* Tidak membangun fitur chat real-time (komunikasi dilakukan via kolom komentar/alasan status).

---

## 3. Technical Specifications

### Architecture Overview
* **Framework**: Laravel 12 (Backend) + React (Frontend).
* **Bridge**: Inertia.js (menjamin pengalaman SPA tanpa kompleksitas API terpisah).
* **Database**: MySQL dengan skema relasional yang dioptimalkan (Indexing pada kolom `angkatan_id`, `prodi_id`, dan `status`).
* **File Storage**: Local Storage (Private Directory) untuk menyimpan file repositori skripsi.

### Integration Points
* **Import Data Kolektif**: Fitur unggah file CSV/Excel oleh Admin untuk sinkronisasi data profil mahasiswa angkatan baru secara manual (sebagai pengganti API eksternal).
* **Digital Signing**: Library internal untuk generate PDF Sertifikat Bebas Pustaka secara otomatis.

### Security & Privacy
* **Role-Based Access Control (RBAC)**: Pemisahan akses ketat antara Mahasiswa dan Admin menggunakan Middleware Laravel.
* **Data Privacy**: Enkripsi file pada level direktori dan pembatasan akses file repositori hanya untuk user dengan role Admin.

---

## 4. Risks & Roadmap

### Phased Rollout
1.  **Fase 1 (MVP)**: Portal submission mahasiswa, verifikasi dasar oleh admin, dan unduh sertifikat PDF.
2.  **Fase 2 (v1.1)**: Dashboard statistik lengkap dengan filter angkatan/prodi dan fitur Import Data Kolektif.
3.  **Fase 3 (v2.0)**: Fitur pengarsipan otomatis (*auto-archive*) repositori ke struktur folder tahunan.

### Technical Risks & Mitigasi
* **Storage Limit**: Penumpukan file skripsi PDF dalam jumlah besar dapat membebani disk space server.
    * *Mitigasi*: Implementasi kompresi file atau monitoring sisa kapasitas disk secara rutin.
* **Data Integrity**: Potensi kesalahan input saat Import Data Kolektif manual.
    * *Mitigasi*: Fitur "Preview & Validate" sebelum data benar-benar disimpan ke database MySQL.