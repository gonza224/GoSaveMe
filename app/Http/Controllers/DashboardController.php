<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;
use App\Models\Submission;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $submissions = Submission::with('items')->paginate(15);
    
        return Inertia::render('Dashboard/Index', [
            'submissions' => $submissions,
        ]);
    }
    
    
    
}
