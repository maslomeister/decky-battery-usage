import {
  Bar,
  CartesianGrid,
  ComposedChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

export type GraphProps = {
  data: {
    hour: number;
    charge: number;
  }[];
};

export const DailyGraph = ({ data }: GraphProps) => {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <ComposedChart
        data={data}
        margin={{
          top: 20,
          right: 20,
          left: -20,
        }}
      >
        <CartesianGrid strokeDasharray="1 2" strokeWidth={0.5} />
        <XAxis
          dataKey="hour"
          textAnchor="start"
          axisLine={true}
          tickLine={true}
        />
        <YAxis
          dataKey="charge"
          domain={[0, 100]}
          tickCount={3}
          axisLine={true}
          tickLine={true}
        />
        <Bar legendType="none" dataKey="charge" fill="#00da2c" />
      </ComposedChart>
    </ResponsiveContainer>
  );
};
