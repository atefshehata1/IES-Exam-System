// src/context/PDFContext.jsx
import { createContext, useContext, useState } from 'react';

const PDFContext = createContext();

export const usePDFContext = () => {
  const context = useContext(PDFContext);
  if (!context) {
    throw new Error('usePDFContext must be used within a PDFProvider');
  }
  return context;
};

export const PDFProvider = ({ children }) => {
  const [pdfFiles, setPdfFiles] = useState([]);
  const [currentPdf, setCurrentPdf] = useState(null);
  const [selectedText, setSelectedText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Fetch existing PDFs from server when the component loads
  const fetchPdfs = async (userId = null, token = null) => {
    // Get user data from localStorage if not provided
    if (!userId || !token) {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (!storedUser || !storedUser.id || !storedUser.token) {
        console.error('No user found in localStorage');
        return;
      }
      userId = storedUser.id;
      token = storedUser.token;
    }
    
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/teachers/${userId}/exams/generate`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.status === 204) {
        setPdfFiles([]);
        setCurrentPdf(null);
        return;
      }
      
      if (!response.ok) {
        throw new Error('Failed to fetch PDFs');
      }
      
      const data = await response.json();
      const serverPdfs = data.pdfs.map(pdf => ({
        id: pdf._id || Date.now() + Math.random().toString(36).substring(2, 15),
        name: pdf.name,
        // Correctly format the URL based on your server structure
        url: `http://localhost:5000/uploads/${userId}/${pdf.name}`,
        serverStored: true
      }));
      
      setPdfFiles(serverPdfs);
      if (serverPdfs.length > 0 && !currentPdf) {
        setCurrentPdf(serverPdfs[0]);
      }
    } catch (err) {
      console.error('Error fetching PDFs:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Upload PDFs to server
  const uploadPdfsToServer = async (files, userId = null, token = null) => {
    // Get user data from localStorage if not provided
    if (!userId || !token) {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (!storedUser || !storedUser.id || !storedUser.token) {
        console.error('No user found in localStorage');
        return false;
      }
      userId = storedUser.id;
      token = storedUser.token;
    }
    
    if (files.length === 0) return false;
    
    try {
      setLoading(true);
      const formData = new FormData();
      
      Array.from(files).forEach(file => {
        formData.append('pdf', file);
      });
      
      const response = await fetch(`http://localhost:5000/teachers/${userId}/uploads`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload PDFs');
      }
      
      // After successful upload, fetch the updated PDF list
      await fetchPdfs(userId, token);
      return true;
    } catch (err) {
      console.error('Error uploading PDFs:', err);
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Local method to handle file selection (without server upload)
  const addPdfFiles = (files, onDuplicate = null) => {
    const newPdfFiles = Array.from(files)
      .filter((file) => file.type === "application/pdf")
      .map((file) => ({
        id: Date.now() + Math.random().toString(36).substring(2, 15),
        name: file.name,
        url: URL.createObjectURL(file),
        file: file, // Store the actual file object for later upload
        serverStored: false
      }));

    if (newPdfFiles.length > 0) {
      // Check for duplicates by comparing file names
      const existingNames = new Set(pdfFiles.map(pdf => pdf.name));
      const duplicateFiles = [];
      const uniqueFiles = [];
      
      newPdfFiles.forEach(newFile => {
        if (existingNames.has(newFile.name)) {
          duplicateFiles.push(newFile.name);
        } else {
          uniqueFiles.push(newFile);
          existingNames.add(newFile.name); // Add to set to prevent duplicates within the same batch
        }
      });
      
      // If there are duplicates, call the callback function instead of alert
      if (duplicateFiles.length > 0 && onDuplicate) {
        const duplicateMessage = duplicateFiles.length === 1 
          ? `File "${duplicateFiles[0]}" is already uploaded.`
          : `Files ${duplicateFiles.map(name => `"${name}"`).join(', ')} are already uploaded.`;
        onDuplicate(`${duplicateMessage} ${uniqueFiles.length > 0 ? 'Other files will be added.' : 'No new files were added.'}`);
      }
      
      // Only add unique files
      if (uniqueFiles.length > 0) {
        setPdfFiles((prev) => [...prev, ...uniqueFiles]);
        if (!currentPdf) {
          setCurrentPdf(uniqueFiles[0]);
        }
        return uniqueFiles.length; // Return number of files actually added
      }
      
      return 0; // No files added
    }
    return false;
  };

  // Delete PDF from server
  const deletePdfFromServer = async (pdfId, userId = null, token = null) => {
    // Get user data from localStorage if not provided
    if (!userId || !token) {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (!storedUser || !storedUser.id || !storedUser.token) {
        console.error('No user found in localStorage');
        return false;
      }
      userId = storedUser.id;
      token = storedUser.token;
    }
    
    try {
      const response = await fetch(`http://localhost:5000/teachers/${userId}/pdfs/${pdfId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete PDF from server');
      }

      return true;
    } catch (error) {
      console.error('Error deleting PDF from server:', error);
      return false;
    }
  };

  // Remove PDF from local state
  const removePdfFile = (pdfId) => {
    setPdfFiles(prevFiles => prevFiles.filter(pdf => pdf.id !== pdfId));
  };

  // Value object provided by the context
  const value = {
    pdfFiles,
    setPdfFiles,
    currentPdf,
    setCurrentPdf,
    selectedText,
    setSelectedText,
    addPdfFiles,
    uploadPdfsToServer,
    fetchPdfs,
    deletePdfFromServer,
    removePdfFile,
    currentPage,
    setCurrentPage,
    loading,
    error
  };

  return <PDFContext.Provider value={value}>{children}</PDFContext.Provider>;
};