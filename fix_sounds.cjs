const fs = require('fs');

function addImport(file) {
  let content = fs.readFileSync(file, 'utf-8');
  if (!content.includes('playClickSound')) return; // if it doesn't use it, skip. wait, I should just add it.
  if (!content.includes("import { playClickSound } from '../utils/soundUtils';")) {
    content = "import { playClickSound } from '../utils/soundUtils';\n" + content;
    fs.writeFileSync(file, content);
  }
}

addImport('src/components/Step1ComprehensiveInfoView.tsx');

let s3 = fs.readFileSync('src/components/Step3MBTIExamView.tsx', 'utf-8');
if (!s3.includes("import { playClickSound }")) {
  s3 = "import { playClickSound } from '../utils/soundUtils';\n" + s3;
}
if (!s3.includes("playClickSound()")) {
  s3 = s3.replace(
    "const handleAnswer = (questionId: string, answerValue: string) => {",
    "const handleAnswer = (questionId: string, answerValue: string) => {\n    playClickSound();"
  );
  s3 = s3.replace(
    'onClick={handleComplete}',
    'onClick={() => { playClickSound(); handleComplete(); }}'
  );
}
fs.writeFileSync('src/components/Step3MBTIExamView.tsx', s3);

