import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";

export async function downloadBioDataPdf(elementId: string, profileId: string) {
  const templateElement = document.getElementById(elementId);
  if (!templateElement) return;

  try {
    // Capture high-res canvas using html2canvas-pro
    const canvas = await html2canvas(templateElement, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
      windowWidth: 794,
      windowHeight: 1123,
    });

    const dataUrl = canvas.toDataURL("image/jpeg", 0.98);

    // Generate A4 PDF
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    pdf.addImage(dataUrl, "JPEG", 0, 0, 210, 297);
    pdf.save(`Akshayam_BioData_${profileId}.pdf`);
  } catch (error) {
    console.error("PDF Generation failed:", error);
    alert("Failed to generate PDF. Please try again.");
  }
}
