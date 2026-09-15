const fs = require('fs');
const path = require('path');

const dir = 'src/components';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const p = path.join(dir, file);
  let content = fs.readFileSync(p, 'utf8');
  
  // replace {language === 'vi' ? A : B} with A
  content = content.replace(/\{language === 'vi' \?\s*('([^']+)'|"([^"]+)"|`([^`]+)`)\s*:\s*([^}]+)\}/g, '$1');
  
  // replace language === 'vi' ? A : B outside brackets
  content = content.replace(/language === 'vi' \?\s*('([^']+)'|"([^"]+)"|`([^`]+)`)\s*:\s*([^);\]]+)/g, '$1');
  
  // multiline ones might be harder, let's just do true ? A : B
  content = content.replace(/language === 'vi'/g, 'true');
  
  fs.writeFileSync(p, content, 'utf8');
}
console.log('done');
