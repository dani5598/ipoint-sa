<?php

namespace App\Http\Controllers;

use App\Models\ProductVariant;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CartController extends Controller
{
    /**
     * Display the cart page.
     */
    public function index()
    {
        return Inertia::render('Storefront/Cart');
    }

    /**
     * Add a product variant to the session cart.
     */
    public function add(Request $request)
    {
        $request->validate([
            'product_variant_id' => 'required|exists:product_variants,id',
            'quantity' => 'integer|min:1'
        ]);

        $variantId = $request->input('product_variant_id');
        $qty = $request->input('quantity', 1);

        $variant = ProductVariant::with(['product', 'color', 'size'])->findOrFail($variantId);

        // Check stock
        if ($variant->stock < $qty) {
            return back()->with('error', "Only {$variant->stock} units left in stock.");
        }

        $cart = session()->get('cart', []);

        // Compute price: base price + modifier
        $finalPrice = $variant->product->base_price + $variant->price_modifier;

        // Create display name
        $displayName = $variant->product->name;
        $options = [];
        if ($variant->color) $options[] = $variant->color->name;
        if ($variant->size) $options[] = $variant->size->name;
        if (!empty($options)) {
            $displayName .= ' (' . implode(' / ', $options) . ')';
        }

        // If item already exists in cart, update quantity
        if (isset($cart[$variantId])) {
            $newQty = $cart[$variantId]['quantity'] + $qty;
            if ($variant->stock < $newQty) {
                return back()->with('error', "Cannot add more. Only {$variant->stock} units in stock.");
            }
            $cart[$variantId]['quantity'] = $newQty;
        } else {
            // Add new item to cart
            $cart[$variantId] = [
                'id' => $variant->id,
                'product_id' => $variant->product_id,
                'name' => $displayName,
                'slug' => $variant->product->slug,
                'sku' => $variant->sku,
                'image_path' => $variant->product->image_path,
                'color' => $variant->color ? $variant->color->name : null,
                'color_hex' => $variant->color ? $variant->color->hex_code : null,
                'size' => $variant->size ? $variant->size->name : null,
                'price' => (float)$finalPrice,
                'quantity' => $qty,
                'stock' => $variant->stock
            ];
        }

        session()->put('cart', $cart);

        return back()->with('success', "{$variant->product->name} added to cart.");
    }

    /**
     * Update cart item quantity.
     */
    public function update(Request $request)
    {
        $request->validate([
            'product_variant_id' => 'required',
            'quantity' => 'required|integer|min:0'
        ]);

        $variantId = $request->input('product_variant_id');
        $qty = $request->input('quantity');

        $cart = session()->get('cart', []);

        if (!isset($cart[$variantId])) {
            return back()->with('error', 'Item not found in cart.');
        }

        if ($qty <= 0) {
            unset($cart[$variantId]);
            session()->put('cart', $cart);
            return back()->with('success', 'Item removed from cart.');
        }

        // Check stock
        $variant = ProductVariant::find($variantId);
        if ($variant && $variant->stock < $qty) {
            return back()->with('error', "Only {$variant->stock} units left in stock.");
        }

        $cart[$variantId]['quantity'] = $qty;
        session()->put('cart', $cart);

        return back()->with('success', 'Cart updated successfully.');
    }

    /**
     * Remove an item from the cart.
     */
    public function remove(Request $request)
    {
        $request->validate([
            'product_variant_id' => 'required'
        ]);

        $variantId = $request->input('product_variant_id');
        $cart = session()->get('cart', []);

        if (isset($cart[$variantId])) {
            unset($cart[$variantId]);
            session()->put('cart', $cart);
        }

        return back()->with('success', 'Item removed from cart.');
    }

    /**
     * Clear all items from the cart.
     */
    public function clear()
    {
        session()->forget('cart');
        return back()->with('success', 'Cart cleared.');
    }
}
