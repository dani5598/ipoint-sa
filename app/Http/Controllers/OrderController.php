<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\ProductVariant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class OrderController extends Controller
{
    /**
     * Display the checkout page.
     */
    public function checkout()
    {
        $cart = session()->get('cart', []);

        if (empty($cart)) {
            return redirect()->route('cart.index')->with('error', 'Your cart is empty.');
        }

        return Inertia::render('Storefront/Checkout');
    }

    /**
     * Process checkout submission.
     */
    public function store(Request $request)
    {
        $cart = session()->get('cart', []);

        if (empty($cart)) {
            return redirect()->route('cart.index')->with('error', 'Your cart is empty.');
        }

        // Validate customer info & mock payment info
        $rules = [
            'customer_name' => 'required|string|max:100',
            'customer_email' => 'required|email|max:100',
            'customer_phone' => 'nullable|string|max:20',
            'shipping_address' => 'required|string',
            'city' => 'required|string|max:50',
            'postal_code' => 'required|string|max:10',
            'payment_method' => 'nullable|in:cod,card',
        ];

        if ($request->input('payment_method') === 'card') {
            $rules['card_number'] = 'required|string|min:16|max:19';
            $rules['card_expiry'] = 'required|string|regex:/^(0[1-9]|1[0-2])\/?([0-9]{2})$/';
            $rules['card_cvv'] = 'required|string|digits_between:3,4';
        }

        $request->validate($rules, [
            'card_number.min' => 'Please enter a valid 16-digit card number.',
            'card_expiry.regex' => 'Please enter expiry date in MM/YY format.',
            'card_cvv.digits_between' => 'CVV must be 3 or 4 digits.',
        ]);

        try {
            DB::beginTransaction();

            // Calculate total amount
            $totalAmount = 0.00;
            foreach ($cart as $item) {
                $totalAmount += $item['price'] * $item['quantity'];
            }

            // Create Order
            $order = Order::create([
                'user_id' => auth()->id(),
                'customer_name' => $request->input('customer_name'),
                'customer_email' => $request->input('customer_email'),
                'customer_phone' => $request->input('customer_phone'),
                'shipping_address' => $request->input('shipping_address'),
                'city' => $request->input('city'),
                'postal_code' => $request->input('postal_code'),
                'total_amount' => $totalAmount,
                'status' => 'paid', // Paid automatically upon successful mock payment
            ]);

            // Save items and update stock
            foreach ($cart as $item) {
                $variant = ProductVariant::find($item['id']);
                
                if (!$variant) {
                    throw new \Exception("Product variant SKU {$item['sku']} is no longer available.");
                }

                if ($variant->stock < $item['quantity']) {
                    throw new \Exception("Insufficient stock for {$item['name']}. Only {$variant->stock} left.");
                }

                // Decrement stock
                $variant->decrement('stock', $item['quantity']);

                // Create Order Item
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_variant_id' => $variant->id,
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                ]);
            }

            DB::commit();

            // Clear Cart
            session()->forget('cart');

            return redirect()->route('checkout.success', $order->id)->with('success', 'Thank you! Your order has been placed successfully.');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withInput()->with('error', $e->getMessage());
        }
    }

    /**
     * Display order success page.
     */
    public function success($id)
    {
        $order = Order::with(['items.variant.product', 'items.variant.color', 'items.variant.size'])->findOrFail($id);

        return Inertia::render('Storefront/CheckoutSuccess', [
            'order' => $order
        ]);
    }
}
