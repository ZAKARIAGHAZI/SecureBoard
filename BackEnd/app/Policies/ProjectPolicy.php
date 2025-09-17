<?php

namespace App\Policies;

use App\Models\Project;
use App\Models\User;

class ProjectPolicy
{
    // Anyone with view permission (owner or admin) can view
    public function view(User $user, Project $project)
    {
        return $user->id === $project->user_id || $user->hasRole('admin');
    }

    // Only manager or admin can create projects
    public function create(User $user)
    {
        return $user->hasRole('manager') || $user->hasRole('admin');
    }

    // --- Users cannot update projects ---
    public function update(User $user, Project $project)
    {
        // Only admins can update
        return $user->hasRole('admin');
    }

    // --- Users cannot delete projects ---
    public function delete(User $user, Project $project)
    {
        // Only admins can delete
        return $user->hasRole('admin');
    }
}
