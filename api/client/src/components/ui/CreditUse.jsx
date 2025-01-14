// client/src/components/ui/CreditUse.jsx
import React from "react";

function CreditUse({ title, current, max, usagePercentage }) {
  return (
    <div className="p-4 border border-gray-200 rounded">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-gray-700">{title}</h3>
      </div>
      <div className="relative h-24 w-full">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 rounded-full border-2 border-gray-300 relative">
            <div
              className="absolute inset-0 bg-primary rounded-full"
              style={{
                clipPath: `circle(50% at 50% ${100 - usagePercentage}%)`,
              }}
            />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm text-gray-700 text-center">
              <span>
                {current}/{max}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreditUse;
