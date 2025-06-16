"use client";
import { useState } from "react";

const ProgressTimelineBar = () => {
  const [currentStep, setCurrentStep] = useState(2);

  const steps = [
    { id: 1, title: "Topic 1", description: "description about topic" },
    { id: 2, title: "Topic 2", description: "description about topic" },
    { id: 3, title: "Topic 3", description: "description about topic" },
    { id: 4, title: "Topic 4", description: "description about topic" },
    { id: 5, title: "Topic 5", description: "description about topic" }
  ];

//error resolved
  const handleStepClick = (stepId:number) => {
    setCurrentStep(stepId);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 bg-neutral-900">
      <div className="relative">
        <h1 className="text-xl font-bold text-gray-50 mb-4">Timeline:-</h1>
        <div className="h-1 bg-gray-200 rounded-full absolute top-1/2 left-0 right-0 -translate-y-1/2 z-0" />
        <div 
          className="h-1 bg-blue-500 rounded-full absolute top-1/2 left-0 -translate-y-1/2 transition-all duration-500 z-0"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />
        <div className="relative z-10 flex justify-between items-center gap-4 flex-col md:flex-row">
          {steps.map((step) => (
            <div 
              key={step.id}
              className="flex flex-col items-center group"
              role="button"
              tabIndex={0}
              onClick={() => handleStepClick(step.id)}
              onKeyDown={(e) => e.key === "Enter" && handleStepClick(step.id)}
              aria-label={`${step.title} - ${step.description}`}
            >
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${step.id < currentStep ? "bg-green-500" : ""} ${step.id === currentStep ? "bg-blue-500 ring-4 ring-blue-200" : ""} ${step.id > currentStep ? "bg-gray-200" : ""} hover:scale-110 cursor-pointer`}
              >
                {step.id < currentStep ? (
                  <div className="h-2 w-2 rounded-full"></div>
                ) : (
                  <span className={"text-sm font-medium " + (step.id === currentStep ? "text-white" : "text-gray-600")}>
                    {step.id}
                  </span>
                )}
              </div>
              <div className="mt-2 text-center">
                <h3 className={"text-sm font-medium mb-1 " + (step.id === currentStep ? "text-blue-600" : "text-gray-600")}>
                  {step.title}
                </h3>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute bottom-full mb-2 px-3 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap">
                  {step.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgressTimelineBar;