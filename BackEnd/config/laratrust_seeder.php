<?php

return [
    /**
     * Control if the seeder should create a user per role while seeding the data.
     */
    'create_users' => false,

    /**
     * Control if all the laratrust tables should be truncated before running the seeder.
     */
    'truncate_tables' => true,

    'roles_structure' => [
        'admin' => [
            'users' => 'c,r,u,d',
            'projects' => 'c,r,u,d',
            "tasks" => "c,r,u,d",
            'profile' => 'r,u',
        ],
        'manager' => [
            "projects" => "c,r,u,d",
            "tasks" => "c,r,u,d",
            'profile' => 'r,u',
        ],
        'user' => [
            "tasks" => "c,r,u,d",
            'profile' => 'r,u',
        ],
    ],

    'permissions_map' => [
        'c' => 'create',
        'r' => 'read',
        'u' => 'update',
        'd' => 'delete',
    ],
];
