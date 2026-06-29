import { useEffect } from "react";

export default function SystemPopup({ message, type = "info", onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onClose]);

  const colors = {
    info: "border-cyan-400 text-cyan-300",
    success: "border-green-400 text-green-300",
    levelup: "border-yellow-400 text-yellow-300",
  };

  return (
    <div className="fixed top-6 right-6 z-50 animate-pulse">
      <div className={`bg-[#111827] border p-4 rounded-xl shadow-lg ${colors[type]}`}>
        <p className="text-sm font-semibold">
          {message}
        </p>
      </div>
    </div>
  );
}