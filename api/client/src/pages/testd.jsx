// src/TestDate.tsx (or src/TestDate.jsx)
import React from "react";
import { format } from "date-fns";
// import fa from "@date-fns/locale/fa";

const TestDate = () => {
  const today = new Date();
  const formattedDate = format(today, "PPPP", { });

  return (
    <div>
      <h1>Today's Date (Persian):</h1>
      <p>{formattedDate}</p>
    </div>
  );
};

export default TestDate;
