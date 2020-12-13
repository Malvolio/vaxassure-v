import React, { FC } from "react";
import QrReader from "react-qr-reader";

const onScan = (s: string | null) => {
  if (s) {
    const match = /#.*/.exec(s);
    if (match) {
      window.location.replace(match[0]);
    }
  }
};
export const ScanMode: FC<{}> = () => {
  return (
    <div
      style={{
        flexGrow: 1,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div style={{ width: 250 }}>
        <QrReader onError={console.error} onScan={onScan} />
      </div>
    </div>
  );
};
