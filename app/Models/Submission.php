<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Submission extends Model
{
    use HasFactory;

    protected $fillable = [
    ];

    public function items()
    {
        return $this->hasMany(SubmissionItem::class, 'submission_id');
    }
}
