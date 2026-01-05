const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// Compress files for production
function compressFile(filePath) {
  const input = fs.createReadStream(filePath);
  const output = fs.createWriteStream(filePath + '.gz');
  const gzip = zlib.createGzip({ level: 9 });
  
  input.pipe(gzip).pipe(output);
  
  return new Promise((resolve, reject) => {
    output.on('finish', () => {
      const originalSize = fs.statSync(filePath).size;
      const compressedSize = fs.statSync(filePath + '.gz').size;
      console.log(`${path.basename(filePath)}: ${originalSize} → ${compressedSize} bytes (${Math.round((1 - compressedSize/originalSize) * 100)}% reduction)`);
      resolve();
    });
    output.on('error', reject);
  });
}

// Compress all JS, CSS, HTML files in dist
async function compressDistFiles() {
  const distPath = path.join(__dirname, 'dist');
  if (!fs.existsSync(distPath)) return;
  
  const files = fs.readdirSync(distPath, { recursive: true });
  const compressibleFiles = files.filter(file => 
    /\.(js|css|html|json|svg)$/.test(file) && 
    fs.statSync(path.join(distPath, file)).isFile()
  );
  
  for (const file of compressibleFiles) {
    await compressFile(path.join(distPath, file));
  }
}

if (require.main === module) {
  compressDistFiles().catch(console.error);
}

module.exports = { compressFile, compressDistFiles };