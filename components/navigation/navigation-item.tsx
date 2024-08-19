"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { ActionTooltip } from "@/components/action-tooltip";
import { useOrganization } from "@/providers/organization-provider";

interface NavigationItemProps {
  id: string;
  imageUrl: string;
  name: string;
  inviteCode: string;
  profileId: string;
}

export const NavigationItem = ({
  id,
  imageUrl,
  name,
  inviteCode,
  profileId,
}: NavigationItemProps) => {
  const params = useParams();
  const router = useRouter();
  const { setOrganization } = useOrganization();

  return (
    <ActionTooltip side="right" align="center" label={name}>
      <button
        onClick={() => {
          setOrganization({
            id: id,
            imageUrl: imageUrl,
            name: name,
            inviteCode: inviteCode,
            profileId: profileId,
          });
          router.push(`/servers/${id}`);
        }}
        className="group relative flex items-center"
      >
        <div
          className={cn(
            "absolute left-0 bg-primary rounded-r-full transition-all w-[4px]",
            params?.organizationId !== id && "group-hover:h-[20px]",
            params?.organizationId === id ? "h-[36px]" : "h-[8px]"
          )}
        />
        <div
          className={cn(
            "relative group flex mx-1 h-[40px] w-[40px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden",
            params?.organizationId === id &&
              "bg-primary/10 text-primary rounded-[16px]"
          )}
        >
          <Image fill src={imageUrl} alt={"Organization"} />
        </div>
      </button>
    </ActionTooltip>
  );
};
