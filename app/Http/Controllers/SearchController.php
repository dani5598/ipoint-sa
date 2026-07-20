<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    /**
     * Search products for search overlay suggestions.
     */
    public function search(Request $request)
    {
        $q = $request->input('q', '');
        
        if (strlen($q) < 2) {
            return response()->json([]);
        }

        $products = Product::where('name', 'like', "%{$q}%")
            ->orWhere('description', 'like', "%{$q}%")
            ->with(['category', 'variants.color', 'variants.size'])
            ->take(6)
            ->get();

        return response()->json($products);
    }
}
