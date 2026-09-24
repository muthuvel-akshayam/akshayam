const fs = require('fs');
const file = 'C:/Projects/akshayam admin/components/admin/pdf/JathagamPDFTemplate.tsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/<span className="font-black text-\\[#004d40\\]" style={{ fontSize: '12px', color: '#004d40', fontWeight: '900', whiteSpace: 'nowrap' }}>www\.akshayamtamilmatrimony\.com<\/span>/, '');
fs.writeFileSync(file, content);
console.log('Fixed admin file');
