<?php

namespace App\Http\Controllers\Auth;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Validation\Rules;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\JsonResponse;

class RegisteredUserController extends Controller
{
    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:'.User::class],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $user->addRole('user');

        event(new Registered($user));

        Auth::login($user);

        $token = $user->createToken('api_token')->plainTextToken;
        return response()->json([
            'message' => 'User registered successfully.',
            'user' => $user,
            'token' => $token
        ], 201);


        // zakaria token 1|ETo8PbrU8P4CYPKYZw8qGrayUuaJpjCR7b4360mm11d6b1d1

        // login token 2|FjTvpEgRPPkhstJPlCyFYn0yanyj965m4zmJEeSs4df64e20
    }
}
