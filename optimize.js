const fs = require('fs');
const path = require('path');

// Remove build artifacts that shouldn't be in git
function cleanBuildArtifacts() {
  const dirsToRemove = ['dist_electron', 'dist', 'build', 'out'];
  
  dirsToRemove.forEach(dir => {
    const dirPath = path.join(__dirname, dir);
    if (fs.existsSync(dirPath)) {
      fs.rmSync(dirPath, { recursive: true, force: true });
      console.log(`Removed: ${dir}/`);
    }
  });
}

// Check file sizes and warn about large files
function checkFileSizes() {
  const maxSize = 50 * 1024 * 1024; // 50MB GitHub warning limit
  const criticalSize = 100 * 1024 * 1024; // 100MB GitHub hard limit
  
  function checkDirectory(dir, relativePath = '') {
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const relPath = path.join(relativePath, item);
      
      if (fs.statSync(fullPath).isDirectory()) {
        if (!['node_modules', '.git', 'dist_electron', 'dist'].includes(item)) {
          checkDirectory(fullPath, relPath);
        }
      } else {
        const size = fs.statSync(fullPath).size;
        if (size > criticalSize) {
          console.error(`❌ CRITICAL: ${relPath} (${Math.round(size/1024/1024)}MB) exceeds GitHub 100MB limit`);
        } else if (size > maxSize) {
          console.warn(`⚠️  WARNING: ${relPath} (${Math.round(size/1024/1024)}MB) exceeds GitHub 50MB warning`);
        }
      }
    });
  }
  
  checkDirectory(__dirname);
}

// Main function
function optimizeRepository() {
  console.log('🧹 Cleaning build artifacts...');
  cleanBuildArtifacts();
  
  console.log('📏 Checking file sizes...');
  checkFileSizes();
  
  console.log('✅ Repository optimization complete!');
  console.log('💡 Use "npm run build:compress" for compressed builds');
}

if (require.main === module) {
  optimizeRepository();
}

module.exports = { cleanBuildArtifacts, checkFileSizes, optimizeRepository };