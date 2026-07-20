<?php

namespace App\Http\Controllers;

use App\Models\RepairBooking;
use App\Models\RepairLocation;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

/**
 * Apple Product Repair landing page + online booking flow (Redesign Guide §8).
 * Structured after istore.co.za/apple-product-repair without using
 * "Apple Certified" wording (compliance note §8).
 */
class RepairController extends Controller
{
    /**
     * Repair category → supported iPhone model list. Content to be confirmed
     * with the client's actual repair capability; managed here for now.
     */
    private const REPAIR_CATEGORIES = [
        [
            'key' => 'screen',
            'title' => 'Screen repairs',
            'description' => 'LCD and glass fracture repairs using genuine parts.',
            'models' => ['iPhone 11', 'iPhone 12', 'iPhone 13', 'iPhone 14', 'iPhone 14 Pro', 'iPhone 15', 'iPhone 15 Pro', 'iPhone 15 Pro Max'],
        ],
        [
            'key' => 'battery',
            'title' => 'Battery replacements',
            'description' => 'Restore your battery health with a genuine replacement battery.',
            'models' => ['iPhone 11', 'iPhone 12', 'iPhone 13', 'iPhone 14', 'iPhone 15', 'iPhone 15 Plus'],
        ],
        [
            'key' => 'rear_housing',
            'title' => 'Rear housing replacement',
            'description' => 'Rear glass and housing repairs. Limited stock on some models.',
            'models' => ['iPhone 12', 'iPhone 13', 'iPhone 14', 'iPhone 15'],
        ],
    ];

    public function index()
    {
        return Inertia::render('Storefront/Repair', [
            'categories' => self::REPAIR_CATEGORIES,
            'locations' => RepairLocation::where('is_active', true)->orderBy('name')->get(['id', 'name', 'city', 'address']),
        ]);
    }

    public function book(Request $request)
    {
        $validated = $request->validate([
            'repair_type' => 'required|in:screen,battery,rear_housing',
            'device_model' => 'required|string|max:100',
            'repair_location_id' => 'required|exists:repair_locations,id',
            'booking_date' => 'required|date|after_or_equal:today',
            'time_slot' => 'required|string|max:20',
            'customer_name' => 'required|string|max:120',
            'email' => 'required|email|max:150',
            'phone' => 'nullable|string|max:30',
            'notes' => 'nullable|string|max:1000',
        ]);

        // Respect the location's daily slot capacity.
        $location = RepairLocation::findOrFail($validated['repair_location_id']);
        $bookedThatDay = RepairBooking::where('repair_location_id', $location->id)
            ->whereDate('booking_date', $validated['booking_date'])
            ->whereNotIn('status', ['cancelled'])
            ->count();

        if ($bookedThatDay >= $location->slot_capacity) {
            return redirect()->back()->with('error', 'That store is fully booked on the selected date. Please choose another day or location.');
        }

        $validated['reference'] = 'RPR-' . strtoupper(Str::random(8));
        $validated['status'] = 'pending';

        $booking = RepairBooking::create($validated);

        // Confirmation is shown on-screen; email/SMS/WhatsApp dispatch is left as a
        // notification hook for the team to wire to their provider of choice (§8.5).

        return redirect()->back()->with('success', 'Booking confirmed. Your reference is ' . $booking->reference . '. A confirmation will be sent to ' . $booking->email . '.');
    }
}
