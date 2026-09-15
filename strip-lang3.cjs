const fs = require('fs');
const path = require('path');

const dir = 'src/components';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const p = path.join(dir, file);
  let content = fs.readFileSync(p, 'utf8');
  
  // replace {true ? 'X' : 'Y'} or {true ? "X" : "Y"} or {true ? `X` : `Y`} with 'X'
  // Actually, replacing {true ? ...} is valid TSX but leaves dead code. 
  // Let's run eslint to fix it? No, just leave it as `true ? A : B`, it will always render A.
}
