const fs = require('fs');
const translate = require('translate-google');
const path = require('path');

// We need a robust translation function
async function trans(text) {
  if (!text) return text;
  if (typeof text !== 'string') return text;
  
  // if already contains Vietnamese specific characters, maybe skip
  if (text.match(/[àáảãạâầấẩẫậăằắẳẵặèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i)) {
    return text;
  }
  
  let retries = 3;
  while(retries > 0) {
    try {
      const res = await translate(text, { to: 'vi' });
      return res;
    } catch(e) {
      retries--;
      await new Promise(r => setTimeout(r, 1000));
    }
  }
  return text; // return original if fail
}

async function run() {
  const file = fs.readFileSync('src/data/careers.ts', 'utf8');
  // Since it's a TS file exporting an array, we can't easily require it in CommonJS if it has ES imports.
  // Wait, let's use the actual file via regex or simply parse it as JSON if possible? 
  // No, we used `tsx` earlier. Let's use `tsx` and write it in TS.
}

run();
