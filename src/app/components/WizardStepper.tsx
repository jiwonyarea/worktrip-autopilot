import { Check } from "lucide-react";

interface Step {
  number: number;
  label: string;
}

interface WizardStepperProps {
  steps: Step[];
  currentStep: number;
}

export function WizardStepper({ steps, currentStep }: WizardStepperProps) {
  return (
    <div className="flex items-center justify-center gap-2 py-6">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center">
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                step.number < currentStep
                  ? "bg-[#1F9D55] text-white"
                  : step.number === currentStep
                  ? "bg-[#1246A5] text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {step.number < currentStep ? (
                <Check className="w-4 h-4" />
              ) : (
                <span className="text-sm">{step.number}</span>
              )}
            </div>
            <span
              className={`text-sm ${
                step.number <= currentStep ? "text-[#1F2933]" : "text-gray-400"
              }`}
            >
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`w-12 h-0.5 mx-3 ${
                step.number < currentStep ? "bg-[#1F9D55]" : "bg-gray-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
