<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ProductReview;
use Illuminate\Http\Request;
use Inertia\Inertia;

/**
 * Moderation queue for customer reviews (Redesign Guide §7.3).
 * Reviews are held as pending until approved, and never render on the store
 * front until an admin approves them here.
 */
class AdminReviewController extends Controller
{
    public function index(Request $request)
    {
        $filter = $request->input('filter', 'pending'); // pending | approved | all

        $query = ProductReview::with('product:id,name,slug,image_path')
            ->orderBy('created_at', 'desc');

        if ($filter === 'pending') {
            $query->where('is_approved', false);
        } elseif ($filter === 'approved') {
            $query->where('is_approved', true);
        }

        return Inertia::render('Admin/Reviews/Index', [
            'reviews' => $query->get(),
            'filter' => $filter,
            'counts' => [
                'pending' => ProductReview::where('is_approved', false)->count(),
                'approved' => ProductReview::where('is_approved', true)->count(),
                'all' => ProductReview::count(),
            ],
        ]);
    }

    public function approve(string $id)
    {
        ProductReview::findOrFail($id)->update(['is_approved' => true]);

        return redirect()->back()->with('success', 'Review approved and published.');
    }

    public function reject(string $id)
    {
        // "Reject" hides the review again without deleting it.
        ProductReview::findOrFail($id)->update(['is_approved' => false]);

        return redirect()->back()->with('success', 'Review unpublished.');
    }

    public function destroy(string $id)
    {
        ProductReview::findOrFail($id)->delete();

        return redirect()->back()->with('success', 'Review deleted.');
    }
}
