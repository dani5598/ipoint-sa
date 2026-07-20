<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Size extends Model
{
    protected $fillable = ['name', 'reference_value'];

    public function variants()
    {
        return $this->hasMany(ProductVariant::class);
    }
}
