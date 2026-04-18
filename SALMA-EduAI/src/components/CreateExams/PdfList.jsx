
// components/PDFList.jsx

function PDFList({ pdfs, onPdfSelect, currentPdfIndex }) {
  return (
    <div className="pdf-list-container">
      <h3>Pdf List </h3>
      {pdfs.length > 0 ? (
        <ul id="pdf-list" className="pdf-list">
          {pdfs.map((pdf, index) => (
            <li 
              key={index} 
              className={currentPdfIndex === index ? 'active' : ''}
              onClick={() => onPdfSelect(index)}
            >
              {pdf.name}
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-files">No files available</p>
      )}
    </div>
  );
}

export default PDFList;