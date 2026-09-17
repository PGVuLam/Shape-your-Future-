const fs = require('fs');
let content = fs.readFileSync('src/components/WorkflowStepper.tsx', 'utf-8');

if (!content.includes('playClickSound')) {
  content = content.replace(
    "import { CheckCircle2, Circle, Lock, BrainCircuit, Activity, Network } from 'lucide-react';",
    "import { CheckCircle2, Circle, Lock, BrainCircuit, Activity, Network } from 'lucide-react';\nimport { playClickSound } from '../utils/soundUtils';"
  );
}

content = content.replace(
  'onClick={() => {',
  'onClick={() => {\n              if (isUnlocked) playClickSound();'
);

fs.writeFileSync('src/components/WorkflowStepper.tsx', content);
