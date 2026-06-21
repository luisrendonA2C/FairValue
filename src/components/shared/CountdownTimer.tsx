'use client';

import React, { useState, useEffect } from 'react';

export interface CountdownTimerProps {
  targetDate: string; // ISO 8601
  className?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeLeft(targetDate: string): TimeLeft {
  const difference = new Date(targetDate).getTime() - Date.now();

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  targetDate,
  className = '',
}) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() =>
    calculateTimeLeft(targetDate)
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const isExpired =
    timeLeft.days === 0 &&
    timeLeft.hours === 0 &&
    timeLeft.minutes === 0 &&
    timeLeft.seconds === 0;

  const units: { value: number; label: string }[] = [
    { value: timeLeft.days, label: 'Days' },
    { value: timeLeft.hours, label: 'Hrs' },
    { value: timeLeft.minutes, label: 'Min' },
    { value: timeLeft.seconds, label: 'Sec' },
  ];

  if (isExpired) {
    return (
      <div className={`flex items-center gap-2 font-mono ${className}`}>
        <span className="text-white/60 text-sm">Event ended</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {units.map((unit, index) => (
        <React.Fragment key={unit.label}>
          <div className="flex flex-col items-center rounded-lg backdrop-blur-sm bg-white/5 border border-white/10 px-3 py-2 min-w-[48px]">
            <span className="text-white text-2xl font-bold font-mono leading-none">
              {String(unit.value).padStart(2, '0')}
            </span>
            <span className="text-sage text-xs mt-1">{unit.label}</span>
          </div>
          {index < units.length - 1 && (
            <span className="text-white/40 text-xl font-mono">:</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

CountdownTimer.displayName = 'CountdownTimer';

export default CountdownTimer;
