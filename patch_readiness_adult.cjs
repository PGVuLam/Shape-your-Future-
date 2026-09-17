const fs = require('fs');
let content = fs.readFileSync('src/components/Step1ComprehensiveInfoView.tsx', 'utf-8');

// The adult section was using careerReadiness for something else! Let's just fix the label or hide the new one for adults.
// Actually, it's better to let the adult section use something else or just remove the careerReadiness from the adult section 
// because we added a comprehensive one in section 5. Wait, the adult section says "Mục tiêu ưu tiên hàng đầu".
// I'll change the adult section to use `careerPriorities[0]` instead of `careerReadiness`.

content = content.replace(
  `value={formData.careerReadiness}
                onChange={e => setFormData({ ...formData, careerReadiness: e.target.value as any })}`,
  `value={formData.careerPriorities[0] || 'exploring'}
                onChange={e => setFormData({ ...formData, careerPriorities: [e.target.value] })}`
);

fs.writeFileSync('src/components/Step1ComprehensiveInfoView.tsx', content);
