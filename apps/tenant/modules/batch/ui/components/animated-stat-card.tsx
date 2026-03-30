import React from "react";
import { Card, CardContent } from "@workspace/ui/components/card";
import Sparkline from "./sparkline";
import { useAnimatedCounter } from "../../../../hooks/use-animated-counter";

interface AnimatedStatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  displayValue?: string;
  sparkData?: number[];
  sparkColor?: string;
}

const AnimatedStatCard: React.FC<AnimatedStatCardProps> = ({
  icon,
  label,
  value,
  displayValue,
  sparkData,
  sparkColor,
}) => {
  const { count, ref } = useAnimatedCounter(value, { duration: 1200 });
  return (
    <Card>
      <CardContent className="p-4 flex items-center gap-3" ref={ref}>
        {icon}
        <div className="flex-1 min-w-0">
          <p className="text-2xl font-bold text-foreground">
            {displayValue ?? count.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
        {sparkData && (
          <Sparkline
            data={sparkData}
            width={64}
            height={24}
            color={sparkColor}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default AnimatedStatCard;
