import { useState, useEffect } from "react";
import axios from "axios";

const fileIcon = (name) => {
  const ext = name.split('.').pop().toLowerCase();
  const iconClass = "w-5 h-5";
  
  if (['jpg','jpeg','png','gif','webp'].includes(ext)) {
    return <svg className={iconClass} fill="currentColor" viewBox="0 0 20 20"><path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" /></svg>;
  }
  if (['pdf'].includes(ext)) {
    return <svg className={iconClass} fill="currentColor" viewBox="0 0 20 20"><path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm3.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm6.5.5a.5.5 0 01.5.5v1.5a.5.5 0 01-1 0V11a.5.5 0 01.5-.5zm0-3a.5.5 0 01.5.5v1.5a.5.5 0 01-1 0V8.5a.5.5 0 01.5-.5z" /></svg>;
  }
  if (['mp4','mov','avi'].includes(ext)) {
    return <svg className={iconClass} fill="currentColor" viewBox="0 0 20 20"><path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" /></svg>;
  }
  if (['zip','rar','7z'].includes(ext)) {
    return <svg className={iconClass} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0015.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" clipRule="evenodd" /></svg>;
  }
  if (['txt','md'].includes(ext)) {
    return <svg className={iconClass} fill="currentColor" viewBox="0 0 20 20"><path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.3A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z" /></svg>;
  }
  return <svg className={iconClass} fill="currentColor" viewBox="0 0 20 20"><path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.3A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z" /></svg>;
};

const Download = () => {

  const [files, setFiles] = useState([]);

  useEffect(() => {
    const fetchFiles = () => {
      axios.get('http://localhost:3000/files/list')
        .then(res => {
          setFiles(res.data.files || []);
        })
        .catch(err => {
          console.error(err);
        });
    };

    fetchFiles(); // initial load
    const interval = setInterval(fetchFiles, 5000); // auto-reload every 5s

    return () => clearInterval(interval); // cleanup on unmount
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-100">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 font-semibold">
          &darr;
        </div>
        <h2 className="text-xl font-semibold text-emerald-600">Download Files</h2>
        <span className="ml-auto bg-slate-100 text-slate-500 text-xs font-medium px-2.5 py-1 rounded-full">{files.length} file{files.length !== 1 ? 's' : ''}</span>
      </div>

      {files.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-slate-300">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
          <p className="mt-2 text-sm">No files available</p>
        </div>
      ) : (
        <ul className="divide-y divide-slate-100">
          {files.map((file, index) => (
            <li key={index} className="flex items-center justify-between py-3 group">
              <a
                href={file.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 min-w-0 group/name"
              >
                <span className="text-slate-400">
                  {fileIcon(file.name)}
                </span>
                <span className="text-sm font-medium text-slate-700 truncate group-hover/name:text-blue-500 group-hover/name:underline transition-colors">
                  {file.name}
                </span>
              </a>
              <a
                href={file.url}
                target="_blank"
                rel="noreferrer"
                className="ml-3 shrink-0 flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors"
              >
                &darr; Download
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Download;