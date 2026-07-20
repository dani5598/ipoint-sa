<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

use App\Models\Category;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            // Guard against the categories table not existing yet (e.g. before the
            // one-time /__setup migration runs) so the app can still bootstrap.
            'categories' => rescue(fn () => Category::orderBy('nav_order')->get(), collect(), false),
            'cart' => session()->get('cart', []),
            'compareCount' => count($request->session()->get('compare', [])),
            'hereApiKey' => env('HERE_API_KEY', ''),
            'flash' => [
                'success' => session()->get('success'),
                'error' => session()->get('error'),
            ]
        ];
    }
}
