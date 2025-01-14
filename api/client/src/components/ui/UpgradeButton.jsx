// client/src/components/ui/UpgradeButton.jsx

import React from "react";
import { RocketLaunchIcon } from "@heroicons/react/24/solid"; // Using heroicons

function UpgradeButton() {
  return (
    <button className="flex items-center justify-center bg-primary text-white py-2 px-3 rounded font-medium hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition-all duration-200 w-full">
      <RocketLaunchIcon className="h-5 w-5 mr-2" />
      Upgrade Plan
    </button>
  );
}

export default UpgradeButton;
