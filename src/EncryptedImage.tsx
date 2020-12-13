import React, { FC, CSSProperties } from "react";
import bufferToDataUrl from "buffer-to-data-url";
import { useEncryptedFile } from "./useEncryptedFile";

const convert = async (s: Buffer) => await bufferToDataUrl("image/png", s);
export const EncryptedImage: FC<{
  src: string;
  password: string;
  sx?: CSSProperties;
}> = ({ src, password, sx = {} }) => {
  const { fileContents, loading, error } = useEncryptedFile(
    src,
    password,
    convert
  );

  return error ? (
    <span>!</span>
  ) : !fileContents || loading ? (
    <span>?</span>
  ) : (
    <img style={sx} src={fileContents} alt="" />
  );
};
