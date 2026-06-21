'use client';

import React from 'react';

export interface Step {
  id: string;
  label: string;
}

export interface StepIndicatorProps {
  steps: Step[];
  currentStep: string;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}

type StepStatus = 'completed' | 'active' | 'upcoming';

function getStepStatus(
  steps: Step[],
  currentStep: string,
  stepIndex: number
): StepStatus {
  const currentIndex = steps.findIndex((s) => s.id === currentStep);
  if (currentIndex === -1) return 'upcoming';
  if (stepIndex < currentIndex) return 'completed';
  if (stepIndex === currentIndex) return 'active';
  return 'upcoming';
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  steps,
  currentStep,
  className = '',
  orientation = 'horizontal',
}) => {
  const isHorizontal = orientation === 'horizontal';

  return (
    <div
      className={[
        'flex',
        isHorizontal ? 'flex-row items-center' : 'flex-col items-start',
        className,
      ].join(' ')}
    >
      {steps.map((step, index) => {
        const status = getStepStatus(steps, currentStep, index);
        const isLast = index === steps.length - 1;

        return (
          <React.Fragment key={step.id}>
            {/* Step dot + label */}
            <div
              className={[
                'flex items-center gap-2',
                isHorizontal ? 'flex-col' : 'flex-row',
              ].join(' ')}
            >
              {/* Dot */}
              <div
                className={[
                  'flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-all duration-200',
                  status === 'active'
                    ? 'bg-amber text-white shadow-glow'
                    : status === 'completed'
                      ? 'bg-navy text-white'
                      : 'bg-transparent border-2 border-sage text-sage',
                ].join(' ')}
              >
                {index + 1}
              </div>

              {/* Label */}
              <span
                className={[
                  'text-xs font-medium whitespace-nowrap',
                  status === 'active'
                    ? 'text-amber'
                    : status === 'completed'
                      ? 'text-white'
                      : 'text-sage',
                ].join(' ')}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line */}
            {!isLast && (() => {
              const nextStatus = getStepStatus(steps, currentStep, index + 1);
              const isSolid = status === 'completed' && nextStatus !== 'upcoming';

              return (
                <div
                  className={[
                    isHorizontal
                      ? 'flex-1 mx-2 h-px min-w-[24px]'
                      : 'ml-4 my-1 w-px min-h-[24px]',
                    isSolid
                      ? 'bg-navy'
                      : isHorizontal
                        ? 'border-t border-dashed border-sage'
                        : 'border-l border-dashed border-sage',
                  ].join(' ')}
                />
              );
            })()}
          </React.Fragment>
        );
      })}
    </div>
  );
};

StepIndicator.displayName = 'StepIndicator';

export default StepIndicator;
