import React, { FC } from "react";

export const HomePage: FC<{}> = () => (
  <div
    style={{
      flexGrow: 1,
      maxWidth: "70%",
      margin: "auto",
      textAlign: "left",
      paddingTop: "40px",
    }}
  >
    This is the VaxAssure&trade; scan tool. If you need to know the vaccination
    history of another person, ask that person to show you their
    VaxAssure&trade; passport, press the “Scan” button below. If the passport
    has been activated, a vaccination history will be displayed on the screen.
    If the photograph matches the face of the person in front of you, you can be
    confident they have been vaccinated.
  </div>
);
