import { useEffect } from "react";

export default function LevelUpOverlay({ show, level, onClose }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="text-center animate-bounce">
        <h1 className="text-4xl font-bold text-yellow-400">
          LEVEL UP!
        </h1>
        <p className="text-xl text-white mt-2">
          You reached Level {level}
        </p>
      </div>
    </div>
  );
}