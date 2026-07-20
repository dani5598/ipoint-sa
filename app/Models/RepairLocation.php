<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RepairLocation extends Model
{
    protected $fillable = [
        'name',
        'address',
        'city',
        'slot_capacity',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'slot_capacity' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    public function bookings()
    {
        return $this->hasMany(RepairBooking::class);
    }
}
