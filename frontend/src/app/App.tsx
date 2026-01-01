import { useState } from "react";

import Home from "../screens/Home";
import Payment from "../screens/Payment";
import Record from "../screens/Record";
import Processing from "../screens/Processing";
import Result from "../screens/Result";
import Offer from "../screens/Offer";
import WhatsApp from "../screens/WhatsApp";
import Exit from "../screens/Exit";

type Screen =
  | "home"
  | "payment"
  | "record"
  | "processing"
  | "result"
  | "offer"
  | "whatsapp"
  | "exit";

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");

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
        <Processing onComplete={() => setScreen("result")} />
      )}

      {screen === "result" && (
        <Result
          onNext={() => setScreen("offer")}
          onRetry={() => setScreen("record")}
        />
      )}

      {screen === "offer" && (
        <Offer onNext={() => setScreen("whatsapp")} />
      )}

      {screen === "whatsapp" && (
        <WhatsApp onNext={() => setScreen("exit")} />
      )}

      {screen === "exit" && (
        <Exit onExit={() => setScreen("home")} />
      )}
    </>
  );
}
