<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;
use App\Models\Submission;

class SubmissionsController extends Controller
{
    public function index(Submission $submission): Response
    {
        $submission->load('items');

        return Inertia::render('Submissions/Index', [
            'submission' => $submission,
        ]);
    }
}
