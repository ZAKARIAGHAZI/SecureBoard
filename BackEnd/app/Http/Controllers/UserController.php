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
            $users = User::with('roles')->get();
        } elseif ($user->hasRole('manager')) {
            // Manager sees users who are in projects they created/own
            $users = User::with('roles')
                ->whereHas('projects', function ($q) use ($user) {
                    $q->where('user_id', $user->id);
                })->get();
        } else {
            // Normal user sees only themselves
            $users = User::with('roles')->where('id', $user->id)->get();
        }

        // Add a simplified role for frontend
        $users->transform(function ($u) {
            $u->role = $u->roles->pluck('name')->first() ?? null;
            return $u;
        });

        return response()->json($users, 200);
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

        // Assigner le rôle
        $user->syncRoles([$validated['role']]);

        // Charger les rôles et ajouter "role"
        $user->load('roles');
        $user->role = $user->roles->pluck('name')->first() ?? null;

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
            $user->syncRoles([$validated['role']]);
        }

        $user->load('roles');
        $user->role = $user->roles->pluck('name')->first() ?? null;

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
