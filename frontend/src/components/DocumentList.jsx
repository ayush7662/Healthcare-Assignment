import { useEffect, useState, useMemo } from "react";
import { API } from "../api";
import { toast } from "react-hot-toast";
import { FiDownload, FiTrash, FiSearch } from "react-icons/fi";
import { FaRegFilePdf } from "react-icons/fa";

export default function DocumentList({ isDark, updateSignal }) {
  const [docs, setDocs] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [loading, setLoading] = useState(false);

  const fetchDocs = async () => {
    try {
      setLoading(true);
      const res = await API.get("/documents");
      setDocs(res.data);
    } catch {
      toast.error("Failed to load documents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, [updateSignal]);

  const formatDate = (dt) =>
    new Date(dt.replace(" ", "T")).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short"
    });

  const filteredDocs = useMemo(() => {
    let filtered = docs.filter((d) =>
      d.originalName.toLowerCase().includes(search.toLowerCase())
    );

    filtered.sort((a, b) => {
      const da = new Date(a.created_at);
      const db = new Date(b.created_at);

      switch (sortBy) {
        case "oldest":
          return da - db;
        case "name":
          return a.originalName.localeCompare(b.originalName);
        default:
          return db - da;
      }
    });

    return filtered;
  }, [docs, search, sortBy]);

  return (
    <div className="space-y-4">
      {/* SEARCH + SORT */}
      <div className="flex gap-3 flex-col md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:w-1/2">
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full pl-9 py-2 rounded-lg border outline-none
              ${isDark ? "bg-slate-900 border-slate-700 text-white"
                       : "bg-white border-gray-300 text-gray-800"}`}
          />
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className={`px-3 py-2 rounded-lg border
            ${isDark ? "bg-slate-900 border-slate-700 text-white"
                     : "bg-white border-gray-300 text-gray-800"}`}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="name">Name (A-Z)</option>
        </select>
      </div>

      {/* LIST */}
      {loading ? (
        <p className="text-gray-500 text-sm">Loading...</p>
      ) : filteredDocs.length === 0 ? (
        <p className="text-gray-500">No documents uploaded yet 📄</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className={`rounded-xl p-4 flex gap-3 border shadow-md transition
                animate-fadeUp
                ${isDark ? "bg-slate-900 border-slate-700"
                         : "bg-white border-gray-100"}`}
            >
              <FaRegFilePdf className="text-rose-600 text-3xl mt-1" />

              <div className="flex-1">
                <p className="font-semibold truncate">{doc.originalName}</p>
                <p className="text-xs text-gray-500">
                  {formatDate(doc.created_at)}
                </p>

                <div className="flex gap-4 mt-3">
                  <button
                    className="text-blue-600 hover:underline text-sm"
                    onClick={() => window.open(`http://localhost:5000/documents/${doc.id}`)}
                  >
                    Download
                  </button>
                  
                  <button
                    className="text-red-600 hover:underline text-sm"
                    onClick={async () => {
                      await API.delete(`/documents/${doc.id}`);
                      toast.success("Deleted!");
                      fetchDocs();
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
