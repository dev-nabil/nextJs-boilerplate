"use client";

import React, { useState } from "react";

import Link from "next/link";

import { Pencil, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { useAuth } from "@/hooks/use-auth";

import routes from "@/routes";
import { useDeleteFaqMutation } from "@/store/features/faq/faqApi";
import toast from "react-hot-toast";

export const CellAction = ({ id }: { id: string }) => {
  const [deleteFaq] = useDeleteFaqMutation();
  const [open, setOpen] = React.useState(false);
  const { user } = useAuth();

  const [isPopoverOpen, setPopoverOpen] = useState<boolean | any>(false);
  const [isDeleteBlogLoading, setIsDeleteBlogLoading] =
    useState<boolean>(false);
  const handleDelete = async () => {
    setIsDeleteBlogLoading(true);
    try {
      deleteFaq(id).then(() => {
        toast.success("FAQ deleted successfully");
        setIsDeleteBlogLoading(false);
      });
    } catch (error) {
      toast.error("Something went wrong");
    }
    setPopoverOpen(false);
  };

  return (
    <div className="flex items-center justify-end gap-3">
      <Link href={routes.admin.faq.edit(id as string)}>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => setOpen(true)}
        >
          <Pencil className="size-4 text-blue-400" />
        </Button>
      </Link>

      <Popover open={isPopoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <Button size="icon" variant="outline">
            <Trash className="size-4 text-red-500" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72 bg-white" align="start" side="left">
          <>
            <p>Are you sure you want to delete?</p>

            <div className="my-3 flex justify-end gap-3">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setPopoverOpen(false);
                }}
              >
                No
              </Button>
              {isDeleteBlogLoading === false ? (
                <Button size="sm" variant="destructive" onClick={handleDelete}>
                  Yes
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="destructive"
                  disabled={isDeleteBlogLoading}
                >
                  Loading...
                </Button>
              )}
            </div>
          </>
        </PopoverContent>
      </Popover>
    </div>
  );
};
