@component('mail::message')
# Hasil Pengecekan Turnitin

Halo **{{ $submission->full_name }}**,

Dokumen Anda dengan judul **"{{ $submission->title }}"** telah selesai diproses oleh admin.

**Detail Hasil:**
- **Similarity:** {{ $submission->similarity_percentage }}%
- **Status:** {{ strtoupper($submission->status) }}
- **Catatan Admin:** {{ $submission->admin_notes ?? '-' }}

@if($submission->status == 'completed')
Silakan cek lampiran email ini untuk melihat file hasil pengecekan.
@else
Mohon perbaiki dokumen Anda sesuai catatan di atas dan ajukan kembali.
@endif

Terima kasih,<br>
Tim Perpustakaan / Admin Turnitin
@endcomponent