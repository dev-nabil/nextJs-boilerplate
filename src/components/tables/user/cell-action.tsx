"use client";

import AlertModal from "@/components/custom/alert-modal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUpdateUserMutation } from "@/store/features/user/userApi";
import { Ban, CheckCircle, CreditCard, MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface CellActionProps {
  data: any;
}

export default function CellAction({ data }: CellActionProps) {
  const router = useRouter();

  const [updateUser] = useUpdateUserMutation();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const isSeller = data.role === "seller";
  const hasNid = isSeller && (data.nid || data.nidFront || data.nidBack);

  const handleBanToggle = async () => {
    try {
      setLoading(true);
      await updateUser({
        id: data.id,
        data: { blocked: !data.blocked },
      }).unwrap();

      toast.success(
        `User ${data.blocked ? "unbanned" : "banned"} successfully.`
      );

      router.refresh();
    } catch (error: any) {
      toast.error(error.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleBanToggle}
        loading={loading}
        title={data.blocked ? "Unban User" : "Ban User"}
        description={`Are you sure you want to ${data.blocked ? "unban" : "ban"} this user? ${
          !data.blocked
            ? "They will no longer be able to access the platform."
            : "This will restore their access to the platform."
        }`}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuItem onClick={data.onViewNid}>
            <CreditCard className="mr-2 h-4 w-4" />
            View NID
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setOpen(true)}>
            {data.blocked ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Unban User
              </>
            ) : (
              <>
                <Ban className="mr-2 h-4 w-4" />
                Ban User
              </>
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
