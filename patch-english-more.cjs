const fs = require('fs');
const p = 'src/data/careers.ts';
let content = fs.readFileSync(p, 'utf8');

const regexes = [
  [/Years/g, 'Năm'],
  [/Months/g, 'Tháng'],
  [/B\.S\./g, 'Cử nhân khoa học (B.S.)'],
  [/B\.A\./g, 'Cử nhân nghệ thuật (B.A.)'],
  [/M\.S\./g, 'Thạc sĩ khoa học (M.S.)'],
  [/Ph\.D\./g, 'Tiến sĩ (Ph.D.)'],
  [/"tradeoffs":/g, '"tradeoffs":'], // key shouldn't be touched
  [/Vocational Certificate/g, 'Chứng chỉ nghề'],
  [/Associate Degree/g, 'Bằng Cao đẳng']
];

for (const [r, v] of regexes) {
  content = content.replace(r, v);
}

fs.writeFileSync(p, content, 'utf8');
console.log('patched more');
