<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AttributeGroup;
use App\Models\AttributeValue;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AdminAttributeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $attributeGroups = AttributeGroup::withCount('values')
            ->orderBy('sort_order', 'asc')
            ->get();

        return Inertia::render('Admin/Attributes/Index', [
            'attributeGroups' => $attributeGroups
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/Attributes/Form', [
            'isEdit' => false,
            'attribute' => null
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:100',
            'sort_order' => 'nullable|integer',
            'is_active' => 'boolean',
            'values' => 'required|array|min:1',
            'values.*.value' => 'required|string|max:100',
            'values.*.sort_order' => 'nullable|integer',
        ]);

        $group = AttributeGroup::create([
            'name' => $request->input('name'),
            'slug' => Str::slug($request->input('name')),
            'sort_order' => $request->input('sort_order', 0),
            'is_active' => $request->input('is_active', true),
        ]);

        foreach ($request->input('values') as $val) {
            AttributeValue::create([
                'attribute_group_id' => $group->id,
                'value' => $val['value'],
                'slug' => Str::slug($val['value']),
                'sort_order' => $val['sort_order'] ?? 0,
            ]);
        }

        return redirect()->route('admin.attributes.index')->with('success', 'Attribute group created successfully.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $attribute = AttributeGroup::with('values')->findOrFail($id);

        return Inertia::render('Admin/Attributes/Form', [
            'attribute' => $attribute,
            'isEdit' => true
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $group = AttributeGroup::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:100',
            'sort_order' => 'nullable|integer',
            'is_active' => 'boolean',
            'values' => 'required|array|min:1',
            'values.*.value' => 'required|string|max:100',
            'values.*.sort_order' => 'nullable|integer',
        ]);

        $group->update([
            'name' => $request->input('name'),
            'slug' => Str::slug($request->input('name')),
            'sort_order' => $request->input('sort_order', 0),
            'is_active' => $request->input('is_active', true),
        ]);

        // Sync values: delete removed, update existing, add new
        $existingValueIds = $group->values()->pluck('id')->toArray();
        $incomingValueIds = [];

        foreach ($request->input('values') as $val) {
            if (!empty($val['id']) && in_array($val['id'], $existingValueIds)) {
                // Update existing value
                AttributeValue::where('id', $val['id'])->update([
                    'value' => $val['value'],
                    'slug' => Str::slug($val['value']),
                    'sort_order' => $val['sort_order'] ?? 0,
                ]);
                $incomingValueIds[] = $val['id'];
            } else {
                // Create new value
                $newVal = AttributeValue::create([
                    'attribute_group_id' => $group->id,
                    'value' => $val['value'],
                    'slug' => Str::slug($val['value']),
                    'sort_order' => $val['sort_order'] ?? 0,
                ]);
                $incomingValueIds[] = $newVal->id;
            }
        }

        // Delete removed values
        $valuesToDelete = array_diff($existingValueIds, $incomingValueIds);
        if (!empty($valuesToDelete)) {
            AttributeValue::whereIn('id', $valuesToDelete)->delete();
        }

        return redirect()->route('admin.attributes.index')->with('success', 'Attribute group updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $group = AttributeGroup::findOrFail($id);
        $group->delete();

        return redirect()->route('admin.attributes.index')->with('success', 'Attribute group deleted successfully.');
    }
}
