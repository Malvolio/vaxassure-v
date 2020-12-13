import React, { FC, useCallback } from "react";
import { Button } from "./Button";

const useGoto = (hash: string) => {
  return useCallback(() => {
    window.location.replace(`#${hash}`);
  }, [hash]);
};
export const ControlPanel: FC<{ scanMode: boolean; home: boolean }> = ({
  scanMode,
  home,
}) => {
  const onCancel = useGoto("");
  const onScan = useGoto("scan");
  return (
    <div>
      {scanMode && <Button onClick={onCancel}>Cancel</Button>}
      {!scanMode && <Button onClick={onScan}>Scan {!home && "More"} </Button>}
    </div>
  );
};
