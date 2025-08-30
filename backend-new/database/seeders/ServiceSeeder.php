<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $typeInstall = \App\Models\TypeService::where('nom', 'Installation')->first();
        $typeConsult = \App\Models\TypeService::where('nom', 'Consultation')->first();

        \App\Models\Service::insert([
            [
                'nom' => 'Installation de réfrigérateur',
                'description' => 'Service d\'installation professionnelle de réfrigérateur.',
                'prix' => 59.99,
                'type_id' => $typeInstall ? $typeInstall->id : 1,
                'image' => 'images/services/installation.svg',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nom' => 'Consultation décoration',
                'description' => 'Conseils personnalisés pour la décoration intérieure.',
                'prix' => 39.99,
                'type_id' => $typeConsult ? $typeConsult->id : 2,
                'image' => 'images/services/consultation.svg',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nom' => 'Maintenance technique',
                'description' => 'Service de maintenance et réparation technique.',
                'prix' => 79.99,
                'type_id' => $typeInstall ? $typeInstall->id : 1,
                'image' => 'images/services/maintenance.svg',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nom' => 'Support technique',
                'description' => 'Assistance technique 24/7 pour tous vos besoins.',
                'prix' => 29.99,
                'type_id' => $typeConsult ? $typeConsult->id : 2,
                'image' => 'images/services/support.svg',
                'created_at' => now(),
                'updated_at' => now()
            ],
        ]);
    }
}
