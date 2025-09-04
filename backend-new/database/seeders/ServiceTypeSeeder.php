<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\ServiceType;

class ServiceTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $serviceTypes = [
            [
                'name' => 'Consultation',
                'description' => 'Services de consultation et conseils'
            ],
            [
                'name' => 'Développement',
                'description' => 'Services de développement logiciel'
            ],
            [
                'name' => 'Maintenance',
                'description' => 'Services de maintenance et support'
            ],
            [
                'name' => 'Formation',
                'description' => 'Services de formation et coaching'
            ]
        ];

        foreach ($serviceTypes as $type) {
            ServiceType::create($type);
        }
    }
}