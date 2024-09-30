"use client";
import Image from "next/image";
import Link from "next/link";
import VerificationInput from "react-verification-input";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useMemo, useEffect } from "react";

import { cn } from "@/lib/utils";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useGetWorkspaceInfo } from "@/features/workspaces/api/use-get-workspace-info";
import { useJoin } from "@/features/workspaces/api/use-join";
import { Button } from "@/components/ui/button";

const JoinPage = () => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const { data, isLoading } = useGetWorkspaceInfo({ id: workspaceId });
  const { mutate, isPending } = useJoin();
  const isMember = useMemo(() => data?.isMember, [data?.isMember]);

  useEffect(() => {
    if (isMember) {
      router.push(`/workspace/${workspaceId}`);
    }
  }, [isMember, router, workspaceId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const handleComplete = (value: string) => {
    mutate(
      { workspaceId, joinCode: value },
      {
        onSuccess: (id) => {
          router.replace(`/workspace/${id}`);
          toast.success("Workspace Joined");
        },
        onError: () => {
          toast.error("Failed to join workspace");
        },
      }
    );
  };
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 bg-white shadow-md gap-y-8 rouned-lg">
      <Image src="/logo.webp" width={60} height={60} alt="logo" />
      <div className="flex flex-col items-center justify-center max-w-md gap-y-4 ">
        <div className="flex flex-col items-center justify-center gap-y-2">
          <h1 className="text-2xl font-bold">Join {data?.name}</h1>
          <p className="text-md text-muted-foreground">
            Enter the workspace code to join
          </p>
        </div>
        <VerificationInput
          onComplete={handleComplete}
          autoFocus
          length={6}
          classNames={{
            container: cn(
              "flex gap-x-2",
              isPending && "opacity-50 cursor-not-allowed"
            ),
            character:
              "uppercase h-auto rounded-md border border-gray-300 flex items-center justify-center text-lg font-medium text-gray-500",
            characterInactive: "bg-muted",
            characterSelected: "bg-white text-black",
            characterFilled: "bg-white text-black",
          }}
        />
      </div>
      <div className="flex gap-x-4">
        <Button size="lg" variant="outline" asChild>
          <Link href="/"> Back to Home</Link>
        </Button>
      </div>
    </div>
  );
};

export default JoinPage;
