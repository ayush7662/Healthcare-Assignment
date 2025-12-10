import { useState, useRef } from "react";
import { API } from "../api";
import { toast } from "react-hot-toast";

export default function UploadForm({ onUploadSuccess, isDark }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return setFile(null);

    if (f.type !== "application/pdf" && !f.name.endsWith(".pdf")) {
      toast.error("Only PDF files allowed");
      e.target.value = "";
      return setFile(null);
    }

    setFile(f);
  };

  const uploadFile = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Please select a PDF file!");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      await API.post("/documents/upload", formData);
      toast.success("Uploaded successfully");

      setFile(null);
      inputRef.current.value = "";

      onUploadSuccess && onUploadSuccess();
    } catch {
      toast.error("Upload failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={uploadFile} className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        onChange={handleFileChange}
        className={`block w-full text-sm
          file:py-2 file:px-4 file:rounded-md
          file:border-0 file:font-semibold
          file:bg-teal-700 file:text-white cursor-pointer
          ${isDark ? "bg-slate-900 text-slate-100"
                   : "bg-slate-50 text-slate-800"}
        `}
      />

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-2 rounded-md font-semibold
          ${loading ? "opacity-60 cursor-wait" : "hover:bg-teal-800 cursor-pointer"}
          bg-teal-700 text-white transition`}
      >
        {loading ? "Uploading..." : "Upload PDF"}
      </button>
    </form>
  );
}
