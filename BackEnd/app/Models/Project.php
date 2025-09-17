<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'description',
        'start_date',
        'end_date',
        'user_id',
    ];

    // Relationship example: a project belongs to a user
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Users assigned to work on the project
    public function assignedUsers()
    {
        return $this->belongsToMany(User::class);
    }
}
