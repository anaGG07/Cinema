import React, { useEffect, useState } from "react";
import { CheckCircle, XCircle, X } from "lucide-react";

const Toast = ({ message, type = "success", onClose, duration = 3000 }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, duration - 500);

    const closeTimer = setTimeout(() => {
      onClose();
    }, duration);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(closeTimer);
    };
  }, [duration, onClose]);

  const getStyles = () => {
    return type === "success" 
      ? "border-[#9B4DFF] bg-gradient-to-r from-[#9B4DFF80] to-[#FF2DAF80] animate-pulse" 
      : "border-[#FF2DAF] bg-gradient-to-r from-[#FF2DAF80] to-[#9B4DFF80] animate-pulse";
  };

  const getIconColor = () => {
    return type === "success" ? "text-white" : "text-white";
  };

  return (
    <div 
      className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 
                  ${isExiting ? 'animate-slide-out' : 'animate-slide-in'}`}
    >
      <div
        className={`flex items-center gap-2 px-4 py-3 rounded-xl
                   shadow-[0_0_20px_rgba(255,45,175,0.6)] border-2 ${getStyles()} 
                   backdrop-blur-md transition-all duration-300
                   hover:scale-105 hover:shadow-[0_0_30px_rgba(155,77,255,0.8)]
                   min-w-[200px] justify-center`}
      >
        {type === "success" ? (
          <CheckCircle className={`w-5 h-5 ${getIconColor()} animate-bounce`} />
        ) : (
          <XCircle className={`w-5 h-5 ${getIconColor()} animate-bounce`} />
        )}
        <p className="text-sm font-medium text-white tracking-wide">{message}</p>
        <button
          onClick={() => {
            setIsExiting(true);
            setTimeout(onClose, 500);
          }}
          className="ml-2 text-white/80 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast;
