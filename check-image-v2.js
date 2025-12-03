const fs = require('fs');
const path = require('path');

const imagePath = path.join(process.cwd(), 'public', 'images', 'logo-favicon.jpg');

try {
    const buffer = fs.readFileSync(imagePath);
    console.log(`File size: ${buffer.length} bytes`);

    // Try to find SOF0 (Start Of Frame 0) marker 0xFFC0
    // or SOF2 (Start Of Frame 2) marker 0xFFC2
    for (let i = 0; i < buffer.length - 8; i++) {
        if (buffer[i] === 0xFF && (buffer[i + 1] === 0xC0 || buffer[i + 1] === 0xC2)) {
            const height = buffer.readUInt16BE(i + 5);
            const width = buffer.readUInt16BE(i + 7);
            console.log(`Dimensions: ${width}x${height}`);
            return;
        }
    }
    console.log('Could not determine dimensions from simple scan.');
} catch (error) {
    console.error('Error reading file:', error);
}
