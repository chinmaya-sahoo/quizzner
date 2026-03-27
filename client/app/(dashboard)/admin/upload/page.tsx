'use client';
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import api from '@/lib/axios';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function AdminUploadNotes() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');

  const onDrop = useCallback((accepted: File[]) => {
    if (accepted.length > 0) setFile(accepted[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'], 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'] },
    maxFiles: 1,
  });

  const handleUpload = async () => {
    if (!file) { setMessage('Please select a file first.'); return; }
    setIsUploading(true); setProgress(0); setMessage('');
    const formData = new FormData();
    formData.append('file', file);
    if (title) formData.append('title', title);
    try {
      await api.post('/content/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => setProgress(Math.round((e.loaded * 100) / (e.total || 100))),
      });
      setMessage('✅ Upload successful! File is now pending processing.');
      setFile(null); setTitle('');
    } catch (error: unknown) {
      const msg = (error as { response?: { data?: { error?: string } } })?.response?.data?.error;
      setMessage(msg || '❌ Upload failed. Please try again.');
    } finally { setIsUploading(false); }
  };

  return (
    <ProtectedRoute requireAdmin={true}>
      <div style={{ padding: '32px', maxWidth: '760px', margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '28px' }}>
          Upload Content 📤
        </h1>

        <div style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '32px' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: 'var(--color-text-muted)', marginBottom: '8px' }}>Content Title (Optional)</label>
            <input className="input-field" type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Chapter 4 Chemistry Notes" />
          </div>

          <div {...getRootProps()} style={{ border: `2px dashed ${isDragActive ? 'var(--color-primary)' : 'var(--color-border)'}`, borderRadius: '12px', padding: '48px', textAlign: 'center', cursor: 'pointer', background: isDragActive ? 'rgba(99,102,241,0.05)' : 'rgba(255,255,255,0.02)', transition: 'all 0.2s' }}>
            <input {...getInputProps()} />
            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>📁</div>
            {file ? (
              <p style={{ color: 'var(--color-text)', fontWeight: 600 }}>{file.name}</p>
            ) : (
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                {isDragActive ? 'Drop the file here...' : 'Drag & drop a PDF, JPG, or PNG, or click to select'}
              </p>
            )}
          </div>

          <button onClick={handleUpload} disabled={!file || isUploading} className="btn-primary" style={{ width: '100%', marginTop: '20px', justifyContent: 'center', opacity: !file || isUploading ? 0.5 : 1 }}>
            {isUploading ? `Uploading... ${progress}%` : 'Upload Content →'}
          </button>

          {isUploading && (
            <div style={{ marginTop: '12px', background: 'var(--color-border)', borderRadius: '4px', height: '6px' }}>
              <div style={{ background: 'var(--color-primary)', height: '6px', borderRadius: '4px', width: `${progress}%`, transition: 'width 0.3s' }} />
            </div>
          )}

          {message && (
            <div style={{ marginTop: '16px', padding: '12px 16px', borderRadius: '8px', fontSize: '0.88rem', fontWeight: 500, background: message.includes('✅') ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: message.includes('✅') ? '#34d399' : '#f87171', border: `1px solid ${message.includes('✅') ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}` }}>
              {message}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
