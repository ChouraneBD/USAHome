<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom', 'description', 'prix', 'image', 'type_id'
    ];

    /**
     * Get the service type that owns the service.
     */
    public function type()
    {
        return $this->belongsTo(ServiceType::class, 'type_id');
    }

    // Accessor for image URL
    public function getImageUrlAttribute()
    {
        if ($this->image) {
            return asset('storage/' . $this->image);
        }
        return null;
    }
}
