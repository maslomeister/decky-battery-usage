import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { DESATURED_GREEN, GREEN } from "../../styles";
import { VerticalContainer } from "../VerticalContainer";

export type GraphProps = {
  data: {
    hour: string;
    capacity: number;
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
          <CartesianGrid strokeDasharray="1 2" strokeWidth={0.5} />
          <XAxis
            dataKey="hour"
            textAnchor="start"
            axisLine={true}
            tickLine={true}
          />
          <YAxis
            dataKey="capacity"
            domain={[0, 100]}
            tickCount={3}
            axisLine={true}
            tickLine={true}
          />
          <Area
            type="stepBefore"
            dataKey="charging"
            fill={DESATURED_GREEN}
            stroke={DESATURED_GREEN}
          />
          <Bar legendType="none" dataKey="capacity" fill={GREEN} />
        </ComposedChart>
      </ResponsiveContainer>
      {data.length === 0 && (
        <VerticalContainer>
          <div style={{ fontSize: "14px", textAlign: "center" }}>
            NOT ENOUGH DATA COLLECTED
          </div>
          <div style={{ fontSize: "14px", textAlign: "center" }}>
            KEEP USING DEVICE
          </div>
        </VerticalContainer>
      )}
    </>
  );
};
