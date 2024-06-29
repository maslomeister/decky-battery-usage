import { useEffect, useState } from "react";
import { DailyGraph } from "../components/graphs/DailyGraph";
import { call } from "@decky/api";

export const DailyUsageGraph = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // declare the data fetching function
    const fetchData = async () => {
      const data = await call("hourly_statistics");
      setData(data);
    };

    // call the function
    fetchData()
      // make sure to catch any error
      .catch(console.error);
  }, []);

  return (
    <div>
      <DailyGraph data={data} />
    </div>
  );
};
