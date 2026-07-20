<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Adds the Box Pack / Gold Desire purchase-type structure (Redesign Guide §6).
     * `listing_type` applies to every product; the Gold Desire (used/refurbished)
     * grading fields are only populated for refurbished units.
     */
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->string('listing_type')->default('box_pack')->after('category_id'); // box_pack | gold_desire
            $table->string('condition_grade')->nullable()->after('listing_type');       // e.g. A / B / C
            $table->text('cosmetic_notes')->nullable()->after('condition_grade');
            $table->unsignedTinyInteger('battery_health')->nullable()->after('cosmetic_notes'); // percentage
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['listing_type', 'condition_grade', 'cosmetic_notes', 'battery_health']);
        });
    }
};
