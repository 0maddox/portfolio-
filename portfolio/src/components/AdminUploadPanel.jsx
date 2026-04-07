import React, { useEffect, useState } from 'react';

const defaultAccept = 'image/*,.pdf,.txt,.md,.doc,.docx,.rtf';

export default function AdminUploadPanel({ title = 'Upload Asset', accept = defaultAccept }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadUrl, setUploadUrl] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch('/api/check-session', {
          credentials: 'include'
        });
        const data = await res.json();
        setIsLoggedIn(Boolean(data.loggedIn));
      } catch {
        setIsLoggedIn(false);
      }
    };

    checkSession();
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Upload failed');
        return;
      }

      setUploadUrl(data.url || '');
    } catch {
      setError('Unable to upload. Make sure backend is running.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  if (!isLoggedIn) return null;

  return (
    <section className="admin-upload-panel">
      <p className="admin-upload-title">{title}</p>
      <label className="admin-upload-label">
        <span>{uploading ? 'Uploading...' : 'Choose file'}</span>
        <input
          type="file"
          accept={accept}
          onChange={handleUpload}
          disabled={uploading}
        />
      </label>
      {uploadUrl && <p className="admin-upload-result">Uploaded: {uploadUrl}</p>}
      {error && <p className="admin-upload-error">{error}</p>}
    </section>
  );
}
