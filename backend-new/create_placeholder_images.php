<?php

// Create placeholder images for services and products
function createPlaceholderImage($width, $height, $text, $filename, $bgColor = [100, 150, 200]) {
    $image = imagecreate($width, $height);
    
    // Set background color
    $bg = imagecolorallocate($image, $bgColor[0], $bgColor[1], $bgColor[2]);
    
    // Set text color (white)
    $textColor = imagecolorallocate($image, 255, 255, 255);
    
    // Calculate text position (center)
    $fontSize = 5;
    $textWidth = imagefontwidth($fontSize) * strlen($text);
    $textHeight = imagefontheight($fontSize);
    $x = ($width - $textWidth) / 2;
    $y = ($height - $textHeight) / 2;
    
    // Add text
    imagestring($image, $fontSize, $x, $y, $text, $textColor);
    
    // Save image
    imagejpeg($image, $filename, 90);
    imagedestroy($image);
    
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

// Create service images
createPlaceholderImage(400, 300, 'Installation Service', $servicesDir . 'installation.jpg', [255, 107, 53]);
createPlaceholderImage(400, 300, 'Consultation', $servicesDir . 'consultation.jpg', [44, 90, 160]);
createPlaceholderImage(400, 300, 'Maintenance', $servicesDir . 'maintenance.jpg', [51, 51, 51]);
createPlaceholderImage(400, 300, 'Support 24/7', $servicesDir . 'support.jpg', [102, 102, 102]);

// Create product images
createPlaceholderImage(400, 300, 'Refrigerateur', $productsDir . 'refrigerateur.jpg', [0, 123, 255]);
createPlaceholderImage(400, 300, 'Canape', $productsDir . 'canape.jpg', [220, 53, 69]);
createPlaceholderImage(400, 300, 'Vase Decoratif', $productsDir . 'vase.jpg', [253, 126, 20]);
createPlaceholderImage(400, 300, 'Table Basse', $productsDir . 'table.jpg', [40, 167, 69]);

echo "All placeholder images created successfully!\n";
