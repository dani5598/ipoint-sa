<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Stores customer repair bookings and their lifecycle status (Redesign Guide §8.5).
     */
    public function up(): void
    {
        Schema::create('repair_bookings', function (Blueprint $table) {
            $table->id();
            $table->string('reference')->unique();
            $table->string('repair_type');   // screen | battery | rear_housing
            $table->string('device_model');
            $table->foreignId('repair_location_id')->nullable()->constrained()->nullOnDelete();
            $table->date('booking_date');
            $table->string('time_slot');
            $table->string('customer_name');
            $table->string('email');
            $table->string('phone')->nullable();
            $table->text('notes')->nullable();
            $table->string('status')->default('pending'); // pending | confirmed | in_progress | completed | cancelled
            $table->string('technician')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('repair_bookings');
    }
};
