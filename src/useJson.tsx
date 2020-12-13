import { useEffect, useState } from "react";
import axios from "axios";
import { useBooleanState } from "./useBooleanState";

export function useJson<T>(path: string) {
  const [fileContents, setFileContents] = useState<T | undefined>(undefined);
  const [error, setError, clearError] = useBooleanState();
  const [loading, setLoading, clearLoading] = useBooleanState();

  useEffect(() => {
    const read = async () => {
      try {
        clearError();
        setLoading();
        const p = await axios.get(path);
        setFileContents(p.data as T);
      } catch (e) {
        console.log(e);
        setError();
      } finally {
        clearLoading();
      }
    };
    if (path) {
      read();
    }
  }, [clearError, clearLoading, path, setError, setLoading]);

  if (path) {
    return { fileContents, error, loading };
  } else {
    return { fileContents: undefined, loading: false, error: false };
  }
}
