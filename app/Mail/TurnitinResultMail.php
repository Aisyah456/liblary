<?php

namespace App\Mail;

use App\Models\TurnitinSubmission;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class TurnitinResultMail extends Mailable
{
    use Queueable, SerializesModels;

    public $submission;
    /**
     * Create a new message instance.
     */
    public function __construct(TurnitinSubmission $submission)
    {
        $this->submission = $submission;
    }

    public function build()
    {
        $mail = $this->subject("Hasil Cek Turnitin - {$this->submission->title}")
            ->markdown('emails.turnitin_result');

        // Cek apakah ada file hasil untuk dilampirkan
        if ($this->submission->result_file_path) {
            $mail->attachFromStorageDisk('private', $this->submission->result_file_path, 'Hasil_Turnitin.pdf');
        }

        return $mail;
    }
    
    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Turnitin Result Mail',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'view.name',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
