"use client";

import { useRouter } from "next/navigation";
import { useMemo, useEffect } from "react";

import { useWorkspaceId } from "@/hooks/use-workspace-id";

import { useCreateChannelModal } from "@/features/channels/store/use-create-channel-modal";

import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { useGetChannels } from "@/features/channels/api/use-get-channels";
import { channel } from "diagnostics_channel";
import { Loader, TriangleAlert } from "lucide-react";
import { useCurrentMember } from "@/features/members/api/use-current-member";

const WorkSpaceIdPage = () => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const [open, setOpen] = useCreateChannelModal();

  const { data: member, isLoading: memberLoading } = useCurrentMember({
    workspaceId,
  });
  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({
    id: workspaceId,
  });
  const { data: channels, isLoading: channelsLoading } = useGetChannels({
    workspaceId,
  });

  const channelId = useMemo(() => channels?.[0]?._id, [channels]);
  const isAdmin = useMemo(() => member?.role === "admin", [member?.role]);

  useEffect(() => {
    if (
      workspaceLoading ||
      channelsLoading ||
      memberLoading ||
      !member ||
      !workspace
    )
      return;

    if (channelId) {
      router.push(`/workspace/${workspaceId}/channel/${channelId}`);
    } else if (!open && isAdmin) {
      setOpen(true);
    }
  }, [
    channelId,
    workspaceLoading,
    channelsLoading,
    memberLoading,
    member,
    isAdmin,
    workspace,
    setOpen,
    open,
    router,
    workspaceId,
  ]);

  if (workspaceLoading || channelsLoading || memberLoading) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 h-full gap-2">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!workspace || !member) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 h-full gap-2">
        <TriangleAlert className="size-6 text-destructive" />
        <span>Workspace Not Found</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center flex-1 h-full gap-2">
      <TriangleAlert className="size-6 text-destructive" />
      <span>No Channel Found</span>
    </div>
  );
};

export default WorkSpaceIdPage;
