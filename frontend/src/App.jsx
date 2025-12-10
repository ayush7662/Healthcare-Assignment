import { useState } from "react";
import { Toaster } from "react-hot-toast";
import { FiFileText, FiMoon, FiSun } from "react-icons/fi";
import UploadForm from "./components/UploadForm";
import DocumentList from "./components/DocumentList";
import MedicalUploadImg from "./assets/medical-upload.png";

function App() {
  const [isDark, setIsDark] = useState(false);
  const toggleTheme = () => setIsDark((prev) => !prev);

  const [updateSignal, setUpdateSignal] = useState(false);
  const triggerUpdate = () => setUpdateSignal((prev) => !prev);

  const rootClass = isDark
    ? "min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center px-4"
    : "min-h-screen bg-gradient-to-b from-slate-100 to-slate-200 text-slate-900 flex flex-col items-center px-4";

  const cardClass = isDark
    ? "bg-slate-900 shadow-xl rounded-2xl p-6 w-full max-w-lg border border-slate-700"
    : "bg-white shadow-xl rounded-2xl p-6 w-full max-w-lg border border-gray-100";

  return (
    <div className={rootClass}>
      <Toaster />

      {/* HEADER */}
      <header className="py-6 w-full max-w-6xl flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FiFileText className="text-teal-600 text-3xl" />
          <h1 className="text-3xl md:text-4xl font-extrabold text-teal-700">
            Patient Document Portal
          </h1>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="flex items-center gap-2 px-3 py-2 rounded-full border text-sm
            border-teal-600 text-white bg-teal-700 hover:bg-teal-800 transition"
        >
          {isDark ? <FiSun /> : <FiMoon />}
          {isDark ? "Light Mode" : "Dark Mode"}
        </button>
      </header>

      <p className="text-gray-600 mb-4 text-center max-w-2xl">
        Upload, manage & securely access your medical reports.
      </p>

      {/* HERO */}
      <section className="flex flex-col items-center animate-fadeUp">
        <img
          src={MedicalUploadImg}
          alt="Upload"
          className="w-64 md:w-80 drop-shadow-xl mb-4"
          draggable="false"
        />

        <h2 className="text-2xl font-semibold">
          Store Documents Securely 
        </h2>
        <p className="text-gray-600 text-sm mt-1 mb-6">
          Quick upload • Instant access • Full privacy
        </p>

        <div className={cardClass}>
          <UploadForm onUploadSuccess={triggerUpdate} isDark={isDark} />
        </div>
      </section>

      {/* DOCUMENTS */}
      <section className="w-full max-w-6xl mt-10 pb-16 animate-fadeUp">
        <h3 className="text-xl font-bold text-teal-700 mb-4">Your Documents 📂</h3>
        <DocumentList isDark={isDark} updateSignal={updateSignal} />
      </section>
    </div>
  );
}

export default App;
