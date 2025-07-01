"use client";

import type React from "react";
import { useEffect, useId, useState } from "react";

interface ColorConfigItem {
  id: string; // Unique ID for each segment
  color: string;
  percentage: number;
  gradient?: [string, string];
  label: string;
}

interface CircularProgressProps {
  percentage?: number;
  colorConfig?: Array<Omit<ColorConfigItem, "id"> & { id?: string }>; // id is optional, will be generated
  size?: number;
  strokeWidth?: number;
  trailColor?: string;
  color?: string; // For single percentage mode
  gradient?: [string, string]; // For single percentage mode
  showText?: boolean;
  textSize?: string;
  textValue?: string;
  textOffsetY?: string;
  animationDuration?: number;
  enableShadow?: boolean;
  data?: any;
}

interface TooltipState {
  visible: boolean;
  content: string;
  x: number;
  y: number;
}

const Tooltip: React.FC<TooltipState> = ({ content, x, y, visible }) => {
  if (!visible) return null;

  return (
    <div
      className="pointer-events-none fixed z-[9999] rounded-md bg-gray-800 px-3 py-2 text-sm font-medium whitespace-nowrap text-white shadow-xl transition-opacity duration-150"
      style={{
        left: x,
        top: y,
        transform: "translate(-50%, calc(-100% - 12px))", // Position above cursor with a small gap
        opacity: visible ? 1 : 0,
      }}
    >
      {content}
      <div
        className="absolute top-full left-1/2 h-0 w-0 border-solid border-transparent border-t-gray-800"
        style={{
          content: '""',
          marginLeft: "-6px", // Half of border-width
          borderWidth: "6px",
        }}
      />
    </div>
  );
};

export const CircularProgress: React.FC<CircularProgressProps> = ({
  percentage = 0,
  colorConfig: initialColorConfig,
  size = 100,
  strokeWidth = 10,
  trailColor = "#e0e0e0",
  color = "#3b82f6", // Default to a blue color
  gradient,
  showText = false,
  textSize = "text-base",
  textValue,
  textOffsetY = "0.35em",
  animationDuration = 1000,
  data,
  enableShadow = false,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const [currentPercentage, setCurrentPercentage] = useState(0);
  console.log(data, "data");
  const [processedColorConfig, setProcessedColorConfig] = useState<
    ColorConfigItem[]
  >([]);
  const [currentSegments, setCurrentSegments] = useState<
    Array<ColorConfigItem & { currentArc: number }>
  >([]);

  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    content: "",
    x: 0,
    y: 0,
  });

  const gradientIdBase = useId();
  const componentId = useId(); // For unique IDs within the component

  useEffect(() => {
    if (initialColorConfig) {
      const newConfig = initialColorConfig.map((item, index) => ({
        ...item,
        id: item.id || `${componentId}-segment-${index}`, // Ensure unique ID
      }));
      setProcessedColorConfig(newConfig);
    } else {
      setProcessedColorConfig([]);
    }
  }, [initialColorConfig, componentId]);

  useEffect(() => {
    if (processedColorConfig.length > 0) {
      setCurrentSegments(
        processedColorConfig.map((segment) => ({
          ...segment,
          currentArc: 0,
        }))
      );

      const timeouts: NodeJS.Timeout[] = [];
      let delay = 0;
      processedColorConfig.forEach((segment, index) => {
        timeouts.push(
          setTimeout(() => {
            setCurrentSegments((prevSegments) =>
              prevSegments.map((s) =>
                s.id === segment.id
                  ? {
                      ...s,
                      currentArc: (segment.percentage / 100) * circumference,
                    }
                  : s
              )
            );
          }, delay)
        );
        delay += animationDuration / (processedColorConfig.length * 1.5 || 1);
      });
      return () => timeouts.forEach(clearTimeout);
    } else {
      // Single percentage mode
      setCurrentSegments([]);
      setCurrentPercentage(0);
      const timer = setTimeout(() => setCurrentPercentage(percentage), 50);
      return () => clearTimeout(timer);
    }
  }, [processedColorConfig, percentage, circumference, animationDuration]);

  const handleSegmentMouseEnter = (
    segment: ColorConfigItem,
    event: React.MouseEvent
  ) => {
    // console.log(`[DEBUG] Mouse Enter Segment: ${segment.label} (${segment.percentage}%)`);
    setTooltip({
      visible: true,
      content: `${segment.label}: ${segment.percentage}%`,
      x: event.clientX,
      y: event.clientY,
    });
  };

  const handleSegmentMouseMove = (event: React.MouseEvent) => {
    setTooltip((prev) => {
      if (prev.visible) {
        return { ...prev, x: event.clientX, y: event.clientY };
      }
      return prev;
    });
  };

  const handleSegmentMouseLeave = (segment: ColorConfigItem) => {
    // console.log(`[DEBUG] Mouse Leave Segment: ${segment.label}`);
    setTooltip((prev) => ({ ...prev, visible: false }));
  };

  // Replace the renderSegments function with this updated version
  const renderSegments = () => {
    if (currentSegments.length === 0) {
      // Single percentage mode remains the same
      const offset = circumference - (currentPercentage / 100) * circumference;
      const singleGradientId = `grad-${gradientIdBase}-single`;
      return (
        <>
          {gradient && (
            <defs>
              <linearGradient
                id={singleGradientId}
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor={gradient[0]} />
                <stop offset="100%" stopColor={gradient[1]} />
              </linearGradient>
            </defs>
          )}
          <circle
            style={{
              transition: `stroke-dashoffset ${animationDuration}ms ease-out`,
            }}
            stroke={gradient ? `url(#${singleGradientId})` : color}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            r={radius}
            cx={size / 2}
            cy={size / 2}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            filter={enableShadow ? `url(#shadow-${gradientIdBase})` : undefined}
          />
        </>
      );
    }

    let accumulatedPercentage = 0;
    return (
      <>
        <defs>
          {currentSegments.map((segment) => {
            if (segment.gradient) {
              const segmentGradientId = `grad-${gradientIdBase}-${segment.id}`;
              return (
                <linearGradient
                  key={segmentGradientId}
                  id={segmentGradientId}
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor={segment.gradient[0]} />
                  <stop offset="100%" stopColor={segment.gradient[1]} />
                </linearGradient>
              );
            }
            return null;
          })}
        </defs>
        {currentSegments.map((segment) => {
          const segmentGradientId = `grad-${gradientIdBase}-${segment.id}`;
          const currentArc = segment.currentArc;
          const segmentStartAngle = (accumulatedPercentage / 100) * 360;
          const segmentEndAngle =
            segmentStartAngle + (segment.percentage / 100) * 360;
          accumulatedPercentage += segment.percentage;

          // Hover detection parameters
          const hoverStrokeWidth = strokeWidth + Math.max(6, strokeWidth * 0.4);

          return (
            <g key={segment.id}>
              {/* Visible Arc */}
              <path
                d={describeArc(
                  size / 2,
                  size / 2,
                  radius,
                  segmentStartAngle - 90,
                  segmentEndAngle - 90
                )}
                style={{
                  transition: `stroke-dasharray ${animationDuration * 0.6}ms ease-out`,
                  pointerEvents: "none",
                }}
                stroke={
                  segment.gradient
                    ? `url(#${segmentGradientId})`
                    : segment.color
                }
                fill="transparent"
                strokeWidth={strokeWidth}
                strokeDasharray={`${currentArc} ${circumference - currentArc}`}
                strokeLinecap="round"
                filter={
                  enableShadow ? `url(#shadow-${gradientIdBase})` : undefined
                }
              />
              {/* Invisible Hover Arc */}
              <path
                d={describeArc(
                  size / 2,
                  size / 2,
                  radius,
                  segmentStartAngle - 90,
                  segmentEndAngle - 90
                )}
                fill="transparent"
                stroke="transparent"
                strokeWidth={hoverStrokeWidth}
                strokeLinecap="round"
                style={{ cursor: "pointer" }}
                onMouseEnter={(e) => handleSegmentMouseEnter(segment, e)}
                onMouseMove={handleSegmentMouseMove}
                onMouseLeave={() => handleSegmentMouseLeave(segment)}
              />
            </g>
          );
        })}
      </>
    );
  };

  // Add this helper function outside your component
  function describeArc(
    x: number,
    y: number,
    radius: number,
    startAngle: number,
    endAngle: number
  ): string {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);

    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    return [
      "M",
      start.x,
      start.y,
      "A",
      radius,
      radius,
      0,
      largeArcFlag,
      0,
      end.x,
      end.y,
    ].join(" ");
  }

  // Helper for describeArc
  function polarToCartesian(
    centerX: number,
    centerY: number,
    radius: number,
    angleInDegrees: number
  ) {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;

    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  }

  return (
    <>
      <div
        className="relative inline-flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          role="img"
          aria-label="Circular progress chart"
        >
          {enableShadow && (
            <defs>
              <filter
                id={`shadow-${gradientIdBase}`}
                x="-50%"
                y="-50%"
                width="200%"
                height="200%"
              >
                <feDropShadow
                  dx="0"
                  dy="2"
                  stdDeviation="2"
                  floodColor="rgba(0,0,0,0.1)"
                />
              </filter>
            </defs>
          )}
          <circle
            stroke={trailColor}
            fill="transparent"
            strokeWidth={strokeWidth}
            r={radius}
            cx={size / 2}
            cy={size / 2}
            filter={enableShadow ? `url(#shadow-${gradientIdBase})` : undefined}
            aria-hidden="true"
          />
          {renderSegments()}
        </svg>
        {showText ? (
          <div
            className={`absolute inset-0 flex items-center justify-center ${textSize} pointer-events-none font-semibold text-gray-700 dark:text-gray-300`}
            aria-live="polite"
          >
            <span style={{ transform: `translateY(${textOffsetY})` }}>
              {textValue !== undefined
                ? textValue
                : `${Math.round(
                    currentSegments.length > 0
                      ? currentSegments.reduce(
                          (acc, s) =>
                            acc + (s.currentArc / circumference) * 100,
                          0
                        )
                      : currentPercentage
                  )}%`}
            </span>
          </div>
        ) : (
          <div>
            {data && (
              <div
                className={`absolute inset-0 flex flex-col items-center justify-center ${textSize} pointer-events-none text-xs font-semibold text-gray-700 dark:text-gray-300`}
              ></div>
            )}
          </div>
        )}
      </div>
      <Tooltip {...tooltip} />
    </>
  );
};
