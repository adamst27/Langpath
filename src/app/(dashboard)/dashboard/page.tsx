import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plan } from "@/server/db/schemas/Plan";
import { validateRequest } from "@/server/utils/auth";
import { redirect } from "next/navigation";
import React from "react";
import {
  FaLanguage,
  FaCheckCircle,
  FaChartLine,
  FaCalendarAlt,
  FaQuoteLeft,
} from "react-icons/fa";
import { Progress } from "@/components/ui/progress";
import runChat from "@/server/utils/gemini";

const page = async () => {
  const session = await validateRequest();
  if (!session.user) redirect("/login");
  const userId = session.user.id;
  const userPlans = await Plan.find({ user_id: userId });
  const prompt = `
      ## Generate three quotes to get motivated to leatn a language 
      # Follow these rules: 
      -they should be informative to improve the process not to slow it down
      -they should be very carefully curated
      -the response should be an array of strings without any markdown or additional text
  `;
  const quotesResp = await runChat(prompt);
  const quotes = JSON.parse(quotesResp);
  if (!userPlans || userPlans.length == 0) redirect("/dashboard/new-plan");

  const calculateTotalProgress = () => {
    let totalProgress = 0;
    userPlans.forEach((plan) => {
      const planProgress = calculatePlanProgress(plan);
      totalProgress += planProgress;
    });
    return Math.round(totalProgress / userPlans.length);
  };

  const calculatePlanProgress = (plan: any) => {
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

  const getMostRecentPlan = () => {
    return userPlans.reduce((latest, current) =>
      new Date(current.createdAt) > new Date(latest.createdAt)
        ? current
        : latest
    );
  };

  const totalProgress = calculateTotalProgress();
  const mostRecentPlan = getMostRecentPlan();

  return (
    <>
      {" "}
      <main className="bg-stone-100 min-h-screen px-6 lg:px-16">
        <div className="font-mono py-4 lg:py-10 text-stone-900">
          <h1 className="font-bold text-2xl lg:text-4xl mb-2">
            Welcome to LangPath!
          </h1>
          <p className="text-sm lg:text-base">
            Your personalized language learning journey starts here. LangPath
            helps you create, track, and achieve your language learning goals
            with customized plans and progress tracking.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Languages Count
              </CardTitle>
              <FaLanguage className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userPlans.length}</div>
              <p className="text-xs text-muted-foreground">
                {userPlans.map(
                  (plan, index) =>
                    plan.language +
                    (index === userPlans.length - 1 ? "." : ", ")
                )}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Overall Progress
              </CardTitle>
              <FaChartLine className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(totalProgress)}%
              </div>
              <Progress value={totalProgress} className="mt-2" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Most Recent Plan
              </CardTitle>
              <FaCalendarAlt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mostRecentPlan.language}
              </div>
              <p className="text-xs text-muted-foreground">
                Started on{" "}
                {new Date(mostRecentPlan.createdAt).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
          <Card className="col-span-1 md:col-span-2 lg:col-span-3">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Language Plan Progress
              </CardTitle>
              <FaCheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {userPlans.map((plan) => (
                  <div key={plan._id} className="flex flex-col">
                    <span className="text-sm font-medium">{plan.language}</span>
                    <Progress
                      value={calculatePlanProgress(plan)}
                      className="mt-2"
                    />
                    <span className="text-xs text-muted-foreground mt-1">
                      {Math.round(calculatePlanProgress(plan))}% Complete
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="col-span-1 md:col-span-2 lg:col-span-3">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Motivational Quotes
              </CardTitle>
              <FaQuoteLeft className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
                {quotes.map((quote: string, index: number) => (
                  <div key={index} className="bg-white p-4 rounded-lg shadow">
                    <p className="text-sm italic">&ldquo;{quote}&rdquo;</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
};

export default page;
