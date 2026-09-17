const fs = require('fs');
let content = fs.readFileSync('src/components/Step1ComprehensiveInfoView.tsx', 'utf-8');

// Change the careerReadiness type in the formData state
content = content.replace(
  /careerReadiness: 'clear' \| 'undecided' \| 'exploring';/,
  "careerReadiness: 'clear' | 'undecided' | 'considering' | 'exploring';"
);

// We should replace the adult specific careerReadiness or rename that specific one, but wait, 
// let's just add a generic careerReadiness field at the end of section 5.

const readinessSection = `
        {/* Career Readiness */}
        <div className="pt-2 text-xs">
          <label className="font-semibold text-slate-700 block mb-1">
            Trạng thái định hướng nghề nghiệp hiện tại của bạn:
          </label>
          <select
            value={formData.careerReadiness}
            onChange={e => setFormData({ ...formData, careerReadiness: e.target.value as any })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
          >
            <option value="exploring">Chưa có định hướng (Đang tìm hiểu hoàn toàn mới)</option>
            <option value="undecided">Đang phân vân (Giữa nhiều lựa chọn khác nhau)</option>
            <option value="considering">Có một vài định hướng (Cần xác nhận lại xem có phù hợp không)</option>
            <option value="clear">Đã xác định rõ (Chỉ cần lộ trình thực hiện chi tiết)</option>
          </select>
        </div>
`;

// Insert it right after the major input in section 5
content = content.replace(
  '        {/* Major input */}',
  readinessSection + '\n        {/* Major input */}'
);

fs.writeFileSync('src/components/Step1ComprehensiveInfoView.tsx', content);
