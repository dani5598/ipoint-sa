<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

/**
 * Side-by-side product comparison tool (Redesign Guide §4.5).
 *
 * Selections are stored in the session so no login is required. The comparison
 * table reuses the same technical-specifications data shown on product pages
 * (see Product::$technical_specs) to avoid duplicate data entry.
 */
class CompareController extends Controller
{
    private const MAX_ITEMS = 4;
    private const SESSION_KEY = 'compare';

    public function index()
    {
        $ids = session()->get(self::SESSION_KEY, []);

        $products = empty($ids)
            ? collect()
            : Product::whereIn('id', $ids)
                ->with(['category', 'variants.color', 'variants.size'])
                ->get()
                // Preserve the order in which items were added.
                ->sortBy(fn ($p) => array_search($p->id, $ids))
                ->values();

        return Inertia::render('Storefront/Compare', [
            'products' => $products,
        ]);
    }

    public function add(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
        ]);

        $ids = session()->get(self::SESSION_KEY, []);
        $productId = (int) $request->input('product_id');

        if (in_array($productId, $ids)) {
            return redirect()->back()->with('error', 'That product is already in your comparison.');
        }

        if (count($ids) >= self::MAX_ITEMS) {
            return redirect()->back()->with('error', 'You can compare up to ' . self::MAX_ITEMS . ' products at once.');
        }

        $ids[] = $productId;
        session()->put(self::SESSION_KEY, $ids);

        return redirect()->back()->with('success', 'Added to compare.');
    }

    public function remove(Request $request)
    {
        $productId = (int) $request->input('product_id');
        $ids = array_values(array_filter(
            session()->get(self::SESSION_KEY, []),
            fn ($id) => $id !== $productId
        ));

        session()->put(self::SESSION_KEY, $ids);

        return redirect()->back()->with('success', 'Removed from compare.');
    }

    public function clear()
    {
        session()->forget(self::SESSION_KEY);

        return redirect()->back()->with('success', 'Comparison cleared.');
    }
}
