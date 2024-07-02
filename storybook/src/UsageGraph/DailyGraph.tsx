import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

export type GraphProps = {
  data: {
    hour: string;
    capacity: number;
    charging: number;
  }[];
};

export const DailyGraph = ({ data }: GraphProps) => {
  return (
    <>
      <ResponsiveContainer width="100%" height={200}>
        <ComposedChart
          data={data}
          margin={{
            top: 20,
            right: 20,
            left: -20,
          }}
        >
          <CartesianGrid strokeDasharray="1 2" strokeWidth={0.4} />
          <XAxis
            dataKey="hour"
            textAnchor="start"
            interval={2}
            axisLine={true}
            tickLine={true}
            scale="point"
          />
          <YAxis
            dataKey="capacity"
            domain={[0, 100]}
            tickCount={3}
            axisLine={true}
            tickLine={true}
          />
          <Area
            type="step"
            dataKey="charging"
            fill="#01da2c65"
            stroke="#01da2c65"
          />
          <Bar
            legendType="none"
            maxBarSize={8}
            dataKey="capacity"
            fill="#00da2c"
          />
        </ComposedChart>
      </ResponsiveContainer>
      {data.length === 0 && (
        <div style={{ fontSize: "14px" }}>
          NOT ENOUGH DATA, KEEP USING DEVICE
        </div>
      )}
    </>
  );
};
