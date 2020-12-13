/* eslint-disable @typescript-eslint/no-redeclare */
import { Brand, make } from "ts-brand";

export type Key = Brand<string, "Key">;
export const Key = make<Key>();

export type VerificationPair = {
  id: Key;
  password: Key;
};
export type PassportEntry = VerificationPair & {
  vaccine: string;
  passportName: string;
};
export type VaxRecord = {
  administered: number;
  vaccine: string;
};
