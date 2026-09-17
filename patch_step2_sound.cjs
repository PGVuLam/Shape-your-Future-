const fs = require('fs');
let content = fs.readFileSync('src/components/Step2RIASECExamView.tsx', 'utf-8');

// Add soundUtils import
if (!content.includes('playClickSound')) {
  content = content.replace(
    "import { UserProfile, RIASECScores, RIASECDimension } from '../types';",
    "import { UserProfile, RIASECScores, RIASECDimension } from '../types';\nimport { playClickSound } from '../utils/soundUtils';"
  );
}

// Add playClickSound to toggleAnswer
content = content.replace(
  "const toggleAnswer = (questionId: string, answerId: string) => {",
  "const toggleAnswer = (questionId: string, answerId: string) => {\n    playClickSound();"
);

// advance button
content = content.replace(
  'onClick={handleComplete}',
  'onClick={() => { playClickSound(); handleComplete(); }}'
);

fs.writeFileSync('src/components/Step2RIASECExamView.tsx', content);
