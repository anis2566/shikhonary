import React from "react";
import { cn } from "@workspace/ui/lib/utils";

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  className?: string;
  showArea?: boolean;
}

const Sparkline: React.FC<SparklineProps> = ({
  data,
  width = 80,
  height = 24,
  color = "hsl(var(--primary))",
  className,
  showArea = true,
}) => {
  const path = React.useMemo(() => {
    if (data.length < 2) return "";

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    const padding = 2;
    const effectiveWidth = width - padding * 2;
    const effectiveHeight = height - padding * 2;

    const points = data.map((value, index) => {
      const x = padding + (index / (data.length - 1)) * effectiveWidth;
      const y =
        padding + effectiveHeight - ((value - min) / range) * effectiveHeight;
      return { x, y };
    });

    const linePath = points
      .map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`))
      .join(" ");

    return linePath;
  }, [data, width, height]);

  const areaPath = React.useMemo(() => {
    if (data.length < 2 || !showArea) return "";

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    const padding = 2;
    const effectiveWidth = width - padding * 2;
    const effectiveHeight = height - padding * 2;

    const points = data.map((value, index) => {
      const x = padding + (index / (data.length - 1)) * effectiveWidth;
      const y =
        padding + effectiveHeight - ((value - min) / range) * effectiveHeight;
      return { x, y };
    });

    const linePath = points
      .map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`))
      .join(" ");

    const lastX = padding + effectiveWidth;
    const firstX = padding;
    const bottomY = height - padding;

    return `${linePath} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
  }, [data, width, height, showArea]);

  return (
    <svg
      width={width}
      height={height}
      className={cn("overflow-visible", className)}
      viewBox={`0 0 ${width} ${height}`}
    >
      <defs>
        <linearGradient
          id={`sparkline-gradient-${color.replace(/[^a-zA-Z0-9]/g, "")}`}
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop offset="0%" stopColor={color} stopOpacity={0.3} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>

      {showArea && areaPath && (
        <path
          d={areaPath}
          fill={`url(#sparkline-gradient-${color.replace(/[^a-zA-Z0-9]/g, "")})`}
        />
      )}

      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Sparkline;
