import { useCallback, useState } from "react";

export function useBooleanState(
  dflt?: boolean
): [boolean, () => void, () => void] {
  const [state, setState] = useState(!!dflt);
  const set = useCallback(() => setState(true), []);
  const clear = useCallback(() => setState(false), []);
  return [state, set, clear];
}
