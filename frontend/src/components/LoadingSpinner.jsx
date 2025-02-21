import React from "react";

const LoadingSpinner = () => {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "#0A051A" }}
    >
      <div className="relative">
        <div className="w-24 h-24 border-4 border-[#FF2DAF20] border-t-[#FF2DAF] rounded-full animate-spin"></div>
        <div className="absolute inset-0 w-24 h-24 border-4 border-transparent border-t-[#FF2DAF] rounded-full animate-ping opacity-20"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner; 