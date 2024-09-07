import { MotionDiv } from "@/components/Motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import { MdGTranslate } from "react-icons/md";
import { PiStepsFill } from "react-icons/pi";
import { validateRequest } from "@/server/utils/auth";
import { redirect } from "next/navigation";

const page = async () => {
  const session = await validateRequest();
  if (session.user) redirect("/dashboard");
  return (
    <main className="bg-stone-50">
      <MotionDiv
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="flex flex-col justify-center items-center text-center min-h-screen px-4 sm:px-6 lg:px-16 gap-4 sm:gap-6 py-8 sm:py-16 relative overflow-hidden"
      >
        <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-6xl font-bold text-primary">
          Take Your Learning Experience To The Moon Using The Power Of{" "}
          <mark className="bg-transparent text-indigo-600">AI</mark>
        </h1>
        <p className="max-w-[600px] text-stone-600 text-xs sm:text-sm md:text-lg">
          Embark on a personalized language learning journey. Create custom
          plans, track progress, and achieve fluency faster than ever before.
        </p>
        <Button asChild className="mt-2 sm:mt-4">
          <Link href={"/signup"}>Start Your Journey Now</Link>
        </Button>
        <MdGTranslate className="absolute bottom-2 left-2 opacity-40 -rotate-12 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64" />
        <PiStepsFill className="absolute bottom-2 right-2 opacity-40 rotate-12 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64" />
      </MotionDiv>
      <MotionDiv
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeIn" }}
      >
        <div className="relative w-full h-48 sm:h-64 md:h-80 lg:h-96">
          <Image
            src={
              "https://images.pexels.com/photos/1226398/pexels-photo-1226398.jpeg"
            }
            layout="fill"
            objectFit="cover"
            alt="Path related Image"
            className="z-50"
            priority
          />
        </div>
      </MotionDiv>
    </main>
  );
};

export default page;
