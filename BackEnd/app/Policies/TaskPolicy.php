<?php

namespace App\Policies;

use App\Models\Task;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class TaskPolicy
{
    public function view(User $user, Task $task)
    {
        if ($user->hasRole('admin')) return true;

        if ($user->hasRole('manager')) {
            return $task->project->user_id === $user->id
                || $task->user_id === $user->id;
        }

        return $task->user_id === $user->id;
    }

    public function create(User $user)
    {
        return $user->hasRole('admin') || $user->hasRole('manager');
    }

    public function update(User $user, Task $task)
    {
        if ($user->hasRole('admin')) return true;

        if ($user->hasRole('manager')) {
            return $task->project->user_id === $user->id
                || $task->user_id === $user->id;
        }

        return $task->user_id === $user->id;
    }

    public function delete(User $user, Task $task)
    {
        return $this->update($user, $task);
    }
}
