<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NewsResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'excerpt' => $this->excerpt,
            'body' => $this->body,
            'category' => $this->category,
            // Membuat URL gambar otomatis ke folder storage
            'thumbnail' => $this->thumbnail ? asset('storage/'.$this->thumbnail) : null,
            'published_at' => $this->published_at,
            'created_at' => $this->created_at->format('Y-m-d'),
        ];
    }
}
