<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\RepairBooking;
use App\Models\RepairLocation;
use Illuminate\Http\Request;
use Inertia\Inertia;

/**
 * Admin management of repair bookings and service locations (Redesign Guide §8.5).
 */
class AdminRepairController extends Controller
{
    public function index(Request $request)
    {
        $status = $request->input('status', 'all');

        $query = RepairBooking::with('location')->orderBy('booking_date', 'desc')->orderBy('created_at', 'desc');

        if ($status !== 'all') {
            $query->where('status', $status);
        }

        return Inertia::render('Admin/Repairs/Index', [
            'bookings' => $query->get(),
            'locations' => RepairLocation::orderBy('name')->get(),
            'status' => $status,
            'statusCounts' => [
                'all' => RepairBooking::count(),
                'pending' => RepairBooking::where('status', 'pending')->count(),
                'confirmed' => RepairBooking::where('status', 'confirmed')->count(),
                'in_progress' => RepairBooking::where('status', 'in_progress')->count(),
                'completed' => RepairBooking::where('status', 'completed')->count(),
                'cancelled' => RepairBooking::where('status', 'cancelled')->count(),
            ],
        ]);
    }

    /**
     * Update booking status and/or assigned technician.
     */
    public function updateBooking(Request $request, string $id)
    {
        $booking = RepairBooking::findOrFail($id);

        $data = $request->validate([
            'status' => 'required|in:pending,confirmed,in_progress,completed,cancelled',
            'technician' => 'nullable|string|max:100',
        ]);

        $booking->update($data);

        return redirect()->back()->with('success', 'Booking updated.');
    }

    public function storeLocation(Request $request)
    {
        $data = $this->validatedLocation($request);
        RepairLocation::create($data);

        return redirect()->back()->with('success', 'Service location added.');
    }

    public function updateLocation(Request $request, string $id)
    {
        $location = RepairLocation::findOrFail($id);
        $location->update($this->validatedLocation($request));

        return redirect()->back()->with('success', 'Service location updated.');
    }

    public function destroyLocation(string $id)
    {
        RepairLocation::findOrFail($id)->delete();

        return redirect()->back()->with('success', 'Service location removed.');
    }

    private function validatedLocation(Request $request): array
    {
        $data = $request->validate([
            'name' => 'required|string|max:120',
            'address' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:100',
            'slot_capacity' => 'nullable|integer|min:1|max:100',
            'is_active' => 'boolean',
        ]);

        $data['slot_capacity'] = $data['slot_capacity'] ?? 8;
        $data['is_active'] = $request->boolean('is_active', true);

        return $data;
    }
}
