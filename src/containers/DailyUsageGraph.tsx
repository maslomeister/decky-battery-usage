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
import { FaHourglassHalf, FaPercentage } from "react-icons/fa";

type Props = {
  serverApi: ServerAPI;
};

export const DailyUsageGraph = ({ serverApi }: Props) => {
  const [data, setData] = useState<{
    battery_usage: { hour: string; capacity: number; charging: number }[];
    games_stats: {
      games: { game_name: string; percentage: number; hours: string }[];
      suspended: { percentage: number; hours: string };
    };
  }>();
  const [loading, setLoading] = useState(true);
  const [showHours, setShowHours] = useState(false);

  useEffect(() => {
    // console.log("mount get data");
    // declare the data fetching function
    const fetchData = async () => {
      const data = await serverApi.callPluginMethod<
        [],
        {
          battery_usage: { hour: string; capacity: number; charging: number }[];
          games_stats: {
            games: { game_name: string; percentage: number; hours: string }[];
            suspended: { percentage: number; hours: string };
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
              justifyContent: "center",
              alignItems: "center",
              height: "128px",
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
        data.games_stats && (
          <PanelSection>
            <PanelSectionRow>
              <Field
                bottomSeparator="none"
                description="Press to change"
                label={<div style={{ fontWeight: 600 }}>USAGE BY GAME</div>}
                onClick={() => {
                  setShowHours(!showHours);
                }}
              >
                {showHours ? <FaHourglassHalf /> : <FaPercentage />}
              </Field>
            </PanelSectionRow>
            {data.games_stats.games.map((item) => (
              <PanelSectionRow>
                <Field
                  label={item.game_name}
                  inlineWrap="keep-inline"
                  onClick={() => {
                    setShowHours(!showHours);
                  }}
                >
                  <div style={{ fontWeight: 600, color: BLUE_COLOR }}>
                    {showHours ? item.hours : item.percentage + "%"}
                  </div>
                </Field>
              </PanelSectionRow>
            ))}
            {data.games_stats.suspended.percentage > 0 && (
              <div style={{ fontWeight: 600 }}>
                <PanelSectionRow>
                  <Field
                    inlineWrap="keep-inline"
                    label="SUSPENDED"
                    onClick={() => {
                      setShowHours(!showHours);
                    }}
                  >
                    {showHours
                      ? data.games_stats.suspended.hours
                      : data.games_stats.suspended.percentage + "%"}
                  </Field>
                </PanelSectionRow>
              </div>
            )}
          </PanelSection>
        )}
    </>
  );
};
