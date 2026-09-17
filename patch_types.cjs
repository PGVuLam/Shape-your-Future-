const fs = require('fs');
let content = fs.readFileSync('src/types/index.ts', 'utf-8');
content = content.replace(
  "careerReadiness?: 'clear' | 'undecided' | 'exploring';",
  "careerReadiness?: 'clear' | 'undecided' | 'considering' | 'exploring';"
);
fs.writeFileSync('src/types/index.ts', content);
