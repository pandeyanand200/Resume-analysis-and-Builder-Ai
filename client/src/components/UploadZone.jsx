import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileText, Loader } from 'lucide-react';

export default function UploadZone({ onFileSelect, loading }) {
  const onDrop = useCallback((accepted) => {
    if (accepted.length > 0) onFileSelect(accepted[0]);
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    disabled: loading,
  });

  return (
    <div
      {...getRootProps()}
      className={`upload-zone ${isDragActive ? 'drag-active' : ''} ${loading ? 'disabled' : ''}`}
      style={{ opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
    >
      <input {...getInputProps()} id="resume-file-input" />
      <div className="upload-icon">
        {loading
          ? <div className="spinner" style={{ width: 32, height: 32, borderWidth: 3 }} />
          : isDragActive
            ? <FileText size={34} />
            : <UploadCloud size={34} />
        }
      </div>
      <h3>
        {isDragActive
          ? 'Drop your resume here!'
          : loading
            ? 'Analyzing your resume…'
            : 'Upload Your Resume'
        }
      </h3>
      <p style={{ marginTop: 8 }}>
        {loading
          ? 'Gemini AI is reviewing your resume. This may take a moment.'
          : 'Drag & drop a PDF file here, or click to browse'
        }
      </p>
      {!loading && (
        <p style={{ marginTop: 12, fontSize: '0.8rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>
          Supports PDF files up to 10MB
        </p>
      )}
    </div>
  );
}
