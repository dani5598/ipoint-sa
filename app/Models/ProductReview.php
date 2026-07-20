<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductReview extends Model
{
    protected $fillable = [
        'product_id',
        'reviewer_name',
        'rating',
        'comment',
        'is_approved'
    ];

    protected function casts(): array
    {
        return [
            'rating' => 'integer',
            'is_approved' => 'boolean'
        ];
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
