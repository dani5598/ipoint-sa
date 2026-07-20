<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AdminCategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $categories = Category::orderBy('nav_order', 'asc')->get();
        return Inertia::render('Admin/Categories/Index', [
            'categories' => $categories
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:100',
            'description' => 'nullable|string',
            'image_path' => 'nullable|string',
            'image_file' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
            'nav_order' => 'integer|min:0'
        ]);

        $imagePath = $request->input('image_path');

        if ($request->hasFile('image_file')) {
            $file = $request->file('image_file');
            $filename = time() . '_' . Str::slug($request->input('name')) . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('uploads/categories'), $filename);
            $imagePath = '/uploads/categories/' . $filename;
        }

        $navOrder = intval($request->input('nav_order', 0));

        // Adjust other categories' nav_order dynamically: increment orders equal to or greater than the chosen one
        Category::where('nav_order', '>=', $navOrder)->increment('nav_order');

        Category::create([
            'name' => $request->input('name'),
            'slug' => Str::slug($request->input('name')),
            'description' => $request->input('description'),
            'image_path' => $imagePath ?: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=600&q=80',
            'nav_order' => $navOrder
        ]);

        return redirect()->route('admin.categories.index')->with('success', 'Category created successfully.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $category = Category::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:100',
            'description' => 'nullable|string',
            'image_path' => 'nullable|string',
            'image_file' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
            'nav_order' => 'integer|min:0'
        ]);

        $imagePath = $request->input('image_path');

        if ($request->hasFile('image_file')) {
            $file = $request->file('image_file');
            $filename = time() . '_' . Str::slug($request->input('name')) . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('uploads/categories'), $filename);
            $imagePath = '/uploads/categories/' . $filename;
        }

        $newNavOrder = intval($request->input('nav_order', 0));
        $oldNavOrder = $category->nav_order;

        if ($newNavOrder !== $oldNavOrder) {
            // Adjust orders sequentially between old and new orders
            if ($newNavOrder > $oldNavOrder) {
                Category::where('id', '!=', $category->id)
                    ->whereBetween('nav_order', [$oldNavOrder + 1, $newNavOrder])
                    ->decrement('nav_order');
            } else {
                Category::where('id', '!=', $category->id)
                    ->whereBetween('nav_order', [$newNavOrder, $oldNavOrder - 1])
                    ->increment('nav_order');
            }
        }

        $category->update([
            'name' => $request->input('name'),
            'slug' => Str::slug($request->input('name')),
            'description' => $request->input('description'),
            'image_path' => $imagePath ?: $category->image_path,
            'nav_order' => $newNavOrder
        ]);

        return redirect()->route('admin.categories.index')->with('success', 'Category updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $category = Category::findOrFail($id);
        
        // Prevent deletion of categories with products
        if ($category->products()->count() > 0) {
            return redirect()->route('admin.categories.index')->with('error', 'Cannot delete category that contains products.');
        }

        $category->delete();

        return redirect()->route('admin.categories.index')->with('success', 'Category deleted successfully.');
    }
}
