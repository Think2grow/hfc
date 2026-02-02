import React, { useMemo } from 'react';

interface ChartDataPoint {
  name: string;
  value: number;
  color: string;
  percentage: number;
}

interface PieChartProps {
  data: ChartDataPoint[];
}

export default function PieChart({ data }: PieChartProps) {
  const { slices, total } = useMemo(() => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = 0;

    const slices = data.map(item => {
      const sliceAngle = (item.value / total) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + sliceAngle;
      currentAngle = endAngle;

      return {
        ...item,
        startAngle,
        endAngle,
        sliceAngle,
      };
    });

    return { slices, total };
  }, [data]);

  const polarToCartesian = (angle: number, radius: number) => {
    const rad = ((angle - 90) * Math.PI) / 180;
    return {
      x: 100 + radius * Math.cos(rad),
      y: 100 + radius * Math.sin(rad),
    };
  };

  const createPath = (startAngle: number, endAngle: number) => {
    const start = polarToCartesian(startAngle, 80);
    const end = polarToCartesian(endAngle, 80);
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;

    return `M 100 100 L ${start.x} ${start.y} A 80 80 0 ${largeArc} 1 ${end.x} ${end.y} Z`;
  };

  return (
    <div className="space-y-4">
      <svg viewBox="0 0 200 200" className="w-full max-w-sm mx-auto">
        {slices.map((slice, idx) => (
          <g key={idx}>
            <path
              d={createPath(slice.startAngle, slice.endAngle)}
              fill={slice.color}
              stroke="white"
              strokeWidth="2"
              className="hover:opacity-80 transition-opacity cursor-pointer"
            />
          </g>
        ))}
      </svg>

      <div className="grid grid-cols-2 gap-2">
        {slices.map((slice, idx) => (
          <div key={idx} className="flex items-start gap-2 text-sm">
            <div
              className="w-3 h-3 rounded-full flex-shrink-0 mt-1"
              style={{ backgroundColor: slice.color }}
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">{slice.name}</p>
              <p className="text-gray-500 text-xs">
                ${slice.value.toFixed(0)} ({slice.percentage.toFixed(1)}%)
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
