import { useEffect, useState } from "react";
import { DailyGraph } from "../components/graphs/DailyGraph";
import {
  Field,
  PanelSection,
  PanelSectionRow,
  ServerAPI,
  Spinner,
} from "decky-frontend-lib";
import { BLUE_COLOR } from "../styles";

type Props = {
  serverApi: ServerAPI;
};

export const DailyUsageGraph = ({ serverApi }: Props) => {
  const [data, setData] = useState<{
    battery_usage: { hour: string; capacity: number; charging: number }[];
    game_percentage: {
      games: { game_name: string; percentage: number }[];
      suspended: number;
    };
  }>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // console.log("mount get data");
    // declare the data fetching function
    const fetchData = async () => {
      const data = await serverApi.callPluginMethod<
        [],
        {
          battery_usage: { hour: string; capacity: number; charging: number }[];
          game_percentage: {
            games: { game_name: string; percentage: number }[];
            suspended: number;
          };
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
          <div
            style={{
              display: "flex",
              justifyItems: "center",
              alignItems: "center",
            }}
          >
            <Spinner style={{ maxWidth: "32px", maxHeight: "32px" }} />
          </div>
        ) : (
          <DailyGraph data={data ? data.battery_usage : []} />
        )}
      </PanelSection>

      {data &&
        data.battery_usage &&
        data.battery_usage.length > 0 &&
        data.game_percentage && (
          <PanelSection title="Usage by game">
            {data.game_percentage.games.map((item) => (
              <PanelSectionRow>
                <Field
                  label={item.game_name}
                  inlineWrap="keep-inline"
                  focusable
                >
                  <div style={{ fontWeight: 600, color: BLUE_COLOR }}>
                    {item.percentage}%
                  </div>
                </Field>
              </PanelSectionRow>
            ))}
            {data.game_percentage.suspended > 0 && (
              <div style={{ fontWeight: 600 }}>
                <PanelSectionRow>
                  <Field inlineWrap="keep-inline" label="SUSPENDED" focusable>
                    {data.game_percentage.suspended}%
                  </Field>
                </PanelSectionRow>
              </div>
            )}
          </PanelSection>
        )}
    </>
  );
};
