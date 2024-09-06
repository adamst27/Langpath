import Navigation from "@/components/Navigation";
import React from "react";

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <Navigation />
      <div>{children}</div>
    </>
  );
};

export default layout;
