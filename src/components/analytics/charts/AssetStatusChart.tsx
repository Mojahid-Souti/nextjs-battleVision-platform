// src/components/analytics/charts/AssetStatusChart.tsx
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { ThreatData, ThreatStatus } from '@/types/analytics';

interface AssetStatusChartProps {
  data: ThreatData[];
}

const STATUS_CONFIG: Record<ThreatStatus, { color: string; label: string }> = {
  detected: { 
    color: '#3b82f6', // Blue
    label: 'Detected'
  },
  analyzing: { 
    color: '#8b5cf6', // Purple
    label: 'Analyzing'
  },
  mitigated: { 
    color: '#22c55e', // Green
    label: 'Mitigated'
  },
  resolved: { 
    color: '#64748b', // Gray
    label: 'Resolved'
  }
};

export const AssetStatusChart: React.FC<AssetStatusChartProps> = ({ data }) => {
  const calculateStatusDistribution = () => {
    const total = data.length;
    const statusCounts = data.reduce((acc, threat) => {
      acc[threat.status] = (acc[threat.status] || 0) + 1;
      return acc;
    }, {} as Record<ThreatStatus, number>);

    return Object.entries(STATUS_CONFIG).map(([status, config]) => ({
      name: config.label,
      value: statusCounts[status as ThreatStatus] || 0,
      percentage: total ? ((statusCounts[status as ThreatStatus] || 0) / total * 100).toFixed(1) : '0',
      color: config.color
    }));
  };

  const chartData = calculateStatusDistribution();

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload[0]) {
      const data = payload[0].payload;
      return (
        <div className="p-3 bg-white border rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{data.name}</p>
          <div className="mt-1 space-y-1">
            <p className="text-sm text-gray-600">
              Count: <span className="font-medium">{data.value}</span>
            </p>
            <p className="text-sm text-gray-600">
              Percentage: <span className="font-medium">{data.percentage}%</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    value
  }: any) => {
    if (value === 0) return null;
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        className="text-xs font-medium"
      >
        {`${(percent * 100).toFixed(1)}%`}
      </text>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Threat Status Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomLabel}
                outerRadius={130}
                innerRadius={90}
                paddingAngle={4}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                    strokeWidth={2}
                    stroke="#fff"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                iconSize={10}
                formatter={(value: string) => (
                  <span className="text-sm text-gray-600">
                    {value} ({chartData.find(d => d.name === value)?.percentage}%)
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default AssetStatusChart;