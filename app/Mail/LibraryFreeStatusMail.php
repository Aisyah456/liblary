<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Models\LibraryFree;

class LibraryFreeStatusMail extends Mailable
{
    use Queueable, SerializesModels;


    public $libraryFree;

    public function __construct(LibraryFree $libraryFree)
    {
        $this->libraryFree = $libraryFree;
    }

    public function build()
    {
        return $this->subject('Update Status Pengajuan Bebas Pustaka - ' . $this->libraryFree->full_name)
            ->view('emails.library_free_status');
    }
    

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Library Free Status Mail',
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
