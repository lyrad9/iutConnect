"use client";

import { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperTrigger,
} from "@/src/components/ui/stepper";

export interface PaginateStepperProps {
  steps: number[];
  initialStep?: number;
  onStepChange?: (step: number) => void;
  className?: string;
  label?: string;
}

export function PaginateStepper({
  steps,
  initialStep = 1,
  onStepChange,
  className = "",
  label = "Navigation par étapes",
}: PaginateStepperProps) {
  const [currentStep, setCurrentStep] = useState(initialStep);

  const handleStepChange = (step: number) => {
    setCurrentStep(step);
    if (onStepChange) {
      onStepChange(step);
    }
  };

  return (
    <div className={`space-y-2 text-center ${className}`}>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          className="shrink-0"
          variant="ghost"
          size="icon"
          onClick={() => handleStepChange(currentStep - 1)}
          disabled={currentStep === 1}
          aria-label="Étape précédente"
        >
          <ChevronLeftIcon size={16} aria-hidden="true" />
        </Button>
        <Stepper
          value={currentStep}
          onValueChange={handleStepChange}
          className="gap-1"
        >
          {steps.map((step) => (
            <StepperItem key={step} step={step} className="flex-1">
              <StepperTrigger
                className="w-full flex-col items-start gap-2"
                asChild
              >
                <StepperIndicator asChild className="bg-border h-1 w-full">
                  <span className="sr-only">{step}</span>
                </StepperIndicator>
              </StepperTrigger>
            </StepperItem>
          ))}
        </Stepper>
        <Button
          type="button"
          className="shrink-0"
          variant="ghost"
          size="icon"
          onClick={() => handleStepChange(currentStep + 1)}
          disabled={currentStep === steps.length}
          aria-label="Étape suivante"
        >
          <ChevronRightIcon size={16} aria-hidden="true" />
        </Button>
      </div>
      {label && (
        <p
          className="text-muted-foreground mt-2 text-xs"
          role="region"
          aria-live="polite"
        >
          {label}
        </p>
      )}
    </div>
  );
}

export default PaginateStepper;
