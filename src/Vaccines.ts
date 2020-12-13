type VaccineDescription = {
  name: string;
  disease: string;
  test?: boolean;
};

export const Vaccines: Record<string, VaccineDescription> = {
  pft01: { name: "Pfizer Test Vaccine", disease: "COVID-19", test: true },
};
