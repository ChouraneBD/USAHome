<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TypeServiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\TypeService::insert([
            [
                'nom' => 'Installation',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nom' => 'Consultation',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nom' => 'Maintenance',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nom' => 'Support',
                'created_at' => now(),
                'updated_at' => now()
            ],
        ]);
    }
}
