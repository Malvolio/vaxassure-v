import axios from "axios";
import * as Crypto from "crypto-js";

import { useEffect, useState } from "react";
// import { convertWordArrayToUint8Array } from "./crypt/convert";
// import JsonFormatter from "./crypt/JsonFormatter";
import { useBooleanState } from "./useBooleanState";

type Converter<T> = (v: Buffer) => T | Promise<T>;

function convertWordArrayToUint8Array(wordArray: Crypto.lib.WordArray) {
  const l = wordArray.sigBytes;
  const words = wordArray.words;
  const result = new Uint8Array(l);
  let i = 0 /*dst*/,
    j = 0; /*src*/
  while (true) {
    // here i is a multiple of 4
    if (i === l) break;
    var w = words[j++];
    result[i++] = (w & 0xff000000) >>> 24;
    if (i === l) break;
    result[i++] = (w & 0x00ff0000) >>> 16;
    if (i === l) break;
    result[i++] = (w & 0x0000ff00) >>> 8;
    if (i === l) break;
    result[i++] = w & 0x000000ff;
  }
  return result;
}

const JsonFormatter = {
  stringify: (cipherParams: Crypto.lib.CipherParams) => {
    // create json object with ciphertext
    const ciphertext = {
      ct: cipherParams.ciphertext.toString(Crypto.enc.Base64),
    };
    // optionally add iv or salt
    const iv = cipherParams.iv ? { iv: cipherParams.iv.toString() } : {};
    const salt = cipherParams.salt ? { s: cipherParams.salt.toString() } : {};

    // stringify json object
    return JSON.stringify(Object.assign({}, ciphertext, iv, salt));
  },
  parse: (jsonStr: string) => {
    // parse json string
    const jsonObj = JSON.parse(jsonStr);
    // extract ciphertext from json object, and create cipher params object
    const cipherParams = Crypto.lib.CipherParams.create({
      ciphertext: Crypto.enc.Base64.parse(jsonObj.ct),
    });
    // optionally extract iv or salt
    if (jsonObj.iv) {
      cipherParams.iv = Crypto.enc.Hex.parse(jsonObj.iv);
    }
    if (jsonObj.s) {
      cipherParams.salt = Crypto.enc.Hex.parse(jsonObj.s);
    }
    return cipherParams;
  },
};

export function useEncryptedFile<T = Buffer>(
  path: string,
  password: string,
  converter?: Converter<T>
) {
  const [fileContents, setFileContents] = useState<T | undefined>(undefined);
  const [error, setError, clearError] = useBooleanState();
  const [loading, setLoading, clearLoading] = useBooleanState();

  useEffect(() => {
    const read = async () => {
      try {
        clearError();
        setLoading();
        const response = await axios.get(path, {
          responseType: "arraybuffer",
        });
        const b = Buffer.from(response.data, "binary");
        const contents = Crypto.AES.decrypt(b.toString(), password, {
          format: JsonFormatter,
        });
        const plainText = Buffer.from(convertWordArrayToUint8Array(contents));
        setFileContents(
          converter ? await converter(plainText) : ((plainText as unknown) as T)
        );
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
  }, [
    clearError,
    clearLoading,
    converter,
    password,
    path,
    setError,
    setLoading,
  ]);

  if (path) {
    return { fileContents, error, loading };
  } else {
    return { fileContents: undefined, loading: false, error: false };
  }
}
