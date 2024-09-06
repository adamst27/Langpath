"use server";

import runChat from "../utils/gemini";
import { Plan } from "../db/schemas/Plan";
import { connectToDB } from "../db/db";
import { validateRequest } from "../utils/auth";
import { revalidatePath } from "next/cache";

export async function generateLangPlan(formData: FormData) {
  const { langName, flag } = Object.fromEntries(formData);
  console.log(flag);
  const prompt = `
        ## Given this language ${langName} Generate to me a step by step plan to learn it.
        # Follow these roles
        - Only give applicable steps that is done done give quotes
        - You have to generate steps as bullets please.
        - Be creative and innovative as much as possible bro.
        - Each step should have substeps.
        - Everything has to be clear and proven scientifically 
        - Steps and substeps have to be abstracted correctly so I can insert to my db correctly 
        - Format the response as a JSON object with the following structure:
          {
            "language": "${langName}",
            "steps": [
              {
                "title": "Step title",
                "substeps": [
                  {
                    "title": "Substep title",
                    "details": ["Detail 1", "Detail 2"]
                  }
                ],
                "importantNote": "Optional important note for the step"
              }
            ]
          }
        - Do not include any markdown formatting, code blocks, or extra characters in your response. Just provide the raw JSON object.
    `;

  try {
    await connectToDB();
    const session = await validateRequest();
    const res = await runChat(prompt);
    const plan = JSON.parse(res);
    const newDoc = new Plan({
      user_id: session.user?.id,
      flag: flag,
      ...plan,
    });
    await newDoc.save();
    revalidatePath("/dashboard");
    return plan;
  } catch (error) {
    console.error("Error parsing or saving plan:", error);
    throw new Error("Failed to generate and save language plan");
  }
}

export async function deleteLangPlan(formData: FormData) {
  const { planId } = Object.fromEntries(formData);
  try {
    await connectToDB();
    const plan = await Plan.findByIdAndDelete(planId);
    if (!plan) {
      throw new Error("Plan not Found");
    }
    revalidatePath("/dashboard/plans");
    return JSON.parse(JSON.stringify(plan));
  } catch (error) {
    console.error(error);
  }
}

export async function markStepDone(planId: string, stepIndex: string) {
  try {
    await connectToDB();
    const plan = await Plan.findById(planId);
    if (!plan) {
      throw new Error("Plan not found");
    }
    const step = plan.steps[parseInt(stepIndex)];
    const allSubstepsDone = step.substeps.every(
      (substep: { isDone: boolean }) => substep.isDone
    );
    if (!allSubstepsDone) {
      throw new Error(
        "Cannot mark step as done until all substeps are completed"
      );
    }
    step.isDone = true;
    await plan.save();
    revalidatePath("/dashboard/plans");
    return JSON.parse(JSON.stringify(plan));
  } catch (error) {
    console.error("Error marking step as done:", error);
    throw new Error("Failed to mark step as done");
  }
}

export async function markSubstepDone(
  planId: string,
  stepIndex: string,
  substepIndex: string
) {
  try {
    await connectToDB();
    const plan = await Plan.findById(planId);
    if (!plan) {
      throw new Error("Plan not found");
    }
    plan.steps[parseInt(stepIndex)].substeps[parseInt(substepIndex)].isDone =
      true;
    await plan.save();
    revalidatePath("/dashboard/plans");
    return JSON.parse(JSON.stringify(plan));
  } catch (error) {
    console.error("Error marking substep as done:", error);
    throw new Error("Failed to mark substep as done");
  }
}

export async function markPlanDone(planId: string) {
  try {
    await connectToDB();
    const plan = await Plan.findById(planId);
    if (!plan) {
      throw new Error("Plan not found");
    }
    const allStepsDone = plan.steps.every(
      (step: { isDone: boolean }) => step.isDone
    );
    if (!allStepsDone) {
      throw new Error("Cannot mark plan as done until all steps are completed");
    }
    plan.isDone = true;
    await plan.save();
    revalidatePath("/dashboard/plans");
    return JSON.parse(JSON.stringify(plan));
  } catch (error) {
    console.error("Error marking plan as done:", error);
    throw new Error("Failed to mark plan as done");
  }
}
