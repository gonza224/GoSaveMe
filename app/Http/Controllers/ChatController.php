<?php

namespace App\Http\Controllers;

use App\Models\Submission;
use App\Models\SubmissionItem;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ChatController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Chat/Index');
    }

    public function store(Request $request)
    {
        logger()->info('ChatController@store called', [
            'all_request_input' => $request->all(),
            'all_files' => $request->allFiles(),
        ]);

        $validated = $request->validate([
            'items'                    => 'required|array',
            'items.*.question'         => 'nullable|string',
            'items.*.answer_type'      => 'required|string|in:text,file',
            'items.*.answer_text'      => 'nullable|string',
            'items.*.note'             => 'nullable|string',
            'items.*.files'            => 'nullable|array',
            'items.*.files.*'          => 'nullable|file|max:5120',
        ]);

        $submission = Submission::create();

        $debugInfo = [];

        foreach ($validated['items'] as $index => $itemData) {
            logger()->info("Processing item at index $index", ['itemData' => $itemData]);

            $answerFiles = null;
            
            if ($itemData['answer_type'] === 'file') {
                $filePaths = [];
                if ($request->hasFile("items.$index.files")) {
                    $files = $request->file("items.$index.files");
                    foreach ($files as $file) {
                        logger()->info("Found file at items.$index.files", [
                            'originalName' => $file->getClientOriginalName(),
                            'mimeType'     => $file->getClientMimeType(),
                            'size'         => $file->getSize(),
                        ]);
                        $path = $file->store('uploads', 'public');
                        $filePaths[] = "/storage/" . $path;
                    }
                }
                if (count($filePaths) > 0) {
                    $answerFiles = json_encode($filePaths);
                    $debugInfo[] = [
                        'index' => $index,
                        'file_stored_paths' => $filePaths,
                    ];
                }
            }

            $submission->items()->create([
                'question'    => $itemData['question'] ?? null,
                'answer_type' => $itemData['answer_type'],
                'answer_text' => $itemData['answer_text'] ?? null,
                'answer_file' => $answerFiles,
                'note'        => $itemData['note'] ?? null,
            ]);
        }

        return redirect()->route('chat')
        ->with('success', 'Your submission has been saved.');
    }
}
