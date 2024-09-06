import React from "react";
import {
  Dialog,
  DialogClose,
  DialogFooter,
  DialogTrigger,
  DialogContent,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { deleteLangPlan } from "@/server/actions/user.actions";

const DeleteModal = ({ planId }: { planId: string }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">Delete</Button>
      </DialogTrigger>
      <DialogContent>
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-bold text-stone-900">Are you sure?</h2>
          <p className="text-lg text-stone-700">
            Deleting the plan will result in losing all your progress.
          </p>
        </div>
        <div className="flex flex-row gap-2">
          <form action={deleteLangPlan}>
            <input type="hidden" readOnly name="planId" value={planId} />
            <Button variant="destructive" type="submit">
              Delete
            </Button>
          </form>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteModal;
