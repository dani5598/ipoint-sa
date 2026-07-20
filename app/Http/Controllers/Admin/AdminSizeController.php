<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Size;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminSizeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $sizes = Size::orderBy('name', 'asc')->get();
        return Inertia::render('Admin/Sizes/Index', [
            'sizes' => $sizes
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:50|unique:sizes,name',
            'reference_value' => 'nullable|string|max:100'
        ]);

        Size::create([
            'name' => $request->input('name'),
            'reference_value' => $request->input('reference_value')
        ]);

        return redirect()->route('admin.sizes.index')->with('success', 'Size created successfully.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $size = Size::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:50|unique:sizes,name,' . $size->id,
            'reference_value' => 'nullable|string|max:100'
        ]);

        $size->update([
            'name' => $request->input('name'),
            'reference_value' => $request->input('reference_value')
        ]);

        return redirect()->route('admin.sizes.index')->with('success', 'Size updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $size = Size::findOrFail($id);

        // Prevent deletion if utilized by variants
        if ($size->variants()->count() > 0) {
            return redirect()->route('admin.sizes.index')->with('error', 'Cannot delete size that is linked to active product variants.');
        }

        $size->delete();

        return redirect()->route('admin.sizes.index')->with('success', 'Size deleted successfully.');
    }
}
