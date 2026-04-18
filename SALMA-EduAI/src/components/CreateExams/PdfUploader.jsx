// components/PDFUploader.jsx

function PDFUploader({ onFileUpload }) {
  const handleChange = (event) => {
    if (event.target.files.length > 0) {
      onFileUpload(event.target.files);
    }
  };

  return (
    <div className="pdf-uploader">
      <input
        type="file"
        id="pdf-upload"
        accept="application/pdf"
        onChange={handleChange}
        multiple
      />
      <label htmlFor="pdf-upload" className="upload-btn">
        Upload PDF File
      </label>
    </div>
  );
}

export default PDFUploader;
