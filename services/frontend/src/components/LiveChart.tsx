import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ChartData {
  time: string;
  value: number;
}

export function LiveChart({ data }: { data: ChartData[] }) {
  return (
    <div className="h-full w-full min-h-[300px]">
       <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: 0,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#bd00ff" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#bd00ff" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
          <XAxis dataKey="time" stroke="#666" fontSize={10} tickLine={false} axisLine={false} />
          <YAxis stroke="#666" fontSize={10} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#333', color: '#fff' }}
            itemStyle={{ color: '#bd00ff' }}
          />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke="#bd00ff" 
            strokeWidth={2}
            fill="url(#colorValue)" 
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
