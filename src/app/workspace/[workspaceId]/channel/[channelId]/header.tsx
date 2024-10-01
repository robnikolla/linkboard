import { useState } from "react";
import { useRouter } from "next/navigation";
import { TrashIcon } from "lucide-react";
import { FaChevronDown } from "react-icons/fa";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useUpdateChannel } from "@/features/channels/api/use-update-channel";
import { useRemoveChannel } from "@/features/channels/api/use-remove-channel";

import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useChannelId } from "@/hooks/use-channel-id";
import { useConfirm } from "@/hooks/use-confirm";

interface HeaderProps {
  title: string;
}

export const Header = ({ title }: HeaderProps) => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const [value, setValue] = useState(title);
  const [editOpen, setEditOpen] = useState(false);
  const [ConfirmDialog, confirm] = useConfirm(
    "Delete this channel",
    "You are about to delete this channel, this action is irreversible"
  );

  const channelId = useChannelId();
  const { data: member } = useCurrentMember({ workspaceId });
  const { mutate: updateChannel, isPending: isUpdatingChannel } =
    useUpdateChannel();
  const { mutate: removeChannel, isPending: isRemovingChannel } =
    useRemoveChannel();

  const handleEditOpen = (value: boolean) => {
    if (member?.role !== "admin") return;
    setEditOpen(value);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, "-").toLowerCase();
    setValue(value);
  };

  const handleDelete = async () => {
    const ok = await confirm();
    if (!ok) return;

    removeChannel(
      { id: channelId },
      {
        onSuccess: () => {
          toast.success("Channel Removed");
          router.replace(`/workspace/${workspaceId}`);
        },
        onError: () => {
          toast.error("Something went wrong");
        },
      }
    );
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateChannel(
      { id: channelId, name: value },
      {
        onSuccess: () => {
          toast.success("Channel updated ");
          setEditOpen(false);
        },
        onError: () => {
          toast.error("Failed to Update Channel");
        },
      }
    );
  };

  return (
    <div className="bg-white border-b h-[49px] flex items-center px-4 overflow-hidden">
      <ConfirmDialog />
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            className="w-auto px-2 overflow-hidden text-lg font-semibold"
            size="sm"
          >
            <span className="truncate"># {title}</span>
            <FaChevronDown className="size-2.5 ml-2" />
          </Button>
        </DialogTrigger>
        <DialogContent className="p-0 overflow-hidden bg-gray-50">
          <DialogHeader className="p-4 bg-white border-b">
            <DialogTitle># {title}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col px-4 pb-4 gap-y-2">
            <Dialog open={editOpen} onOpenChange={handleEditOpen}>
              <DialogTrigger asChild>
                <div className="px-5 py-4 bg-white border rounded-lg cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">Channel name</p>
                    {member?.role === "admin" && (
                      <p className="text-sm text-[#1264a3] hover:underline font-semibold">
                        Edit
                      </p>
                    )}
                  </div>
                  <p># {title}</p>
                </div>
              </DialogTrigger>
              <DialogContent className="bg-white">
                <DialogHeader>
                  <DialogTitle>Rename this channel</DialogTitle>
                </DialogHeader>

                <form className="space-y-4" onSubmit={handleSubmit}>
                  <Input
                    value={value}
                    disabled={isUpdatingChannel}
                    onChange={handleChange}
                    required
                    autoFocus
                    minLength={3}
                    maxLength={80}
                    placeholder="e.g plan-budget"
                  />
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline" disabled={isUpdatingChannel}>
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button disabled={isUpdatingChannel}>Save</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            {member?.role === "admin" && (
              <button
                onClick={handleDelete}
                disabled={isRemovingChannel}
                className="flex items-center px-5 py-4 bg-white border rounded-lg cursor-pointer gap-x-2 hover:bg-gray-50 text-rose-600"
              >
                <TrashIcon className="size-4" />
                <p className="text-sm font-semibold">Delete Channel</p>
              </button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
