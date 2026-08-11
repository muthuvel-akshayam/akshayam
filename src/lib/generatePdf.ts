import { toJpeg } from 'html-to-image';
import jsPDF from "jspdf";

export async function downloadBioDataPdf(elementId: string, profileId: string) {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    const dataUrl = await toJpeg(element, {
      quality: 1.0,
      pixelRatio: 2,
      backgroundColor: '#ffffff'
    });

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    // Element dimensions: 794x1123 is roughly A4 aspect ratio (1:1.414)
    const pdfHeight = (element.offsetHeight * pdfWidth) / element.offsetWidth;

    pdf.addImage(dataUrl, "JPEG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Akshayam_BioData_${profileId}.pdf`);
  } catch (err) {
    console.error('Error generating PDF:', err);
    alert('Failed to generate PDF. Please try again.');
  }
}
