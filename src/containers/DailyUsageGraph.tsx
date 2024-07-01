import { useEffect, useState } from "react";
import { DailyGraph } from "../components/graphs/DailyGraph";
import { PanelSection, ServerAPI, Spinner } from "decky-frontend-lib";
import { FocusableExt } from "../components/FocusableExt";
import { BLUE_COLOR, hide_text_on_overflow } from "../styles";
import { HorizontalContainer } from "../components/HorizontalContainer";

type Props = {
  serverApi: ServerAPI;
};

export const DailyUsageGraph = ({ serverApi }: Props) => {
  const [data, setData] = useState<{
    battery_usage: { hour: string; capacity: number }[];
    game_percentage: { game_name: string; percentage: number }[];
  }>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // console.log("mount get data");
    // declare the data fetching function
    const fetchData = async () => {
      const data = await serverApi.callPluginMethod<
        [],
        {
          battery_usage: { hour: string; capacity: number }[];
          game_percentage: { game_name: string; percentage: number }[];
        }
      >("hourly_statistics", {});

      console.log(data);

      if (data.result !== null && typeof data.result === "object") {
        setData(data.result);
        setLoading(false);
      }
    };

    // call the function
    fetchData()
      // make sure to catch any error
      .catch(console.error);
  }, []);

  return (
    <>
      <PanelSection title="Last day usage">
        {loading ? (
          <Spinner />
        ) : (
          <DailyGraph data={data ? data.battery_usage : []} />
        )}
      </PanelSection>

      {data &&
        data.battery_usage &&
        data.battery_usage.length > 0 &&
        data.game_percentage && (
          <PanelSection title="Usage by game">
            {data.game_percentage.map((item) => (
              <FocusableExt>
                <HorizontalContainer>
                  <div style={hide_text_on_overflow}>{item.game_name}</div>
                  <div style={{ fontWeight: 600, color: BLUE_COLOR }}>
                    {item.percentage}%
                  </div>
                </HorizontalContainer>
              </FocusableExt>
            ))}
          </PanelSection>
        )}
    </>
  );
};
