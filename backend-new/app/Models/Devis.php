<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Devis extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'email',
        'telephone',
        'objet',
        'message',
        'type_devis',
        'statut'
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    const STATUTS = [
        'nouveau' => 'Nouveau',
        'en_cours' => 'En cours',
        'traite' => 'Traité',
        'annule' => 'Annulé'
    ];

    const TYPES_DEVIS = [
        'service' => 'Service',
        'product' => 'Produit',
        'both' => 'Service + Produit'
    ];
}