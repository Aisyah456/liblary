<!DOCTYPE html>
<html>
<head>
    <title>Update Status Bebas Pustaka</title>
</head>
<body style="font-family: sans-serif; line-height: 1.6; color: #333;">
    <h2>Halo, {{ $libraryFree->full_name }}</h2>
    <p>Pemberitahuan mengenai pengajuan Bebas Pustaka Anda dengan NIM: <strong>{{ $libraryFree->nim }}</strong>.</p>

    <div style="padding: 15px; border: 1px solid #ddd; border-radius: 5px; background-color: #f9f9f9;">
        <p>Status Saat Ini: <strong style="text-transform: uppercase;">{{ $libraryFree->status }}</strong></p>
        
        @if($libraryFree->turnitin_similarity_score)
            <p>Skor Turnitin: {{ $libraryFree->turnitin_similarity_score }}%</p>
        @endif

        @if($libraryFree->admin_notes)
            <p><strong>Catatan Admin:</strong><br>
            {{ $libraryFree->admin_notes }}</p>
        @endif
    </div>

    <p>Jika status Anda <strong>approved</strong>, silakan unduh sertifikat di dashboard mahasiswa. Jika <strong>rejected</strong>, harap perbaiki dokumen sesuai catatan di atas.</p>
    
    <p>Terima kasih,<br>Admin Perpustakaan</p>
</body>
</html>