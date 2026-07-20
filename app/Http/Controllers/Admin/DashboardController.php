<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display the admin dashboard.
     */
    public function index()
    {
        $totalSales = (float) Order::whereIn('status', ['paid', 'shipped'])->sum('total_amount');
        $ordersCount = Order::count();
        $productsCount = Product::count();
        $categoriesCount = Category::count();

        $recentOrders = Order::orderBy('created_at', 'desc')
            ->take(6)
            ->get();

        // Monthly sales data for a simple chart (database agnostic)
        $monthlySalesData = Order::whereIn('status', ['paid', 'shipped'])
            ->orderBy('created_at', 'asc')
            ->get();
            
        $monthlySales = $monthlySalesData->groupBy(function($date) {
            return $date->created_at->format('Y-m');
        })->map(function($item, $key) {
            return [
                'month' => $key,
                'sales' => (float)$item->sum('total_amount'),
                'count' => $item->count()
            ];
        })->values();

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'total_sales' => $totalSales,
                'orders_count' => $ordersCount,
                'products_count' => $productsCount,
                'categories_count' => $categoriesCount
            ],
            'recentOrders' => $recentOrders,
            'monthlySales' => $monthlySales
        ]);
    }
}
