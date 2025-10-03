<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Events\TaskCreated;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function index()
    { {
            $tasks = Task::with(['project', 'user'])->get();
            return response()->json($tasks);
        }
        $user = auth()->user();

        if ($user->hasRole('admin')) {
            return Task::all();
        }

        if ($user->hasRole('manager')) {
            // tasks in projects they own or tasks assigned to them
            return Task::whereHas('project', fn($q) => $q->where('user_id', $user->id))
                ->orWhere('user_id', $user->id)
                ->get();
        }

        // regular user: only tasks assigned to them
        return Task::where('user_id', $user->id)->get();
    }


    public function store(Request $request)
    {
        $this->authorize('create', Task::class);

        $data = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'status'      => 'nullable|in:pending,in_progress,completed',
            'project_id'  => 'required|exists:projects,id',
            'user_id'     => 'required|exists:users,id',
        ]);

        $task = Task::create($data);

        event(new TaskCreated($task));

        return response()->json($task, 201);
    }

    public function show(Task $task)
    {
        $this->authorize('view', $task);
        return $task;
    }

    public function update(Request $request, Task $task)
    {
        $this->authorize('update', $task);

        $data = $request->validate([
            'title'       => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'status'      => 'nullable|in:pending,in_progress,completed',
            'user_id'     => 'sometimes|required|exists:users,id',
        ]);

        $task->update($data);
        return $task;
    }

    public function destroy(Task $task)
    {
        $this->authorize('delete', $task);
        $task->delete();
        return response()->noContent();
    }
}
