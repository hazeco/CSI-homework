import { useState, useRef } from "react";
import axios from "axios";

let currentUpload = null; // To track the current upload request

const Upload = () => {
  const [fileName, setFileName] = useState("");
  const progressRef = useRef(0);
  const [status, setStatus] = useState("idle"); // idle | uploading | done | error
  const inputRef = useRef();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setFileName(file.name);
    progressRef.current = 0;
    setStatus("idle");
  };

  const handleUpload = async () => {
    if (!inputRef.current?.files[0]) return;
    const file = inputRef.current.files[0];
    const formData = new FormData();
    formData.append("file", file);

    try {
      setStatus("uploading");
      currentUpload = axios.CancelToken.source(); // Create a cancel token for this upload
      await axios.post("http://localhost:3000/files/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        cancelToken: currentUpload.token,
        onUploadProgress: (event) => {
          if (event.lengthComputable) {
            progressRef.current = Math.round(
              (event.loaded / event.total) * 100,
            );
          }
        },
      });

      progressRef.current = 100;
      setStatus("done");

      setTimeout(() => {
        setFileName("");
        progressRef.current = 0;
        setStatus("idle");
        inputRef.current.value = "";
      }, 2000);
    } catch (error) {
      setStatus("error");
      console.error("Upload failed:", error);
    }
  };

  const handleCancel = () => {
    if (currentUpload) {
      currentUpload.cancel("Upload cancelled by user");
    }
    setFileName("");
    progressRef.current = 0;
    setStatus("idle");
    inputRef.current.value = "";
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-100">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-600 font-semibold">
          &uarr;
        </div>
        <h2 className="text-xl font-semibold text-slate-700">Upload File</h2>
      </div>

      <label
        htmlFor="file"
        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
      >
        {fileName ? (
          <>
            <svg
              className="w-8 h-8 text-slate-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M5 4a2 2 0 012-2h6a1 1 0 00-.82-.45l-.backing 1.79A1 1 0 0012 4h2a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2V4z" />
              <path
                fillRule="evenodd"
                d="M4.5 6.5a1 1 0 00-1 1v7a1 1 0 001 1h11a1 1 0 001-1v-7a1 1 0 00-1-1h-11zM4 9.414V8.5a.5.5 0 01.5-.5h11a.5.5 0 01.5.5v.914M6 12a1 1 0 100-2 1 1 0 000 2zm.282-4.282a1 1 0 000 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L10 10.586l-2.282-2.282a1 1 0 00-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span className="mt-1 text-sm font-medium text-slate-700 truncate max-w-xs">
              {fileName}
            </span>
            <span className="text-xs text-slate-400">Click to change file</span>
          </>
        ) : (
          <>
            <svg
              className="w-12 h-12 text-slate-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <span className="mt-1 text-sm text-slate-500">
              Click to select a file
            </span>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          name="file"
          id="file"
          className="hidden"
          onChange={handleFileChange}
        />
      </label>

      <button
        onClick={handleUpload}
        disabled={!fileName || status === "uploading"}
        className="mt-4 w-full py-2.5 rounded-xl font-semibold text-white bg-blue-500 hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        {status === "uploading"
          ? `Uploading… ${progressRef.current}%`
          : status === "done"
            ? "✓ Uploaded!"
            : "Upload"}
      </button>

      {(status === "uploading" || status === "error") && (
        <button
          onClick={handleCancel}
          className="mt-2 w-full py-2.5 rounded-xl font-semibold text-slate-700 bg-slate-200 hover:bg-slate-300 transition-colors"
        >
          &times;&nbsp;Cancel
        </button>
      )}

      {status !== "idle" && (
        <div className="mt-3">
          <progress
            value={progressRef.current}
            max="100"
            className="w-full h-2 rounded-full"
          />
          {status === "error" && (
            <p className="text-xs text-red-500 mt-1">
              Upload failed. Please try again.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Upload;
