const fs = require('fs');
const path = require('path');

const dir = 'src/components';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const p = path.join(dir, file);
  let content = fs.readFileSync(p, 'utf8');
  
  content = content.replace(/language === 'vi' \? '([^']+)' : '([^']+)'/g, "'$1'");
  content = content.replace(/language === 'vi' \? "([^"]+)" : "([^"]+)"/g, '"$1"');
  content = content.replace(/language === 'vi' \? `([^`]+)` : `([^`]+)`/g, "`$1`");
  content = content.replace(/\{language === 'vi' \? '([^']+)' : '([^']+)'\}/g, "'$1'");
  
  fs.writeFileSync(p, content, 'utf8');
}
console.log('done');
