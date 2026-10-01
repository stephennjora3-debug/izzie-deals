import fs from 'fs';
import path from 'path';

console.log('Updating Header to use the izzie.png logo...\n');

const headerPath = path.join('src', 'components', 'layout', 'Header.tsx');

if (fs.existsSync(headerPath)) {
  let code = fs.readFileSync(headerPath, 'utf8');
  
  // This regex finds the text "Aura", "Aura Commerce", or "Izzie Deals" inside any JSX tag
  // and replaces it with the image tag.
  const logoRegex = />(Aura|Aura Commerce|Izzie Deals)</g;
  const imageTag = '><img src="/izzie.png" alt="Izzie Deals" className="h-8 md:h-10 w-auto object-contain" /><';
  
  if (logoRegex.test(code)) {
    code = code.replace(logoRegex, imageTag);
    fs.writeFileSync(headerPath, code, 'utf8');
    console.log('Successfully replaced the text logo with izzie.png in Header.tsx.');
  } else {
    console.log('Could not find the text to replace. Please check Header.tsx manually.');
  }
} else {
  console.log('Header.tsx not found in the expected location.');
}