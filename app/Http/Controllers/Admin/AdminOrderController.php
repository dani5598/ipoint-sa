<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminOrderController extends Controller
{
    /**
     * Display a listing of orders.
     */
    public function index()
    {
        $orders = Order::orderBy('created_at', 'desc')->get();
        return Inertia::render('Admin/Orders/Index', [
            'orders' => $orders
        ]);
    }

    /**
     * Display order details.
     */
    public function show($id)
    {
        $order = Order::with(['items.variant.product', 'items.variant.color', 'items.variant.size', 'user'])->findOrFail($id);
        
        return Inertia::render('Admin/Orders/Show', [
            'order' => $order
        ]);
    }

    /**
     * Update order status.
     */
    public function update(Request $request, $id)
    {
        $order = Order::findOrFail($id);

        $request->validate([
            'status' => 'required|in:pending,paid,shipped,cancelled'
        ]);

        $order->update([
            'status' => $request->input('status')
        ]);

        return redirect()->route('admin.orders.index')->with('success', 'Order status updated successfully.');
    }
}
