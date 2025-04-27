import React from "react";

const Process = () => {
  return (
    <div>
      <div className="flex flex-col gap-5">
        <h3 className="text-2xl font-bold">Process</h3>
        <p className="text-sm">
          We follow a structured process to ensure your project is delivered on
          time and meets your expectations.
        </p>
      </div>
      <div className="flex flex-col gap-4 mt-5">
        <div className="flex gap-2 items-center">
          <span className="text-primary">1.</span>
          <span className="text-sm font-semibold">Discovery</span>
        </div>
        <div className="flex gap-2 items-center">
          <span className="text-primary">2.</span>
          <span className="text-sm font-semibold">Design</span>
        </div>
        <div className="flex gap-2 items-center">
          <span className="text-primary">3.</span>
          <span className="text-sm font-semibold">Development</span>
        </div>
        <div className="flex gap-2 items-center">
          <span className="text-primary">4.</span>
          <span className="text-sm font-semibold">Testing</span>
        </div>
        <div className="flex gap-2 items-center">
          <span className="text-primary">5.</span>
          <span className="text-sm font-semibold">Launch</span>
        </div>
      </div>
    </div>
  );
};

export default Process;
