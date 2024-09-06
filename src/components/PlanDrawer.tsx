"use client";
import React from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import {
  markStepDone,
  markSubstepDone,
  markPlanDone,
} from "@/server/actions/user.actions";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ImCheckboxChecked } from "react-icons/im";

const PlanDrawer = ({ plan }: { plan: any }) => {
  const handleStepDone = async (stepIndex: string) => {
    await markStepDone(plan._id, stepIndex);
  };

  const handleSubstepDone = async (stepIndex: string, substepIndex: string) => {
    await markSubstepDone(plan._id, stepIndex, substepIndex);
  };

  const handlePlanDone = async () => {
    await markPlanDone(plan._id);
  };

  const isStepDisabled = (step: any) => {
    return !step.substeps.every((substep: any) => substep.isDone);
  };

  const isPlanDisabled = () => {
    return !plan.steps.every((step: any) => step.isDone);
  };
  const isDone = plan.isDone;
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Open Plan</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="text-2xl font-bold">
            {plan.language} Learning Plan
          </DrawerTitle>
          <DrawerDescription>
            Track your progress and mark steps as completed.
          </DrawerDescription>
        </DrawerHeader>
        <div className="p-4 overflow-y-auto max-h-[70vh]">
          <Accordion type="multiple" className="w-full">
            {plan.steps.map((step: any, stepIndex: number) => (
              <AccordionItem key={stepIndex} value={`item-${stepIndex}`}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center w-full">
                    <Checkbox
                      id={`step-${stepIndex}`}
                      checked={step.isDone}
                      onCheckedChange={() =>
                        handleStepDone(stepIndex.toString())
                      }
                      disabled={isStepDisabled(step)}
                      className="mr-2"
                    />
                    <label
                      htmlFor={`step-${stepIndex}`}
                      className="text-lg font-semibold cursor-pointer flex-grow text-left"
                    >
                      {step.title}
                    </label>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="mt-2 ml-6">
                    {step.substeps.map((substep: any, substepIndex: number) => (
                      <div key={substepIndex} className="mb-2">
                        <div className="flex items-center">
                          <Checkbox
                            id={`substep-${stepIndex}-${substepIndex}`}
                            checked={substep.isDone}
                            onCheckedChange={() =>
                              handleSubstepDone(
                                stepIndex.toString(),
                                substepIndex.toString()
                              )
                            }
                            className="mr-2"
                          />
                          <label
                            htmlFor={`substep-${stepIndex}-${substepIndex}`}
                            className="font-medium"
                          >
                            {substep.title}
                          </label>
                        </div>
                        {substep.details && substep.details.length > 0 && (
                          <ul className="list-disc ml-8 mt-1 text-sm text-gray-600">
                            {substep.details.map(
                              (detail: string, index: number) => (
                                <li key={index}>{detail}</li>
                              )
                            )}
                          </ul>
                        )}
                      </div>
                    ))}
                    {step.importantNote && (
                      <div className="mt-2 p-2 bg-yellow-100 rounded-md">
                        <p className="text-sm font-semibold">Important Note:</p>
                        <p className="text-sm">{step.importantNote}</p>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        <DrawerFooter>
          {isDone ? (
            <Button className="bg-green-600 text-white">Done</Button>
          ) : (
            <Button onClick={handlePlanDone}>Mark Plan as Complete</Button>
          )}
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default PlanDrawer;
