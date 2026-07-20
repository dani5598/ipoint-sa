<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'category_id',
        'listing_type',
        'condition_grade',
        'cosmetic_notes',
        'battery_health',
        'name',
        'slug',
        'description',
        'summary_specs',
        'technical_specs',
        'base_price',
        'original_price',
        'image_path',
        'gallery_images',
        'is_featured',
        'is_new',
        'is_on_promo'
    ];

    protected function casts(): array
    {
        return [
            'gallery_images' => 'array',
            'summary_specs' => 'array',
            'technical_specs' => 'array',
            'battery_health' => 'integer',
            'is_featured' => 'boolean',
            'is_new' => 'boolean',
            'is_on_promo' => 'boolean',
            'base_price' => 'decimal:2',
            'original_price' => 'decimal:2'
        ];
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function variants()
    {
        return $this->hasMany(ProductVariant::class);
    }

    public function attributeValues()
    {
        return $this->belongsToMany(AttributeValue::class, 'product_attribute_value');
    }

    public function reviews()
    {
        return $this->hasMany(ProductReview::class);
    }

    public function approvedReviews()
    {
        return $this->hasMany(ProductReview::class)->where('is_approved', true);
    }
}
