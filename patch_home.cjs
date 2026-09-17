const fs = require('fs');
let content = fs.readFileSync('src/components/HomeLandingView.tsx', 'utf-8');

// Wrap the cards grid in a motion.div
content = content.replace(
  '<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">',
  `<motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1, delayChildren: 0.4 } }
          }}
        >`
);

// Replace the closing div of the grid
content = content.replace(
  /<\/div>\n      <\/div>\n\n      \{\/\* Why Choose Us \*\/\}/,
  `</motion.div>\n      </div>\n\n      {/* Why Choose Us */}`
);

// Replace each card's div with motion.div
content = content.replace(
  /\{(\/\* Card Step 1 \*\/)\}\n          <div className="bg-white p-5 rounded-2xl border border-slate-200\/80 shadow-xs space-y-3 relative group hover:border-indigo-300 transition-colors">/g,
  `{$1}\n          <motion.div 
            className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3 relative group hover:border-indigo-300 transition-colors"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
            }}
          >`
);

content = content.replace(
  /\{(\/\* Card Step 2 \*\/)\}\n          <div className="bg-white p-5 rounded-2xl border border-slate-200\/80 shadow-xs space-y-3 relative group hover:border-indigo-300 transition-colors">/g,
  `{$1}\n          <motion.div 
            className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3 relative group hover:border-indigo-300 transition-colors"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
            }}
          >`
);

content = content.replace(
  /\{(\/\* Card Step 3 \*\/)\}\n          <div className="bg-white p-5 rounded-2xl border border-slate-200\/80 shadow-xs space-y-3 relative group hover:border-indigo-300 transition-colors">/g,
  `{$1}\n          <motion.div 
            className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3 relative group hover:border-indigo-300 transition-colors"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
            }}
          >`
);

content = content.replace(
  /\{(\/\* Card Step 4 \*\/)\}\n          <div className="bg-white p-5 rounded-2xl border border-slate-200\/80 shadow-xs space-y-3 relative group hover:border-indigo-300 transition-colors">/g,
  `{$1}\n          <motion.div 
            className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3 relative group hover:border-indigo-300 transition-colors"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
            }}
          >`
);

// Replace closing divs of cards
for (let i = 0; i < 4; i++) {
  content = content.replace(
    /          <\/div>\n\n          \{(\/\* Card Step )/g,
    `          </motion.div>\n\n          {$1`
  );
}
content = content.replace(
  /          <\/div>\n        <\/motion\.div>\n      <\/div>/g,
  `          </motion.div>\n        </motion.div>\n      </div>`
);


// Add sound to CTA
content = content.replace(
  'onClick={onStartExam}',
  'onClick={() => { playClickSound(); onStartExam(); }}'
);
content = content.replace(
  'onClick={() => onLoadDemoProfile(DEMO_PROFILES[0])}',
  'onClick={() => { playClickSound(); onLoadDemoProfile(DEMO_PROFILES[0]); }}'
);

fs.writeFileSync('src/components/HomeLandingView.tsx', content);
