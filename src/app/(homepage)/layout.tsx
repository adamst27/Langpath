import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import { FaLanguage } from "react-icons/fa";

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <header className="px-4 lg:px-6 h-16 flex items-center justify-between bg-white/80 backdrop-blur-sm fixed w-full z-10">
        <Link href="#" className="flex items-center justify-center space-x-2">
          <FaLanguage className="h-8 w-8 text-primary" />
          <span className="font-bold text-xl text-gray-900">LangPath</span>
        </Link>
        <Button asChild variant="outline">
          <Link href={"/login"}>Login</Link>
        </Button>
      </header>
      <div>{children}</div>
    </>
  );
};

export default layout;
