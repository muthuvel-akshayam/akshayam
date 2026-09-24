const fs = require('fs');

const files = [
  'C:/Projects/akshayam/src/frontend/components/pdf/JathagamPDFTemplate.tsx',
  'C:/Projects/akshayam admin/components/admin/pdf/JathagamPDFTemplate.tsx'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');

  // 1. Update FieldRow definition
  const oldFieldRow = `const FieldRow = ({ label, value, labelWidth = "120px", valueWidth = "310px" }: { label: string; value: string | number | null | undefined; labelWidth?: string; valueWidth?: string }) => {
  const lWidth = labelWidth.startsWith('w-[') ? labelWidth.slice(3, -1) : labelWidth;
  const vWidth = valueWidth.startsWith('w-[') ? valueWidth.slice(3, -1) : valueWidth;
  return (
    <div className="flex items-start mb-1 text-[11px] leading-tight" style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '6px', fontSize: '11.5px', lineHeight: '1.4' }}>
      <div className={\`font-bold text-emerald-950 whitespace-nowrap flex-shrink-0\`} style={{ fontWeight: 'bold', color: '#022c22', whiteSpace: 'nowrap', flexShrink: 0, width: lWidth }}>{label}</div>
      <div className="font-bold text-emerald-950 text-center flex-shrink-0" style={{ fontWeight: 'bold', color: '#022c22', textAlign: 'center', width: '10px', flexShrink: 0 }}>:</div>
      <div className={\`font-bold text-gray-900 whitespace-pre-wrap break-words pl-1 flex-shrink-0\`} style={{ fontWeight: 'bold', color: '#111827', whiteSpace: 'pre-wrap', wordBreak: 'break-word', paddingLeft: '4px', flexShrink: 0, width: vWidth }}>{value || '-'}</div>
    </div>
  );
};`;

  const newFieldRow = `const FieldRow = ({ label, value, labelWidth = "120px", valueWidth = "310px", highlightLabel = false }: { label: string; value: string | number | null | undefined; labelWidth?: string; valueWidth?: string; highlightLabel?: boolean }) => {
  const lWidth = labelWidth.startsWith('w-[') ? labelWidth.slice(3, -1) : labelWidth;
  const vWidth = valueWidth.startsWith('w-[') ? valueWidth.slice(3, -1) : valueWidth;
  const color = highlightLabel ? '#dc2626' : '#111827';
  return (
    <div className="flex items-start mb-1 text-[11px] leading-tight" style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '6px', fontSize: '11.5px', lineHeight: '1.4' }}>
      <div className={\`font-bold whitespace-nowrap flex-shrink-0 \${highlightLabel ? 'text-red-600' : 'text-emerald-950'}\`} style={{ fontWeight: 'bold', color: highlightLabel ? '#dc2626' : '#022c22', whiteSpace: 'nowrap', flexShrink: 0, width: lWidth }}>{label}</div>
      <div className={\`font-bold text-center flex-shrink-0 \${highlightLabel ? 'text-red-600' : 'text-emerald-950'}\`} style={{ fontWeight: 'bold', color: highlightLabel ? '#dc2626' : '#022c22', textAlign: 'center', width: '10px', flexShrink: 0 }}>:</div>
      <div className={\`font-bold whitespace-pre-wrap break-words pl-1 flex-shrink-0 \${highlightLabel ? 'text-red-600' : 'text-gray-900'}\`} style={{ fontWeight: 'bold', color, whiteSpace: 'pre-wrap', wordBreak: 'break-word', paddingLeft: '4px', flexShrink: 0, width: vWidth }}>{value || '-'}</div>
    </div>
  );
};`;

  content = content.replace(oldFieldRow, newFieldRow);

  // 2. Change label "குலம்" to "கூட்டம்"
  content = content.replace(/<FieldItem label="குலம்" value=\{kulam\} highlightLabel=\{true\} \/>/g, '<FieldItem label="கூட்டம்" value={kulam} highlightLabel={true} />');

  // 3. Change label "ஜாதகம்" to "தோசம்"
  content = content.replace(/<FieldItem label="ஜாதகம்" value=\{dosham\} highlightLabel=\{true\} \/>/g, '<FieldItem label="தோசம்" value={dosham} highlightLabel={true} />');

  // 4. Add highlightLabel={true} to "பொருந்தும் நட்சத்திரம்"
  content = content.replace(/<FieldRow label="பொருந்தும் நட்சத்திரம்" value=\{profile\.poruthaNakshatram/g, '<FieldRow label="பொருந்தும் நட்சத்திரம்" highlightLabel={true} value={profile.poruthaNakshatram');

  fs.writeFileSync(file, content);
  console.log('Fixed ' + file);
}
