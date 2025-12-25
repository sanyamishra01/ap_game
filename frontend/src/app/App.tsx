import { useState } from "react";

import Home from "../screens/Home";
import Payment from "../screens/Payment";
import OfferPayment from "../screens/OfferPayment";
import Record from "../screens/Record";
import Processing from "../screens/Processing";
import Result from "../screens/Result";
import Offer from "../screens/Offer";
import Exit from "../screens/Exit";

import { generateLHI } from "../logic/lhiGenerator";
import { getZone } from "../logic/zonemapping";
import { useLungStore } from "../state/useLungStore";

type Screen =
  | "home"
  | "payment"
  | "record"
  | "processing"
  | "result"
  | "offer"
  | "offer-payment"
  | "exit";

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const setResult = useLungStore((s) => s.setResult);

  const AQI_TODAY = 420;

  const runMockAnalysis = () => {
    const lhi = generateLHI(AQI_TODAY);
    const zone = getZone(lhi);
    setResult(lhi, zone);
  };

  return (
    <>
      {screen === "home" && (
        <Home onStart={() => setScreen("payment")} />
      )}

      {screen === "payment" && (
        <Payment onProceed={() => setScreen("record")} />
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
        <Offer onNext={() => setScreen("offer-payment")} />
      )}

      {screen === "offer-payment" && (
        <OfferPayment onProceed={() => setScreen("exit")} />
      )}

      {screen === "exit" && (
        <Exit onReset={() => setScreen("home")} />
      )}
    </>
  );
}
