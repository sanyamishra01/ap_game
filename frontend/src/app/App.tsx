import { useState } from "react";

import Home from "../screens/Home";
import Payment from "../screens/20rsPayment";
import Record from "../screens/Record";
import Processing from "../screens/Processing";
import Result from "../screens/Result";
import Offer from "../screens/Offer";
import Exit from "../screens/Exit";

import { generateLHI } from "../logic/lhiGenerator";
import { getZone } from "../logic/zonemapping";
import { useLungStore } from "../state/useLungStore";

/**
 * Screen flow enum
 * Keeps navigation deterministic and readable
 */
type Screen =
  | "home"
  | "20rspayment"
  | "record"
  | "processing"
  | "result"
  | "offer"
  | "exit";

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const setResult = useLungStore((s) => s.setResult);

  // Mock AQI (can later be dynamic / fetched)
  const AQI_TODAY = 420;

  /**
   * Called after recording + processing
   * This simulates the AI analysis step
   */
  const runMockAnalysis = () => {
    const lhi = generateLHI(AQI_TODAY);
    const zone = getZone(lhi);
    setResult(lhi, zone);
  };

  return (
    <>
      {screen === "home" && (
        <Home onStart={() => setScreen("20rspayment")} />
      )}

      {screen === "20rspayment" && (
        <Home onStart={() => setScreen("record")} />
      )}

      {screen === "record" && (
        <Record onComplete={() => setScreen("processing")} />
      )}

      {screen === "processing" && (
        <Processing
          onComplete={() => {
            runMockAnalysis();
            setScreen("result");
          }}
        />
      )}

      {screen === "result" && (
        <Result onNext={() => setScreen("offer")} />
      )}

      {screen === "offer" && (
        <Offer onNext={() => setScreen("exit")} />
      )}

      {screen === "exit" && (
        <Exit onReset={() => setScreen("home")} />
      )}
    </>
  );
}
