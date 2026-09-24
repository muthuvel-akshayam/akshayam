const fs = require('fs');
const file = 'C:/Projects/akshayam admin/components/admin/pdf/JathagamPDFTemplate.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /<div className=\"font-bold text-emerald-950\" style={{ fontWeight: 'bold', color: '#022c22', width: '160px' }}>தொடர்பு எண்<\/div>/g,
  `<div className="font-bold text-emerald-950 shrink-0" style={{ fontWeight: 'bold', color: '#022c22', width: '160px', flexShrink: 0 }}>தொடர்பு எண்</div>`
);

content = content.replace(
  /<div className=\"font-bold text-emerald-950 text-center\" style={{ fontWeight: 'bold', color: '#022c22', width: '10px', textAlign: 'center' }}>:<\/div>/g,
  `<div className="font-bold text-emerald-950 text-center shrink-0" style={{ fontWeight: 'bold', color: '#022c22', width: '10px', flexShrink: 0, textAlign: 'center' }}>:</div>`
);

content = content.replace(
  /<div className=\"font-bold text-red-600 pl-1\" style={{ fontWeight: 'bold', color: '#dc2626', flex: '1', display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '4px' }}>/g,
  `<div className="font-bold text-red-600 pl-1 shrink-0" style={{ fontWeight: 'bold', color: '#dc2626', flex: '1', display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '4px', flexShrink: 0 }}>`
);

fs.writeFileSync(file, content);
console.log('Fixed admin alignment');
