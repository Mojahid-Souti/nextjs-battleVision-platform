// src/components/analytics/charts/ThreatActivityChart.tsx
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ThreatData } from '@/types/analytics';
import { format } from 'date-fns';

interface ThreatActivityChartProps {
  data: ThreatData[];
}

export const ThreatActivityChart: React.FC<ThreatActivityChartProps> = ({ data }) => {
  const processData = () => {
    const groupedData = data.reduce((acc, threat) => {
      const date = format(new Date(threat.timestamp), 'MMM dd');
      if (!acc[date]) {
        acc[date] = {
          name: date,
          anomaly: 0,
          unauthorized_access: 0,
          cyber_attack: 0,
          intrusion: 0
        };
      }
      acc[date][threat.type]++;
      return acc;
    }, {} as Record<string, any>);

    return Object.values(groupedData);
  };

  const chartData = processData();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Threat Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis 
                dataKey="name" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
              <Bar 
                dataKey="anomaly" 
                fill="#3b82f6" 
                radius={[4, 4, 0, 0]} 
                name="Anomaly" 
              />
              <Bar 
                dataKey="unauthorized_access" 
                fill="#f59e0b" 
                radius={[4, 4, 0, 0]} 
                name="Unauthorized Access" 
              />
              <Bar 
                dataKey="cyber_attack" 
                fill="#ef4444" 
                radius={[4, 4, 0, 0]} 
                name="Cyber Attack" 
              />
              <Bar 
                dataKey="intrusion" 
                fill="#8b5cf6" 
                radius={[4, 4, 0, 0]} 
                name="Intrusion" 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};