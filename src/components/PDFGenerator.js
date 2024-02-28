import React from 'react';
import jsPDF from 'jspdf';

const PDFGenerator = ({imageUrl, data}) => {

  const generatePDF = () => {
    const img = new Image();
    img.crossOrigin = 'Anonymous'; // Attempt to deal with CORS issues
    img.src = imageUrl;
    img.onload = () => {
        // Calculate aspect ratio of the image
        const aspectRatio = img.width / img.height;

        // Define maximum dimensions for the image on the PDF
        const pdfWidth = 210;
        const pdfHeight = 297;
        const marginX = 10;
        const marginY = 10;

        let imageWidth = pdfWidth - (2 * marginX);
        let imageHeight = imageWidth / aspectRatio;
        let xOffset = 0;

        if (imageHeight > (pdfHeight - (2 * marginY))) {
          imageHeight = pdfHeight - (2 * marginY);
          xOffset = (imageWidth - imageHeight * aspectRatio) / 2;
          imageWidth = imageHeight * aspectRatio;
        }

        // Create a canvas and draw the image onto it to get a data URL
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const imageDataUrl = canvas.toDataURL('image/png'); // Get image as data URL

        const textline = 8;
        const startX = 20;
        const startY = 20;

        const getMyY = (lineNumber) => startY + textline * (lineNumber - 1);

        // Create PDF and add the image
        const pdf = new jsPDF();

        // Colored bar with employee name
        pdf.setFillColor(0, 155, 219); // setting bar color
        pdf.rect(30,30, pdfWidth - 60, 7,'F'); // drawing the bar

        pdf.setTextColor(255, 255, 255); // setting text color to white
        pdf.setFontSize(12); // smaller text
        pdf.text(data.name, 32, 35); // write the text in the bar

        // Purchase Order under colored bar
        pdf.setTextColor(130, 130, 130);
        pdf.setFontSize(20);
        pdf.setFont(undefined, "bold");
        pdf.text("Purchase Order", 32, 45);

        // PO# under the colored bar
        pdf.setTextC

        // pdf.text(`Transaction Number (ID): ${data.id}`, startX, getMyY(1));
        // pdf.text(`Employee: ${data.name}`, startX, getMyY(2));
        // pdf.text(`Type: ${data.expense_type}`, startX, getMyY(3));
        // pdf.text(`Date: ${data.date}`, startX, getMyY(4));
        // pdf.text(`Vendor: ${data.vendor}`, startX, getMyY(5));
        // pdf.text(`Amount: $${data.amount}`, startX, getMyY(6));
        pdf.addPage();
        // pdf.addImage(imageDataUrl, 'PNG', 10 + xOffset, 10 + yOffset, imgPdfWidth, imgPdfHeight); // Adjust starting point as needed
        pdf.addImage(imageDataUrl, 'PNG', marginX + xOffset, marginY, imageWidth, imageHeight); // Adjust starting point as needed
        pdf.save(`transaction-${data.id}-${data.vendor}.pdf`);
    };
};



  return (
    <>
      <button onClick={generatePDF}>Generate PDF</button>
    </>
  );
};

export default PDFGenerator;
