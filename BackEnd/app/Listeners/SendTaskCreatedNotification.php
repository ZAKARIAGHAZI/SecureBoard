<?php

namespace App\Listeners;

use App\Events\TaskCreated;
use App\Mail\TaskCreatedMail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;

class SendTaskCreatedNotification
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(TaskCreated $event): void
    {
        $task = $event->task;

        // Just log instead of mailing
        Log::info("✅ TaskCreated event fired", [
            'id' => $task->id,
            'title' => $task->title,
            'user_id' => $task->user_id,
        ]);

        if ($task->user && $task->user->email) {
            Mail::to($task->user->email)->send(new TaskCreatedMail($task));
        }
        
    }
}
