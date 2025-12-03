const fs = require('fs');
const path = require('path');

const imagePath = path.join(process.cwd(), 'public', 'images', 'logo-favicon.jpg');

try {
    const buffer = fs.readFileSync(imagePath);
    console.log(`File size: ${buffer.length} bytes`);

    // Basic JPEG header check for dimensions (SOF0 marker)
    let i = 0;
    while (i < buffer.length) {
        if (buffer[i] === 0xFF && buffer[i + 1] === 0xC0) {
            const height = buffer.readUInt16BE(i + 5);
            const width = buffer.readUInt16BE(i + 7);
            console.log(`Dimensions: ${width}x${height}`);
            break;
        }
        i++;
    }
} catch (error) {
    console.error('Error reading file:', error);
}
