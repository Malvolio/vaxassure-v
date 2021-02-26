import React, { FC } from "react";
import "./App.css";
import moment from "moment";
import { useHash } from "./useHash";
import { EncryptedImage } from "./EncryptedImage";
import {
  passportEntryURL,
  usePassportEntries,
  usePassportInfo,
} from "./PassportDirectory";
import { VerificationPair, PassportEntry, Key } from "./Types";
import { Vaccines } from "./Vaccines";
import { ScanMode } from "./ScanMode";
import { ControlPanel } from "./ControlPanel";
import { HomePage } from "./HomePage";
import { useAntiPhishingColors } from "./useAntiPhishingColors";

// const NotFound: FC<{}> = () => <h2>No such vaccination</h2>;
const Loading: FC<{}> = () => <h2>Loading</h2>;
const Warning: FC<{}> = () => {
  const [color, backgroundColor] = useAntiPhishingColors();
  return (
    <div
      style={{
        width: "100%",
        backgroundColor,
        color,
        padding: "5px 0",
        fontWeight: 600,
        fontSize: "15px",
      }}
    >
      Protect against fraud: check that the URL is{" "}
      <span style={{ fontFamily: "monospace", fontSize: "16px" }}>
        https://vaxassure.me
      </span>
      !
    </div>
  );
};

const PassportImage: FC<{ passportEntry: PassportEntry }> = ({
  passportEntry,
}) => (
  <EncryptedImage
    sx={{ borderRadius: 8 }}
    src={passportEntryURL(passportEntry, "jpg.x")}
    password={passportEntry.password}
  />
);

const Passport: FC<{ passportEntry: PassportEntry }> = ({ passportEntry }) => {
  const { fileContents: vaxRecord } = usePassportInfo(passportEntry);

  if (!vaxRecord) {
    return null;
  }
  const { administered, vaccine } = vaxRecord;
  if (!Vaccines[vaccine]) {
    return null;
  }
  const admin = moment(administered);
  const { name, disease, test } = Vaccines[vaccine];
  return (
    <div
      style={{
        margin: 10,
        borderRadius: 8,
        backgroundColor: "white",
        boxShadow: "8px 6px 5px 6px #ccc",
        display: "flex",
        flexDirection: "row",
        padding: 4,
        alignItems: "center",
      }}
    >
      <PassportImage passportEntry={passportEntry} />
      <div style={{ flexGrow: 1 }}>
        <h3 style={{ margin: 5 }}>
          This person was vaccinated against {disease}
        </h3>
        <div>
          {admin.format("MMM Do YYYY, h:mma")} ({admin.fromNow()})
        </div>
        <div>{name}</div>
        {test && <h3 style={{ margin: 5, color: "red" }}>Test Only</h3>}
      </div>
    </div>
  );
};

const VerificationPairRE = /^v\/([a-z0-9]{10,})\/([a-z0-9-_]{10,})$/i;

const getVerificationPair = (path: string): VerificationPair | null => {
  const match = VerificationPairRE.exec(path);
  if (!match) return null;
  return { id: Key(match[1]), password: Key(match[2]) };
};

const InvalidPair: FC<{}> = () => <p>Invalid Pair</p>;
const Passports: FC<{ pair: VerificationPair }> = ({ pair }) => {
  const { passportEntries, error, loading } = usePassportEntries(pair);

  return error ? (
    <InvalidPair />
  ) : loading || !passportEntries ? (
    <Loading />
  ) : (
    <div
      style={{
        margin: 10,
        borderRadius: 8,
        backgroundColor: "#eee",
        flexGrow: 1,
        overflowX: "hidden",
        overflowY: "auto",
      }}
    >
      {passportEntries.map((passportEntry, idx) => (
        <Passport key={idx} passportEntry={passportEntry} />
      ))}
    </div>
  );
};

function App() {
  const hash = useHash();
  const scanMode = hash === "scan";
  const pair = !scanMode && getVerificationPair(hash);
  return (
    <div className="App">
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <Warning />
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src="./logo-color.svg"
            alt=""
            style={{ height: 48, margin: 5 }}
          />
          <span style={{ fontFamily: '"Cinzel"', fontSize: 28 }}>
            VaxAssure
          </span>
          &trade;
        </div>
        {pair && <Passports pair={pair} />}
        {scanMode && <ScanMode />}
        {!scanMode && !pair && <HomePage />}

        <ControlPanel scanMode={scanMode} home={!pair} />
      </div>
    </div>
  );
}

export default App;
