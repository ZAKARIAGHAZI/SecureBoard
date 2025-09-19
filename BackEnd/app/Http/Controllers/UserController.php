<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /** GET /users : liste des utilisateurs selon le rôle */
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->hasRole('admin')) {
            // Admin sees all users
            return response()->json(User::all(), 200);
        } elseif ($user->hasRole('manager')) {
            // Manager sees users in projects they manage
            $projectIds = $user->managedProjects()->pluck('id'); // assumes managedProjects() relation exists
            $users = User::whereHas('projects', function ($q) use ($projectIds) {
                $q->whereIn('projects.id', $projectIds);
            })->get();

            return response()->json($users, 200);
        } else {
            // Normal user sees only themselves
            return response()->json([$user], 200);
        }
    }

    /** POST /users : créer un utilisateur */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role'     => 'required|string|in:admin,manager,user',
        ]);

        $user = User::create([
            'name'     => $validated['name'],
            'email'    => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        // Assign role via Laratrust
        $user->attachRole($validated['role']);

        return response()->json($user, 201);
    }

    /** PUT /users/{id} : modifier un utilisateur */
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name'     => 'sometimes|required|string|max:255',
            'email'    => 'sometimes|required|string|email|max:255|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:8',
            'role'     => 'sometimes|required|string|in:admin,manager,user',
        ]);

        if (isset($validated['name'])) $user->name = $validated['name'];
        if (isset($validated['email'])) $user->email = $validated['email'];
        if (!empty($validated['password'])) $user->password = Hash::make($validated['password']);
        $user->save();

        if (isset($validated['role'])) {
            $user->detachRoles($user->roles); // remove old roles
            $user->attachRole($validated['role']);
        }

        return response()->json($user, 200);
    }

    /** DELETE /users/{id} : supprimer un utilisateur */
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json([
            'message' => 'Utilisateur supprimé avec succès.'
        ], 200);
    }
}
