const fs = require('fs');

// We will use a regex to extract the CAREER_DATABASE array
const content = fs.readFileSync('src/data/careers.ts', 'utf8');
const match = content.match(/export const CAREER_DATABASE: Career\[\] = (\[.*\]);\s*$/s);

if (match) {
  const db = eval(match[1]); // unsafe but fine here
  const englishCareers = db.slice(8);
  fs.writeFileSync('english.json', JSON.stringify(englishCareers, null, 2));
  console.log('extracted');
} else {
  console.log('not found');
}
