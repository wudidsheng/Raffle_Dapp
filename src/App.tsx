import React from "react";
import { ConnectWallet } from "./components/wallet/ConnectWallet";
import { Heard } from "./layout/Heard";
import { Loading } from "./components/common/Loading";
import { Body } from "./layout/Body";

function App() {
  return (
    <React.Fragment>
      <Heard />
      <Body />
    </React.Fragment>
  );
}

export default App;
