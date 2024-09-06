import DeleteModal from "@/components/DeleteModal";
import { MotionLi } from "@/components/Motion";
import PlanDrawer from "@/components/PlanDrawer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plan } from "@/server/db/schemas/Plan";
import { validateRequest } from "@/server/utils/auth";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import { FiPlusCircle } from "react-icons/fi";

const page = async () => {
  const session = await validateRequest();
  if (!session.user) redirect("/login");
  const userId = session.user.id;
  const userPlansDocs = await Plan.find({ user_id: userId });
  const userPlans = JSON.parse(JSON.stringify(userPlansDocs));
  console.log(userPlans);
  return (
    <section className="bg-stone-100 min-h-screen px-4 sm:px-6 md:px-8 lg:px-16">
      <div className="flex flex-col sm:flex-row justify-between py-6 sm:py-10 items-start sm:items-end">
        <div className="flex flex-col gap-2 mb-4 sm:mb-0">
          <h1 className="font-mono font-bold text-2xl sm:text-3xl md:text-4xl text-stone-900">
            Your Plans
          </h1>
          <span className="text-sm sm:text-base text-stone-700">
            Pick one of your languages plans and start following the steps
          </span>
        </div>
        <Button asChild className="w-full sm:w-auto">
          <Link
            href={"/dashboard/new-plan"}
            className="flex justify-center sm:justify-between gap-2"
          >
            Add a New Plan <FiPlusCircle />
          </Link>
        </Button>
      </div>
      <ul className="flex flex-col gap-4 py-6 sm:py-8">
        {userPlans.length === 0 ? (
          <Card className="mt-4 sm:mt-8">
            <CardContent className="pt-6">
              <p className="text-center text-sm sm:text-base text-stone-600">
                You haven&apos;t started any language plans yet. Add a new plan
                to begin your learning journey!
              </p>
            </CardContent>
          </Card>
        ) : (
          userPlans.map((plan: any) => (
            <MotionLi
              key={plan._id.toString()}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="bg-white rounded-lg shadow-md hover:shadow-lg duration-300 w-full flex flex-col sm:flex-row justify-between items-start sm:items-center px-4 sm:px-6 py-4 sm:py-5"
            >
              <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start mb-4 sm:mb-0 w-full sm:w-auto">
                <Image
                  src={plan.flag}
                  alt={`${plan.language} Flag`}
                  width={80}
                  height={56}
                  className="object-cover border rounded-lg shadow-sm"
                />
                <div className="flex flex-col items-center sm:items-start">
                  <span className="font-bold text-xl sm:text-lg text-stone-800">
                    {plan.language}
                  </span>
                  <span className="text-sm text-stone-600">
                    Created: {new Date(plan.createdAt).toLocaleDateString()}
                  </span>
                  <span className="text-sm text-stone-600">
                    Steps: {plan.steps.length}
                  </span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <Button asChild variant="outline" className="w-full sm:w-auto">
                  <PlanDrawer plan={plan} />
                </Button>
                <DeleteModal planId={plan._id} />
              </div>
            </MotionLi>
          ))
        )}
      </ul>
    </section>
  );
};

export default page;
