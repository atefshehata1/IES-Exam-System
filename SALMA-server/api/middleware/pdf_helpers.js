const PDFDocument = require("pdfkit");
const fs = require("fs");
const bwipjs = require("bwip-js");
const QRCode = require("qrcode"); // New dependency for QR codes
const bidiFactory = require("bidi-js");
const reshaper = require("arabic-persian-reshaper");
const bidi = bidiFactory();

function processArabic(text) {
  // Reshape the text to get the correct glyph forms
  const reshaped = reshaper.ArabicShaper.convertArabic(text);
  // Reorder the characters so they display correctly
  return reshaped;
}

// // Function to generate a barcode as a Buffer
// async function generateBarcode(text) {
//   return new Promise((resolve, reject) => {
//     bwipjs.toBuffer(
//       {
//         bcid: "code128",
//         text: text,
//         scale: 2,
//         height: 40,
//         includetext: false,
//       },
//       (err, png) => {
//         if (err) reject(err);
//         else resolve(png);
//       }
//     );
//   });
// }

// Function to fill the rest of the page with lines
function fillPageWithLines(doc, startY) {
  const pageHeight = doc.page.height;
  const marginBottom = 20;
  const lineSpacing = 25;
  const lineWidth = doc.page.width - 100;
  const startX = 50;

  // Set line color to light gray
  doc.strokeColor("#CCCCCC");

  for (let y = startY; y < pageHeight - marginBottom; y += lineSpacing) {
    doc
      .moveTo(startX, y)
      .lineTo(startX + lineWidth, y)
      .stroke();

    // if (y === startY) {
    // Add a marker next to the first line for computer vision detection
  }

  // Reset stroke color to black for other elements
  doc.strokeColor("#000000");
}

// async function createPdfFromText(
//   inputText,
//   outputPath,
//   fontPath,
//   questionIds,
//   fill = false
// ) {
//   // Create a new PDF document
//   const doc = new PDFDocument({
//     size: "A4",
//     margins: {
//       top: 5,
//       bottom: 50,
//       left: 50,
//       right: 50,
//     },
//   });

//   const stream = fs.createWriteStream(outputPath);
//   doc.pipe(stream);

//   // Register Arabic font
//   // doc.registerFont("Arabic", fontPath);

//   const paragraphs = inputText.split(/\n\s*\n/);
//   const ids = questionIds.split(/\n\s*\n/);
//   console.log(ids);

//   for (let i = 0; i < paragraphs.length; i++) {
//     let paragraph = paragraphs[i].trim();
//     let examID = ids[i].trim();

//     if (i > 0) {
//       doc.addPage();
//     }
//     const rightBarcodeId = examID.toString();

//     try {
//       const [rightBarcode] = await Promise.all([
//         generateBarcode(rightBarcodeId),
//       ]);

//       // Add right barcode
//       doc.image(rightBarcode, doc.page.width - 150, 15, {
//         width: 120,
//       });

//       // Set Arabic font and size for main text
//       // doc.font("Arabic").fontSize(18);

//       // Position text start
//       const textTop = 75;
//       doc.y = textTop;
//       doc.x = 50;

//       // Add the paragraph text with RTL support
//       doc.text(paragraph, {
//         align: "left",
//         // features: ["rtla"], // Enable Arabic text features
//         indent: 0,
//         lineGap: 5,
//         paragraphGap: 5,
//         width: doc.page.width - 100,
//         // rtl: true, // Enable right-to-left text
//       });

//       // Get the Y position after the text
//       const textBottom = doc.y + 20;

//       // Fill the rest of the page with lines
//       if (fill) fillPageWithLines(doc, textBottom);
//     } catch (err) {
//       console.error("Error generating barcodes:", err);
//     }
//   }

//   doc.end();

//   return new Promise((resolve, reject) => {
//     stream.on("finish", () => {
//       console.log(PDF created successfully at ${outputPath});
//       resolve();
//     });
//     stream.on("error", (err) => {
//       console.error("Error writing PDF:", err);
//       reject(err);
//     });
//   });
// }

// Function to generate a QR code as a Buffer
async function generateQRCode(text) {
  return QRCode.toBuffer(text, {
    errorCorrectionLevel: "M",
    type: "png",
    scale: 10,
  });
}

// // Function to fill the rest of the page with lines
// function fillPageWithLines(doc, startY) {
//   const pageHeight = doc.page.height;
//   const marginBottom = 20;
//   const lineSpacing = 25;
//   const lineWidth = doc.page.width - 100;
//   const startX = 50;

//   for (let y = startY; y < pageHeight - marginBottom; y += lineSpacing) {
//     doc
//       .moveTo(startX, y)
//       .lineTo(startX + lineWidth, y)
//       .stroke();

//     // Add markers for the first line
//     if (y === startY) {
//       doc
//         .circle(startX - 15, y, 5)
//         .fillColor("black")
//         .fill();
//       doc
//         .circle(startX + lineWidth + 15, y, 5)
//         .fillColor("black")
//         .fill();
//     }
//   }
// }

async function createPdfFromText(
  inputText,
  outputPath,
  fontPath,
  questionIds,
  language = "en",
  fill = false
) {
  // Add safety checks
  if (!inputText || !questionIds) {
    console.error("Input text or question IDs are missing");
    throw new Error("Input text or question IDs are required");
  }
  const doc = new PDFDocument({
    size: "A4",
    margins: { top: 5, bottom: 50, left: 50, right: 50 },
  });

  const stream = fs.createWriteStream(outputPath);
  doc.pipe(stream);

  // Register font supporting both Arabic and English
  doc.registerFont("MainFont", fontPath);
  doc.font("MainFont").fontSize(18);

  const paragraphs = inputText.split(/\n\s*\n/);
  const ids = questionIds.split(/\n\s*\n/);

  for (let i = 0; i < paragraphs.length; i++) {
    // Add safety checks here
    let paragraph = paragraphs[i] ? paragraphs[i].trim() : "";
    let questionId = ids[i] ? ids[i].trim() : `question-${i}`;
    console.log(`DEBUG: Processing paragraph ${i}: "${paragraph}"`);
    console.log(`DEBUG: Processing question ID ${i}: "${questionId}"`);
    // let paragraph = paragraphs[i].trim();
    // let questionId = ids[i].trim();

    if (i > 0) {
      doc.addPage();
    }

    try {
      const qrCode = await generateQRCode(questionId);

      // Add QR code to the top-right corner
      doc.image(qrCode, doc.page.width - 100, 15, { width: 80, height: 80 });

      // Set text alignment based on language
      const align = language === "ar" ? "right" : "left";

      // Position text start below QR code
      const textTop = 120;
      doc.y = textTop;
      doc.x = 50;
      // if (language === "ar") {
      //   paragraph = processArabic(paragraph);
      // }
      // Add paragraph text
      doc.text(paragraph, {
        align: align,
        features: ["rtla"],
        indent: 0,
        lineGap: 5,
        paragraphGap: 5,
        width: doc.page.width - 100,
        rtl: language === "ar",
      });

      // Get Y position after text for line placement
      const textBottom = doc.y + 20;

      if (fill) fillPageWithLines(doc, textBottom);
    } catch (err) {
      console.error("Error generating QR code:", err);
    }
  }

  doc.end();

  return new Promise((resolve, reject) => {
    stream.on("finish", () => {
      console.log(`PDF created successfully at ${outputPath}`);
      resolve();
    });
    stream.on("error", (err) => {
      console.error("Error writing PDF:", err);
      reject(err);
    });
  });
}

module.exports = { createPdfFromText };
