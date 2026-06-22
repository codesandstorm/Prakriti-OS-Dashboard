import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  ComposedChart, Bar, Line, Legend, BarChart, RadialBarChart, RadialBar, ScatterChart, Scatter,
  ZAxis, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';

// --- MOCK DATA ---
const scoreTrendData = [
  { month: 'Jan', score: 65, target: 75 }, { month: 'Feb', score: 68, target: 75 },
  { month: 'Mar', score: 64, target: 75 }, { month: 'Apr', score: 70, target: 75 },
  { month: 'May', score: 73, target: 75 }, { month: 'Jun', score: 75, target: 75 },
  { month: 'Jul', score: 78, target: 75 }, { month: 'Aug', score: 78, target: 80 },
];

const groundwaterData = [
  { month: 'Jan', depth: -12, forecast: null }, { month: 'Feb', depth: -12.5, forecast: null },
  { month: 'Mar', depth: -13.2, forecast: null }, { month: 'Apr', depth: -14.1, forecast: null },
  { month: 'May', depth: -15.0, forecast: null }, { month: 'Jun', depth: -15.5, forecast: null },
  { month: 'Jul', depth: null, forecast: -16.2 }, { month: 'Aug', depth: null, forecast: -16.8 },
  { month: 'Sep', depth: null, forecast: -17.0 }
];

const rainfallData = [
  { month: 'Jan', current: 40, previous: 45 }, { month: 'Feb', current: 30, previous: 25 },
  { month: 'Mar', current: 20, previous: 15 }, { month: 'Apr', current: 10, previous: 10 },
  { month: 'May', current: 60, previous: 50 }, { month: 'Jun', current: 120, previous: 140 },
  { month: 'Jul', current: 250, previous: 210 }, { month: 'Aug', current: 180, previous: 200 }
];

const carbonData = [
  { name: 'Transport', value: 30, fill: '#8884d8' },
  { name: 'Energy', value: 45, fill: '#83a6ed' },
  { name: 'Industry', value: 60, fill: '#8dd1e1' },
  { name: 'Agriculture', value: 20, fill: '#82ca9d' },
];

const vegetationData = [
  { year: '2021', actual: 18.2, target: 18.0 }, { year: '2022', actual: 19.5, target: 19.0 },
  { year: '2023', actual: 20.4, target: 20.0 }, { year: '2024', actual: 21.0, target: 21.0 },
  { year: '2025', actual: 21.5, target: 22.0 }, { year: '2026', actual: 21.7, target: 23.0 },
];

const schemeData = [
  { district: 'Indore', 'Water': 40, 'Forest': 24, 'Air': 24 },
  { district: 'Bhopal', 'Water': 30, 'Forest': 13, 'Air': 22 },
  { district: 'Dhar', 'Water': 20, 'Forest': 38, 'Air': 10 },
  { district: 'Ujjain', 'Water': 27, 'Forest': 39, 'Air': 15 },
];

const officerData = [
  { name: 'Arjun', experience: 14, score: 94, reports: 1248 },
  { name: 'Priya', experience: 6, score: 88, reports: 482 },
  { name: 'Vikram', experience: 11, score: 91, reports: 893 },
  { name: 'Ananya', experience: 4, score: 97, reports: 312 },
  { name: 'Rahul', experience: 8, score: 82, reports: 610 },
  { name: 'Sneha', experience: 2, score: 75, reports: 150 },
];

const riskData = [
  { subject: 'Fire Risk', A: 85, fullMark: 100 },
  { subject: 'Flood', A: 40, fullMark: 100 },
  { subject: 'Air Quality', A: 70, fullMark: 100 },
  { subject: 'Groundwater', A: 90, fullMark: 100 },
  { subject: 'Deforestation', A: 50, fullMark: 100 },
  { subject: 'Soil Degradation', A: 65, fullMark: 100 },
];

// --- CUSTOM TOOLTIP ---
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-inverse-surface text-inverse-on-surface p-3 rounded shadow-lg text-xs font-mono">
        <p className="font-bold mb-1 border-b border-inverse-on-surface/20 pb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex justify-between gap-4 mt-1">
            <span style={{ color: entry.color }}>{entry.name}:</span>
            <span className="font-bold">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// --- CHARTS ---

export const DistrictScoreTrendChart = () => (
  <ResponsiveContainer width="100%" height="100%">
    <AreaChart data={scoreTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
      <defs>
        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
          <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-outline-variant)" />
      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--color-on-surface-variant)' }} />
      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--color-on-surface-variant)' }} />
      <RechartsTooltip content={<CustomTooltip />} />
      <Legend iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
      <Area type="monotone" dataKey="score" stroke="var(--color-primary)" fillOpacity={1} fill="url(#colorScore)" name="Health Score" />
      <Line type="step" dataKey="target" stroke="var(--color-on-surface-variant)" strokeDasharray="5 5" dot={false} name="Target" />
    </AreaChart>
  </ResponsiveContainer>
);

export const GroundwaterForecastChart = () => (
  <ResponsiveContainer width="100%" height="100%">
    <ComposedChart data={groundwaterData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-outline-variant)" />
      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--color-on-surface-variant)' }} />
      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--color-on-surface-variant)' }} />
      <RechartsTooltip content={<CustomTooltip />} />
      <Legend iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
      <Bar dataKey="depth" fill="#38bdf8" name="Actual Depth (m)" radius={[2, 2, 0, 0]} />
      <Line type="monotone" dataKey="forecast" stroke="#0284c7" strokeDasharray="4 4" strokeWidth={2} dot={{ r: 3 }} name="AI Forecast (m)" />
    </ComposedChart>
  </ResponsiveContainer>
);

export const RainfallComparisonChart = () => (
  <ResponsiveContainer width="100%" height="100%">
    <BarChart data={rainfallData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-outline-variant)" />
      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--color-on-surface-variant)' }} />
      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--color-on-surface-variant)' }} />
      <RechartsTooltip content={<CustomTooltip />} />
      <Legend iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
      <Bar dataKey="current" fill="var(--color-primary)" name="Current Year (mm)" radius={[2, 2, 0, 0]} />
      <Bar dataKey="previous" fill="var(--color-outline)" name="Previous Year (mm)" radius={[2, 2, 0, 0]} />
    </BarChart>
  </ResponsiveContainer>
);

export const CarbonProgressChart = () => (
  <ResponsiveContainer width="100%" height="100%">
    <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="100%" barSize={10} data={carbonData}>
      <RadialBar dataKey="value" cornerRadius={10} />
      <Legend iconSize={10} layout="vertical" verticalAlign="middle" wrapperStyle={{ right: 0, fontSize: '10px' }} />
      <RechartsTooltip content={<CustomTooltip />} />
    </RadialBarChart>
  </ResponsiveContainer>
);

export const VegetationGrowthChart = () => (
  <ResponsiveContainer width="100%" height="100%">
    <AreaChart data={vegetationData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-outline-variant)" />
      <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--color-on-surface-variant)' }} />
      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--color-on-surface-variant)' }} />
      <RechartsTooltip content={<CustomTooltip />} />
      <Legend iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
      <Area type="monotone" dataKey="actual" stroke="#16a34a" fill="#bbf7d0" fillOpacity={0.6} name="Actual NDVI %" />
      <Area type="step" dataKey="target" stroke="#15803d" fill="none" strokeDasharray="5 5" name="Target NDVI %" />
    </AreaChart>
  </ResponsiveContainer>
);

export const SchemeAdoptionChart = () => (
  <ResponsiveContainer width="100%" height="100%">
    <BarChart data={schemeData} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--color-outline-variant)" />
      <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--color-on-surface-variant)' }} />
      <YAxis dataKey="district" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--color-on-surface-variant)' }} />
      <RechartsTooltip content={<CustomTooltip />} />
      <Legend iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
      <Bar dataKey="Water" stackId="a" fill="#0ea5e9" name="Water Schemes" />
      <Bar dataKey="Forest" stackId="a" fill="#22c55e" name="Forestry Schemes" />
      <Bar dataKey="Air" stackId="a" fill="#a855f7" name="Air Quality Schemes" radius={[0, 4, 4, 0]} />
    </BarChart>
  </ResponsiveContainer>
);

export const OfficerPerformanceChart = () => (
  <ResponsiveContainer width="100%" height="100%">
    <ScatterChart margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-outline-variant)" />
      <XAxis type="number" dataKey="experience" name="Experience (Yrs)" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
      <YAxis type="number" dataKey="score" name="Performance Score" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
      <ZAxis type="number" dataKey="reports" range={[50, 400]} name="Reports Submitted" />
      <RechartsTooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
      <Legend iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
      <Scatter name="Officers" data={officerData} fill="var(--color-primary)" opacity={0.8} />
    </ScatterChart>
  </ResponsiveContainer>
);

export const EnvironmentalRiskForecastChart = () => (
  <ResponsiveContainer width="100%" height="100%">
    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={riskData}>
      <PolarGrid stroke="var(--color-outline-variant)" />
      <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--color-on-surface-variant)', fontSize: 9 }} />
      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 8 }} />
      <Radar name="Current Risk %" dataKey="A" stroke="#dc2626" fill="#fca5a5" fillOpacity={0.5} />
      <RechartsTooltip content={<CustomTooltip />} />
    </RadarChart>
  </ResponsiveContainer>
);
