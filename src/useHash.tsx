import { useEffect, useState } from "react";
const cleanHash = (s: string) => s.replace(/^#/, "");

export function useHash() {
  const [anchor, setAnchor] = useState(cleanHash(window.location.hash));
  useEffect(() => {
    const f = () => {
      setAnchor(cleanHash(window.location.hash));
    };
    window.addEventListener("hashchange", f);
    return () => {
      window.removeEventListener("hashchange", f);
    };
  }, [setAnchor]);
  return anchor;
}
