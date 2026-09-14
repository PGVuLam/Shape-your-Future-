import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts';

interface RIASECRadarChartProps {
  userScores: Record<string, number>;
  careerScores?: Record<string, number>;
  careerTitle?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const RIASECRadarChart: React.FC<RIASECRadarChartProps> = ({
  userScores,
  careerScores,
  careerTitle,
  size = 'md'
}) => {
  const chartData = [
    {
      dimension: 'Realistic (R)',
      full: 'Realistic: Hands-on, Physical & Mechanical',
      User: Math.round((userScores.R || 0) * 100),
      Career: careerScores ? Math.round((careerScores.R || 0) * 100) : undefined
    },
    {
      dimension: 'Investigative (I)',
      full: 'Investigative: Analytical, Scientific & Research',
      User: Math.round((userScores.I || 0) * 100),
      Career: careerScores ? Math.round((careerScores.I || 0) * 100) : undefined
    },
    {
      dimension: 'Artistic (A)',
      full: 'Artistic: Creative, Visual & Expressive',
      User: Math.round((userScores.A || 0) * 100),
      Career: careerScores ? Math.round((careerScores.A || 0) * 100) : undefined
    },
    {
      dimension: 'Social (S)',
      full: 'Social: Helping, Teaching & Caregiving',
      User: Math.round((userScores.S || 0) * 100),
      Career: careerScores ? Math.round((careerScores.S || 0) * 100) : undefined
    },
    {
      dimension: 'Enterprising (E)',
      full: 'Enterprising: Leadership, Business & Pitching',
      User: Math.round((userScores.E || 0) * 100),
      Career: careerScores ? Math.round((careerScores.E || 0) * 100) : undefined
    },
    {
      dimension: 'Conventional (C)',
      full: 'Conventional: Structured, Detail & Process',
      User: Math.round((userScores.C || 0) * 100),
      Career: careerScores ? Math.round((careerScores.C || 0) * 100) : undefined
    }
  ];

  const height = size === 'sm' ? 240 : size === 'lg' ? 360 : 300;

  return (
    <div className="w-full flex flex-col items-center">
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer>
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
            <PolarGrid stroke="#e2e8f0" />
            <PolarAngleAxis
              dataKey="dimension"
              tick={{ fill: '#475569', fontSize: size === 'sm' ? 10 : 12, fontWeight: 500 }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={{ fill: '#94a3b8', fontSize: 10 }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-slate-900 text-white p-2.5 rounded-lg text-xs shadow-lg space-y-1">
                      <p className="font-semibold text-slate-100">{data.full}</p>
                      <p className="text-sky-300">
                        User Affinity: <span className="font-bold">{data.User}%</span>
                      </p>
                      {data.Career !== undefined && (
                        <p className="text-amber-300">
                          {careerTitle || 'Target Career'} Fit: <span className="font-bold">{data.Career}%</span>
                        </p>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />
            {/* User RIASEC polygon */}
            <Radar
              name="User Profile"
              dataKey="User"
              stroke="#4f46e5"
              fill="#6366f1"
              fillOpacity={0.35}
            />
            {/* Optional Career RIASEC polygon overlay */}
            {careerScores && (
              <Radar
                name={careerTitle || 'Target Career'}
                dataKey="Career"
                stroke="#f59e0b"
                fill="#fbbf24"
                fillOpacity={0.25}
              />
            )}
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center space-x-4 text-xs mt-1">
        <div className="flex items-center space-x-1.5">
          <span className="w-3 h-3 rounded-sm bg-indigo-500 inline-block"></span>
          <span className="text-slate-600 font-medium">User RIASEC Vector</span>
        </div>
        {careerScores && (
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-sm bg-amber-500 inline-block"></span>
            <span className="text-slate-600 font-medium">{careerTitle || 'Target Career Profile'}</span>
          </div>
        )}
      </div>
    </div>
  );
};
