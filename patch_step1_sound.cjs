const fs = require('fs');
let content = fs.readFileSync('src/components/Step1ComprehensiveInfoView.tsx', 'utf-8');

// Add soundUtils import
if (!content.includes('playClickSound')) {
  content = content.replace(
    "import { UserProfile, AgeGroup } from '../types';",
    "import { UserProfile, AgeGroup } from '../types';\nimport { playClickSound } from '../utils/soundUtils';"
  );
}

// Add playClickSound to toggleItem
content = content.replace(
  "const toggleItem = (field: 'favoriteSubjects' | 'confidentSubjects' | 'interests' | 'skills', item: string) => {",
  "const toggleItem = (field: 'favoriteSubjects' | 'confidentSubjects' | 'interests' | 'skills', item: string) => {\n    playClickSound();"
);

// Add playClickSound to setFormData calls if not already there, actually it's easier to just add it on toggleItem which is used for all lists.

// And maybe for the advance button
content = content.replace(
  'onClick={handleSaveAndAdvance}',
  'onClick={() => { playClickSound(); handleSaveAndAdvance(); }}'
);

fs.writeFileSync('src/components/Step1ComprehensiveInfoView.tsx', content);
