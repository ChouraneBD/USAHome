<?php

// Create simple SVG placeholder images
function createSVGImage($width, $height, $text, $filename, $bgColor = '#6699cc') {
    $svg = '<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="' . $width . '" height="' . $height . '" viewBox="0 0 ' . $width . ' ' . $height . '">
  <rect width="100%" height="100%" fill="' . $bgColor . '"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="20" fill="white" text-anchor="middle" dominant-baseline="middle">' . $text . '</text>
</svg>';
    
    file_put_contents($filename, $svg);
    echo "Created: $filename\n";
}

// Create directories if they don't exist
$servicesDir = 'storage/app/public/images/services/';
$productsDir = 'storage/app/public/images/products/';

if (!is_dir($servicesDir)) {
    mkdir($servicesDir, 0755, true);
}

if (!is_dir($productsDir)) {
    mkdir($productsDir, 0755, true);
}

// Create service images (SVG format)
createSVGImage(400, 300, 'Installation', $servicesDir . 'installation.svg', '#ff6b35');
createSVGImage(400, 300, 'Consultation', $servicesDir . 'consultation.svg', '#2c5aa0');
createSVGImage(400, 300, 'Maintenance', $servicesDir . 'maintenance.svg', '#333333');
createSVGImage(400, 300, 'Support', $servicesDir . 'support.svg', '#666666');

// Create product images (SVG format)
createSVGImage(400, 300, 'Refrigerateur', $productsDir . 'refrigerateur.svg', '#007bff');
createSVGImage(400, 300, 'Canape', $productsDir . 'canape.svg', '#dc3545');
createSVGImage(400, 300, 'Vase', $productsDir . 'vase.svg', '#fd7e14');
createSVGImage(400, 300, 'Table', $productsDir . 'table.svg', '#28a745');

echo "All SVG placeholder images created successfully!\n";
