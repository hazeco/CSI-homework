import { useState, useEffect } from "react";
import axios from "axios";

const fileIcon = (name) => {
  const ext = name.split('.').pop().toLowerCase();
  if (['jpg','jpeg','png','gif','webp'].includes(ext)) return '🖼️';
  if (['pdf'].includes(ext)) return '📕';
  if (['mp4','mov','avi'].includes(ext)) return '🎬';
  if (['zip','rar','7z'].includes(ext)) return '🗜️';
  if (['txt','md'].includes(ext)) return '📝';
  return '📄';
};

const Download = () => {

  const [files, setFiles] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/files/list')
      .then(res => {
        setFiles(res.data.files);
      })
      .catch(err => {
        console.error(err);
      });
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-100">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-lg">&darr;</div>
        <h2 className="text-xl font-semibold text-slate-700">Download Files</h2>
        <span className="ml-auto bg-slate-100 text-slate-500 text-xs font-medium px-2.5 py-1 rounded-full">{files.length} file{files.length !== 1 ? 's' : ''}</span>
      </div>

      {files.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-slate-300">
          <span className="text-4xl">📂</span>
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
                <span className="text-xl">{fileIcon(file.name)}</span>
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
                <span>&#8595;</span> Download
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Download;