import fs from 'fs';
import path from 'path';

console.log('🔍 Searching for redirects to homepage...\n');

function searchInDir(dir, searchTerm) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory()) {
      if (file.name !== 'node_modules' && file.name !== '.next' && file.name !== '.git') {
        searchInDir(fullPath, searchTerm);
      }
    } else if (file.name.endsWith('.tsx') || file.name.endsWith('.ts')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes(searchTerm)) {
        console.log(`⚠️ Found in: ${fullPath}`);
        // Print the line with the redirect
        const lines = content.split('\n');
        lines.forEach((line, index) => {
          if (line.includes(searchTerm)) {
            console.log(`   Line ${index + 1}: ${line.trim()}`);
          }
        });
        console.log('---');
      }
    }
  }
}

searchInDir('src', "redirect('/')");
searchInDir('src', "router.push('/')");
searchInDir('src', "router.replace('/')");