import React, { FC } from "react";

export const Button: FC<{
  onClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}> = ({ onClick, children }) => (
  <div
    onClick={onClick}
    style={{
      display: "inline-block",
      margin: 5,
      padding: "2px 5px",
      border: "thin solid darkgray",
      borderRadius: 4,
    }}
  >
    {children}
  </div>
);
