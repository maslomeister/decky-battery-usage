import { useEffect, useState } from "react";
import { DailyGraph } from "../components/graphs/DailyGraph";
import {
  Field,
  PanelSection,
  PanelSectionRow,
  ServerAPI,
  Spinner,
} from "decky-frontend-lib";
import { BLUE_COLOR, unstyled_p } from "../styles";
import { MdElectricBolt, MdPercent } from "react-icons/md";
import { VerticalContainer } from "../components/VerticalContainer";
import { HorizontalContainer } from "../components/HorizontalContainer";

type Props = {
  serverApi: ServerAPI;
};

export const DailyUsageGraph = ({ serverApi }: Props) => {
  const [data, setData] = useState<{
    battery_usage: { hour: string; capacity: number; charging: number }[];
    games_stats: {
      games: { game_name: string; percentage: number; watts: number }[];
    };
  }>();
  const [loading, setLoading] = useState(true);
  const [showWatts, setShowWatts] = useState(false);

  useEffect(() => {
    // console.log("mount get data");
    // declare the data fetching function
    const fetchData = async () => {
      const data = await serverApi.callPluginMethod<
        [],
        {
          battery_usage: { hour: string; capacity: number; charging: number }[];
          games_stats: {
            games: { game_name: string; percentage: number; watts: number }[];
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
                description={
                  <HorizontalContainer>
                    <p style={unstyled_p}>Press to change</p>
                    <p style={unstyled_p}>
                      {showWatts ? "Average" : "Overall"}
                    </p>
                  </HorizontalContainer>
                }
                label={<div style={{ fontWeight: 600 }}>USAGE BY GAME</div>}
                onClick={() => {
                  setShowWatts(!showWatts);
                }}
              >
                {showWatts ? <MdElectricBolt /> : <MdPercent />}
              </Field>
            </PanelSectionRow>
            {data.games_stats.games.map((item) => (
              <PanelSectionRow>
                <Field
                  label={item.game_name}
                  inlineWrap="keep-inline"
                  onClick={() => {
                    setShowWatts(!showWatts);
                  }}
                >
                  <p
                    style={{
                      ...unstyled_p,
                      fontWeight: 600,
                      color: BLUE_COLOR,
                    }}
                  >
                    {showWatts ? (
                      <>
                        {"~" + item.watts}
                        <span
                          style={{ fontSize: "10px", verticalAlign: "top" }}
                        >
                          W
                        </span>
                      </>
                    ) : (
                      item.percentage + "%"
                    )}
                  </p>
                </Field>
              </PanelSectionRow>
            ))}
            {!showWatts && data.games_stats.games.length === 0 && (
              <VerticalContainer>
                <div style={{ fontSize: "14px", textAlign: "center" }}>
                  NO BATTERY USAGE DETECTED
                </div>
              </VerticalContainer>
            )}
          </PanelSection>
        )}
    </>
  );
};
