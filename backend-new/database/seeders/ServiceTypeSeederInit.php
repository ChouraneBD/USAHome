<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ServiceType;

class ServiceTypeSeederInit extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create default service types if none exist
        if (ServiceType::count() === 0) {
            $types = [
                [
                    'name' => 'Standard',
                    'description' => 'Services standards'
                ],
                [
                    'name' => 'Premium',
                    'description' => 'Services premium'
                ],
                [
                    'name' => 'Spécial',
                    'description' => 'Services spéciaux'
                ]
            ];

            foreach ($types as $type) {
                ServiceType::create($type);
            }
        }
    }
}