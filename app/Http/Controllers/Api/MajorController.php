<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Major;

class MajorController extends Controller
{
    public function getMajors($facultyId)
    {
        $majors = Major::where('faculty_id', $facultyId)
            ->orderBy('id')
            ->get(['id', 'name']);

        return response()->json($majors);
    }
}
