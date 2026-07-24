<?php

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// Determine if the application is in maintenance mode...
if (file_exists($maintenance = __DIR__.'/storage/framework/maintenance.php')) {
    require $maintenance;
}

// Register the Composer autoloader...
require __DIR__.'/vendor/autoload.php';

// composer.json ships as composer.json.dist so Hostinger's Git deploy skips its
// (always-failing) composer build step. Laravel's getNamespace() still needs a
// real composer.json, so materialize it here on first request.
if (! is_file(__DIR__.'/composer.json') && is_file(__DIR__.'/composer.json.dist')) {
    @copy(__DIR__.'/composer.json.dist', __DIR__.'/composer.json');
}

// Bootstrap Laravel and handle the request...
/** @var Application $app */
$app = require_once __DIR__.'/bootstrap/app.php';

// This app is deployed on Hostinger with its "public" assets at the web root
// (public_html) rather than in a ./public subfolder, so the public path IS this
// directory. Keeps asset() URLs and public_path() uploads resolving correctly.
$app->usePublicPath(__DIR__);

// Prefer an .env stored one level ABOVE the web root. Hostinger's Git deploy
// replaces public_html on every deploy (wiping any .env inside it), but the
// parent domain folder is left untouched — so a .env there persists. Falls back
// to public_html/.env when the parent copy isn't present.
if (is_file(dirname(__DIR__).'/.env')) {
    $app->useEnvironmentPath(dirname(__DIR__));
}

$app->handleRequest(Request::capture());
