const fs = require('fs');

const adminFile = 'C:/Projects/akshayam admin/components/admin/pdf/JathagamPDFTemplate.tsx';
let adminContent = fs.readFileSync(adminFile, 'utf8');
adminContent = adminContent.replace(
  /label=\"நட்சத்திரங்கள்\"/g, 
  'label="பொருந்தும் நட்சத்திரம்"'
);
fs.writeFileSync(adminFile, adminContent);

const frontendFile = 'C:/Projects/akshayam/src/frontend/components/pdf/JathagamPDFTemplate.tsx';
let frontendContent = fs.readFileSync(frontendFile, 'utf8');
frontendContent = frontendContent.replace(
  /label=\"நட்சத்திரங்கள்\"/g, 
  'label="பொருந்தும் நட்சத்திரம்"'
);
fs.writeFileSync(frontendFile, frontendContent);
console.log('Fixed label');
