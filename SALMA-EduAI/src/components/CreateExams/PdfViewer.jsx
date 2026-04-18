// src/components/PDFViewer/index.jsx
import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import PDFSidebar from "./PDFSidebar";
import PDFContent from "./PDFContent";
import PDFSelectionModal from "./PDFSelectionModal";
import { usePDFContext } from "../../context/PDFContext";
import NotificationManager from "../Notification";
// import { useAuth } from "../../context/AuthProvider";

const PDFViewer = () => {
  const {
    pdfFiles,
    currentPdf,
    setCurrentPdf,
    selectedText,
    setSelectedText,
    addPdfFiles,
    uploadPdfsToServer,
    fetchPdfs,
    deletePdfFromServer,
    removePdfFile,
    loading,
  } = usePDFContext();

  // const { currentUser } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [selectionCoordinates, setSelectionCoordinates] = useState({
    x: 0,
    y: 0,
  });
  const [isUploading, setIsUploading] = useState(false);
  const pdfContainerRef = useRef(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
    // Track if initial fetch has been performed
  const fetchedRef = useRef(false);
  
  // Initialize notification manager
  const { addNotification, NotificationList } = NotificationManager();

  // Memoized fetch function to avoid dependency issues
  const memoizedFetchPdfs = useCallback(() => {
    fetchPdfs();
  }, [fetchPdfs]);

  // Fetch PDFs only once when component mounts
  useEffect(() => {
    if (!fetchedRef.current) {
      memoizedFetchPdfs(); // This will now get user from localStorage
      fetchedRef.current = true;
    }
  }, [memoizedFetchPdfs]); // Now properly includes the dependency

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Validate file types before processing
    const invalidFiles = files.filter(file => file.type !== "application/pdf");
    if (invalidFiles.length > 0) {
      const invalidNames = invalidFiles.map(f => f.name).join(', ');
      addNotification(`Invalid file type(s): ${invalidNames}. Please select only PDF files.`, "error");
      return;
    }

    // Validate file sizes (50MB limit per file)
    const maxSize = 50 * 1024 * 1024; // 50MB
    const oversizedFiles = files.filter(file => file.size > maxSize);
    if (oversizedFiles.length > 0) {
      const oversizedNames = oversizedFiles.map(f => f.name).join(', ');
      addNotification(`File(s) too large: ${oversizedNames}. Maximum file size is 50MB.`, "error");
      return;
    }

    console.log(`Attempting to add ${files.length} PDF files...`);

    // First add files locally for immediate display (now with duplicate checking)
    const addedCount = addPdfFiles(files, (message) => {
      addNotification(message, "warning");
    });

    if (addedCount === false) {
      addNotification("Please select valid PDF files", "error");
      return;
    }

    if (addedCount === 0) {
      // All files were duplicates, no need to upload
      return;
    }

    console.log(`Successfully added ${addedCount} new PDF files`);

    // Then upload to server only the newly added files
    setIsUploading(true);
    try {
      const uploaded = await uploadPdfsToServer(files); // Will get user from localStorage
      if (!uploaded) {
        addNotification(
          "Failed to upload PDFs to server. They are available temporarily for this session.",
          "warning"
        );
      } else {
        console.log("PDFs uploaded successfully to server");
        addNotification(
          `Successfully uploaded ${addedCount} PDF${addedCount > 1 ? 's' : ''} to server`,
          "success"
        );
      }
    } catch (error) {
      console.error("Upload error:", error);
      addNotification("Error uploading files. Please check your connection and try again.", "error");
    } finally {
      setIsUploading(false);
      // Clear the file input to allow re-uploading the same file if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handlePdfSelect = (pdf) => {
    setCurrentPdf(pdf);
  };

  const handlePdfDelete = async (pdfToDelete) => {
    try {
      // If this PDF is currently selected, clear the selection
      if (currentPdf && currentPdf.id === pdfToDelete.id) {
        setCurrentPdf(null);
      }

      // Remove from local state first for immediate UI feedback
      removePdfFile(pdfToDelete.id);

      // If the PDF was stored on server, delete it from there too
      if (pdfToDelete.id && pdfToDelete.serverStored !== false) {
        const deleted = await deletePdfFromServer(pdfToDelete.id);
        if (!deleted) {
          console.warn("Failed to delete PDF from server, but removed locally");
        }
      }
    } catch (error) {
      console.error("Error deleting PDF:", error);
      addNotification("Error deleting PDF. Please try again.", "error");
      // Refresh the list to ensure consistency
      fetchPdfs();
    }
  };

  const handleTextSelection = () => {
    const selection = window.getSelection();
    const text = selection.toString().trim();

    if (text) {
      setSelectedText(text);

      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const containerRect = pdfContainerRef.current.getBoundingClientRect();

      setSelectionCoordinates({
        x: rect.left - containerRect.left + rect.width / 2,
        y: rect.top - containerRect.top,
      });

      setShowModal(true);
    }
  };

  const handleConfirmSelection = () => {
    setShowModal(false);
    window.getSelection().removeAllRanges();

    // Navigate while keeping the context state intact
    navigate("/generate");
  };

  const handleCancelSelection = () => {
    setShowModal(false);
    window.getSelection().removeAllRanges();
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // Check for user authentication
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.id || !user.token) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="flex h-screen w-full bg-gray-100">
      {/* Notification component */}
      <NotificationList />
      
      <PDFSidebar
        pdfFiles={pdfFiles}
        currentPdf={currentPdf}
        fileInputRef={fileInputRef}
        onFileChange={handleFileChange}
        onPdfSelect={handlePdfSelect}
        triggerFileInput={triggerFileInput}
        isUploading={isUploading}
        isLoading={loading}
        onPdfDelete={handlePdfDelete} // Pass the delete handler to sidebar
      />

      <PDFContent
        currentPdf={currentPdf}
        pdfContainerRef={pdfContainerRef}
        onTextSelection={handleTextSelection}
      />

      {showModal && (
        <PDFSelectionModal
          selectedText={selectedText}
          coordinates={selectionCoordinates}
          onConfirm={handleConfirmSelection}
          onCancel={handleCancelSelection}
        />
      )}
    </div>
  );
};

export default PDFViewer;