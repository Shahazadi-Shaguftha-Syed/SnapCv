import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function DownloadBtn() {
  const handleDownload = async () => {
    const element = document.getElementById("resume-preview");
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, width, height);
    pdf.save("my-resume.pdf");
  };

  return (
    <button className="download-btn" onClick={handleDownload}>
      🚀 Download High-Res PDF
    </button>
  );
}