const fs = require('fs');

const fixContent = (c) => {
  return c
    .replace(
      /<div className=\"font-bold text-emerald-950\" style={{ fontWeight: 'bold', color: '#022c22', width: '160px' }}>தொடர்பு எண்<\/div>/g, 
      '<div className="font-bold text-emerald-950 shrink-0" style={{ fontWeight: \\'bold\\', color: \\'#022c22\\', width: \\'160px\\', flexShrink: 0 }}>தொடர்பு எண்</div>'
    )
    .replace(
      /<div className=\"font-bold text-emerald-950 text-center\" style={{ fontWeight: 'bold', color: '#022c22', width: '10px', textAlign: 'center' }}>:<\/div>/g, 
      '<div className="font-bold text-emerald-950 text-center shrink-0" style={{ fontWeight: \\'bold\\', color: \\'#022c22\\', width: \\'10px\\', flexShrink: 0, textAlign: \\'center\\' }}>:</div>'
    );
};

const adminFile = 'C:/Projects/akshayam admin/components/admin/pdf/JathagamPDFTemplate.tsx';
let adminContent = fs.readFileSync(adminFile, 'utf8');
fs.writeFileSync(adminFile, fixContent(adminContent));

const frontendFile = 'C:/Projects/akshayam/src/frontend/components/pdf/JathagamPDFTemplate.tsx';
let frontendContent = fs.readFileSync(frontendFile, 'utf8');
fs.writeFileSync(frontendFile, fixContent(frontendContent));
console.log('Fixed alignment');
