<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Offer;
use Illuminate\Http\Request;
use Inertia\Inertia;

/**
 * Admin CRUD + ordering + enable/disable for the homepage "Latest Offers"
 * carousel (Redesign Guide §4.4). No code deploy required to change offers.
 */
class AdminOfferController extends Controller
{
    public function index()
    {
        $offers = Offer::orderBy('sort_order')->orderBy('id')->get();

        return Inertia::render('Admin/Offers/Index', [
            'offers' => $offers,
        ]);
    }

    public function store(Request $request)
    {
        $data = $this->validated($request);

        Offer::create($data);

        return redirect()->route('admin.offers.index')->with('success', 'Offer created successfully.');
    }

    public function update(Request $request, string $id)
    {
        $offer = Offer::findOrFail($id);

        $offer->update($this->validated($request));

        return redirect()->route('admin.offers.index')->with('success', 'Offer updated successfully.');
    }

    public function destroy(string $id)
    {
        Offer::findOrFail($id)->delete();

        return redirect()->route('admin.offers.index')->with('success', 'Offer deleted successfully.');
    }

    /**
     * Toggle active/inactive without deleting.
     */
    public function toggle(string $id)
    {
        $offer = Offer::findOrFail($id);
        $offer->update(['is_active' => ! $offer->is_active]);

        return redirect()->route('admin.offers.index')->with('success', 'Offer visibility updated.');
    }

    private function validated(Request $request): array
    {
        $validated = $request->validate([
            'title' => 'nullable|string|max:120',
            'image_path' => 'required|string',
            'link_url' => 'nullable|string|max:255',
            'sort_order' => 'nullable|integer|min:0',
            'is_active' => 'boolean',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        $validated['sort_order'] = $validated['sort_order'] ?? 0;
        $validated['is_active'] = $request->boolean('is_active', true);

        return $validated;
    }
}
