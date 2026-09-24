const fs = require('fs');

const adminFile = 'C:/Projects/akshayam admin/components/admin/pdf/JathagamPDFTemplate.tsx';
let adminContent = fs.readFileSync(adminFile, 'utf8');
adminContent = adminContent.replace(
  /\{profile\.user\?\.mobile_no \|\|/g, 
  '{(profile.user?.mobile_no || "").replace(/^\\\\+91\\\\s*/, "") ||'
);
fs.writeFileSync(adminFile, adminContent);

const frontendFile = 'C:/Projects/akshayam/src/frontend/components/pdf/JathagamPDFTemplate.tsx';
let frontendContent = fs.readFileSync(frontendFile, 'utf8');
frontendContent = frontendContent.replace(
  /\{profile\.user\?\.mobile_no \|\|/g, 
  '{(profile.user?.mobile_no || "").replace(/^\\\\+91\\\\s*/, "") ||'
);
fs.writeFileSync(frontendFile, frontendContent);
console.log('Fixed');
