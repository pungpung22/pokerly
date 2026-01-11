const fs = require('fs');
let content = fs.readFileSync('vision.service.ts', 'utf8');
// Replace [\/\] with just /
content = content.replace(/\[\\/\\]/g, '/');
fs.writeFileSync('vision.service.ts', content);
console.log('Done');
