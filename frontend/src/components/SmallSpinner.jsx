import React from "react";

const SmallSpinner = () => {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-[#FF2DAF20] border-t-[#FF2DAF] rounded-full animate-spin"></div>
        <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-[#FF2DAF] rounded-full animate-ping opacity-20"></div>
      </div>
    </div>
  );
};

export default SmallSpinner; 