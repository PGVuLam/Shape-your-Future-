const fs = require('fs');
let content = fs.readFileSync('src/components/Step3MBTIExamView.tsx', 'utf-8');

if (!content.includes('playClickSound')) {
  content = content.replace(
    "import { UserProfile, AssessmentQuestion } from '../types';",
    "import { UserProfile, AssessmentQuestion } from '../types';\nimport { playClickSound } from '../utils/soundUtils';"
  );
}

content = content.replace(
  "const handleAnswer = (questionId: string, answerValue: string) => {",
  "const handleAnswer = (questionId: string, answerValue: string) => {\n    playClickSound();"
);

content = content.replace(
  'onClick={handleComplete}',
  'onClick={() => { playClickSound(); handleComplete(); }}'
);

fs.writeFileSync('src/components/Step3MBTIExamView.tsx', content);
