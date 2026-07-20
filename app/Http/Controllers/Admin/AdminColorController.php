<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Color;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminColorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $colors = Color::orderBy('name', 'asc')->get();
        return Inertia::render('Admin/Colors/Index', [
            'colors' => $colors
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:50|unique:colors,name',
            'hex_code' => 'required|string|max:10'
        ]);

        Color::create([
            'name' => $request->input('name'),
            'hex_code' => $request->input('hex_code')
        ]);

        return redirect()->route('admin.colors.index')->with('success', 'Color created successfully.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $color = Color::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:50|unique:colors,name,' . $color->id,
            'hex_code' => 'required|string|max:10'
        ]);

        $color->update([
            'name' => $request->input('name'),
            'hex_code' => $request->input('hex_code')
        ]);

        return redirect()->route('admin.colors.index')->with('success', 'Color updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $color = Color::findOrFail($id);

        // Prevent deletion if utilized by variants
        if ($color->variants()->count() > 0) {
            return redirect()->route('admin.colors.index')->with('error', 'Cannot delete color that is linked to active product variants.');
        }

        $color->delete();

        return redirect()->route('admin.colors.index')->with('success', 'Color deleted successfully.');
    }
}
