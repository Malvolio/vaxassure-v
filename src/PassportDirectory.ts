import { VerificationPair, PassportEntry, Key, VaxRecord } from "./Types";
import { useEncryptedFile } from "./useEncryptedFile";
import { useJson } from "./useJson";
import _ from "lodash";

type PassportDirectory = {
  [vaccine: string]: { [passportId: string]: number };
};

const parseKey = (k: Key) => k.match(/../g)!.join("/");

const root = "https://d-test.vaxassure.me";
// const root = "https://vaxassure-test-data.s3.amazonaws.com";

const passportFileURL = (vp: VerificationPair, name: string) =>
  `${root}/${parseKey(vp.id)}/${name}`;

export const passportEntryURL = (pe: PassportEntry, extension: string) =>
  `${passportFileURL(pe, pe.passportName)}.${extension}`;

const passportDirectoryURL = (vp: VerificationPair) =>
  passportFileURL(vp, "dir.json");

const convert = (s: Buffer) => JSON.parse(s.toString()) as VaxRecord;

export const usePassportInfo = (passportEntry: PassportEntry) => {
  const rv = useEncryptedFile(
    passportEntryURL(passportEntry, "json.x"),
    passportEntry.password,
    convert
  );
  const { fileContents } = rv;
  return {
    ...rv,
    fileContents,
  };
};

const getPassportEntries = (
  pair: VerificationPair,
  fileContents: PassportDirectory
): PassportEntry[] => {
  const passportList = _.sortBy(
    _.flatMap(_.toPairs(fileContents), ([vaccine, entries]) =>
      _.map(
        _.toPairs(entries),
        ([passportName, datetime]) => [datetime, vaccine, passportName] as const
      )
    ),
    ([k1]) => -k1
  );
  const passportEntries = passportList.map(([, vaccine, passportName]) => ({
    ...pair,
    vaccine,
    passportName,
  }));
  return passportEntries;
};

export const usePassportEntries = (pair: VerificationPair) => {
  const { fileContents, loading, error } = useJson<PassportDirectory>(
    passportDirectoryURL(pair)
  );
  if (!fileContents) {
    return { fileContents, loading, error };
  }

  const passportEntries = getPassportEntries(pair, fileContents);

  return { passportEntries, error: "", loading: false };
};
