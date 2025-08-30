<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProduitSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categorieElectro = \App\Models\CategorieProduit::where('nom', 'Électroménager')->first();
        $categorieMeubles = \App\Models\CategorieProduit::where('nom', 'Meubles')->first();
        $categorieDecoration = \App\Models\CategorieProduit::where('nom', 'Décoration')->first();

        \App\Models\Produit::insert([
            [
                'nom' => 'Réfrigérateur',
                'description' => 'Réfrigérateur moderne et économique.',
                'prix' => 499.99,
                'categorie_id' => $categorieElectro ? $categorieElectro->id : 1,
                'image' => 'images/products/refrigerateur.svg',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nom' => 'Canapé',
                'description' => 'Canapé confortable pour le salon.',
                'prix' => 299.99,
                'categorie_id' => $categorieMeubles ? $categorieMeubles->id : 2,
                'image' => 'images/products/canape.svg',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nom' => 'Vase décoratif',
                'description' => 'Beau vase pour décorer votre maison.',
                'prix' => 49.99,
                'categorie_id' => $categorieDecoration ? $categorieDecoration->id : 3,
                'image' => 'images/products/vase.svg',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'nom' => 'Table basse',
                'description' => 'Table basse moderne en bois.',
                'prix' => 199.99,
                'categorie_id' => $categorieMeubles ? $categorieMeubles->id : 2,
                'image' => 'images/products/table.svg',
                'created_at' => now(),
                'updated_at' => now()
            ],
        ]);
    }
}
