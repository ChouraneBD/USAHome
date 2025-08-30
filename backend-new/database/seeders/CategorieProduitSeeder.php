<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategorieProduitSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\CategorieProduit::insert([
            [
                'nom' => 'Électroménager',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nom' => 'Meubles',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nom' => 'Décoration',
                'created_at' => now(),
                'updated_at' => now()
            ],
        ]);
    }
}
