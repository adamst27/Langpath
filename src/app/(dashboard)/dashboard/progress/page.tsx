import { Plan } from "@/server/db/schemas/Plan";
import { validateRequest } from "@/server/utils/auth";
import { redirect } from "next/navigation";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FiPlusCircle } from "react-icons/fi";
import { MotionDiv } from "@/components/Motion";
import Image from "next/image";

const page = async () => {
  const session = await validateRequest();
  if (!session.user) redirect("/login");
  const userId = session.user.id;
  const userPlansDocs = await Plan.find({ user_id: userId });
  const userPlans = JSON.parse(JSON.stringify(userPlansDocs));

  const calculateProgress = (plan: any) => {
    let totalItems = 0;
    let completedItems = 0;

    plan.steps.forEach((step: any) => {
      totalItems += 1; // Count the step itself
      if (step.isDone) completedItems += 1;

      step.substeps.forEach((substep: any) => {
        totalItems += 1; // Count each substep
        if (substep.isDone) completedItems += 1;
      });
    });

    return (completedItems / totalItems) * 100;
  };

  const getStatus = (progress: number) => {
    if (progress === 0) return "Not Started";
    if (progress === 100) return "Completed";
    return "In Progress";
  };

  return (
    <section className="bg-stone-100 min-h-screen px-4 sm:px-6 md:px-8 lg:px-16">
      <div className="flex flex-col sm:flex-row justify-between py-6 sm:py-10 items-start sm:items-end">
        <div className="flex flex-col gap-2 mb-4 sm:mb-0">
          <h1 className="font-mono font-bold text-2xl sm:text-3xl md:text-4xl text-stone-900">
            Your Progress
          </h1>
          <span className="text-sm sm:text-base text-stone-700">
            Track your language learning journey
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

      {userPlans.length === 0 ? (
        <Card className="mt-4 sm:mt-8">
          <CardContent className="pt-6">
            <p className="text-center text-sm sm:text-base text-stone-600">
              You haven&apos;t started any language plans yet. Add a new plan to
              begin your learning journey!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 py-6 sm:py-8">
          {userPlans.map((plan: any) => {
            const progress = calculateProgress(plan);
            const status = getStatus(progress);

            return (
              <MotionDiv
                key={plan._id}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-4">
                      <Image
                        src={plan.flag}
                        alt={`${plan.language} Flag`}
                        width={40}
                        height={28}
                        className="w-8 h-6 sm:w-10 sm:h-7 object-cover rounded shadow-sm"
                      />
                      <span className="text-base sm:text-lg">
                        {plan.language}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Progress value={progress} className="mb-3 sm:mb-4" />
                    <div className="flex justify-between text-xs sm:text-sm text-stone-600">
                      <span>Progress: {Math.round(progress)}%</span>
                      <span>Status: {status}</span>
                    </div>
                  </CardContent>
                </Card>
              </MotionDiv>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default page;
