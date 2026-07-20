<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Schema;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);
        Schema::defaultStringLength(191);

        // Force HTTPS scheme when accessed via proxy/tunnel networks like ngrok
        if (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https') {
            \Illuminate\Support\Facades\URL::forceScheme('https');
        }
        
        // Trust ngrok proxy headers natively
        if (isset($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            \Illuminate\Support\Facades\URL::forceRootUrl(
                ($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? 'https') . '://' . $_SERVER['HTTP_HOST']
            );
        }
    }
}
