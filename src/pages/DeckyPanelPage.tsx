import { DailyUsageGraph } from "../containers/DailyUsageGraph";
import { ServerAPI } from "decky-frontend-lib";

type Props = {
  serverApi: ServerAPI;
};

export const DeckyPanelPage = ({ serverApi }: Props) => {
  return (
    <div>
      <DailyUsageGraph serverApi={serverApi} />
    </div>
  );
};
