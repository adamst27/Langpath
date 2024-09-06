import { MotionDiv } from "@/components/Motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import { MdGTranslate } from "react-icons/md";
import { PiStepsFill } from "react-icons/pi";

const page = () => {
  return (
    <main className="bg-stone-50">
      <MotionDiv
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="flex flex-col justify-center items-center text-center min-h-screen px-4 lg:px-16 gap-6 py-16 relative overflow-hidden"
      >
        <h1 className="text-2xl font-bold lg:text-6xl text-primary">
          Take Your Learning Experience To The Moon Using The Power Of{" "}
          <mark className="bg-transparent text-indigo-600">AI</mark>
        </h1>
        <p className="max-w-[600px] text-stone-600  text-sm md:text-lg">
          Embark on a personalized language learning journey. Create custom
          plans, track progress, and achieve fluency faster than ever before.
        </p>
        <Button asChild>
          <Link href={"/signup"}>Start Your Journey Now</Link>
        </Button>
        <MdGTranslate
          className="absolute bottom-2 left-2 opacity-40 -rotate-12"
          size={250}
        />
        <PiStepsFill
          className="absolute bottom-2 right-2 opacity-40 rotate-12"
          size={250}
        />
      </MotionDiv>
      <MotionDiv
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeIn" }}
      >
        <Image
          src={
            "https://images.pexels.com/photos/1226398/pexels-photo-1226398.jpeg"
          }
          width={1920}
          height={1280}
          alt="Path related Image"
          className="w-full h-auto z-50"
          priority
        />
      </MotionDiv>
    </main>
  );
};

export default page;
