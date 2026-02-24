import { useState, useRef } from 'react';

const Upload = () => {
  const [fileName, setFileName] = useState('');
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('idle'); // idle | uploading | done | error
  const inputRef = useRef();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setFileName(file.name);
    setProgress(0);
    setStatus('idle');
  };

  const handleUpload = () => {
    if (!inputRef.current?.files[0]) return;
    const file = inputRef.current.files[0];
    const formData = new FormData();
    formData.append('file', file);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:3000/upload');

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        setProgress(Math.round((e.loaded / e.total) * 100));
        setStatus('uploading');
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        setProgress(100);
        setStatus('done');
      } else {
        setStatus('error');
      }
    };

    xhr.onerror = () => setStatus('error');
    xhr.send(formData);
  };

  const statusColor = {
    idle: 'bg-slate-200',
    uploading: 'bg-blue-400',
    done: 'bg-emerald-400',
    error: 'bg-red-400',
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-100">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">&uarr;</div>
        <h2 className="text-xl font-semibold text-slate-700">Upload File</h2>
      </div>

      <label
        htmlFor="file"
        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
      >
        {fileName ? (
          <>
            <span className="text-2xl">📄</span>
            <span className="mt-1 text-sm font-medium text-slate-700 truncate max-w-xs">{fileName}</span>
            <span className="text-xs text-slate-400">Click to change file</span>
          </>
        ) : (
          <>
            <span className="text-3xl text-slate-300">☁</span>
            <span className="mt-1 text-sm text-slate-500">Click to select a file</span>
          </>
        )}
        <input ref={inputRef} type="file" name="file" id="file" className="hidden" onChange={handleFileChange} />
      </label>

      <button
        onClick={handleUpload}
        disabled={!fileName || status === 'uploading'}
        className="mt-4 w-full py-2.5 rounded-xl font-semibold text-white bg-blue-500 hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        {status === 'uploading' ? `Uploading… ${progress}%` : status === 'done' ? '✓ Uploaded!' : 'Upload'}
      </button>

      {status !== 'idle' && (
        <div className="mt-3">
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${statusColor[status]}`}
              style={{ width: `${progress}%` }}
            />
          </div>
          {status === 'error' && <p className="text-xs text-red-500 mt-1">Upload failed. Please try again.</p>}
        </div>
      )}
    </div>
  );
};

export default Upload;