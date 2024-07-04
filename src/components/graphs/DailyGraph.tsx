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
import { FocusableExt } from "../FocusableExt";

export type GraphProps = {
  data: {
    hour: string;
    capacity: number;
    charging: number;
  }[];
};

export const DailyGraph = ({ data }: GraphProps) => {
  return (
    <FocusableExt>
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
            fill={DESATURED_GREEN}
            stroke={DESATURED_GREEN}
          />
          <Bar
            legendType="none"
            maxBarSize={8}
            dataKey="capacity"
            fill={GREEN}
          />
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
    </FocusableExt>
  );
};
