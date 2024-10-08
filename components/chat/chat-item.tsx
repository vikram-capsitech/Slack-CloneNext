"use client";

import * as z from "zod";
import axios from "axios";
import qs from "query-string";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Member, MemberRole, User } from "@prisma/client";
import { Edit, FileIcon, ShieldAlert, ShieldCheck, Trash } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

import { UserAvatar } from "@/components/user-avatar";
import { ActionTooltip } from "@/components/action-tooltip";
import { cn } from "@/lib/utils";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-model-store";
import apiClient from "@/helpers/ApiUtility";

interface ChatItemProps {
  id: string;
  content: string;
  member: Member & {
    profile: User;
  };
  timestamp: string;
  fileUrl: string | null;
  deleted: boolean;
  currentMember: Member;
  isUpdated: boolean;
  socketUrl: string;
  socketQuery: Record<string, string>;
}

const roleIconMap = {
  GUEST: null,
  MODERATOR: <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />,
  ADMIN: <ShieldAlert className="h-4 w-4 ml-2 text-rose-500" />,
};

const formSchema = z.object({
  content: z.string().min(1),
});

export const ChatItem = ({
  id,
  content,
  member,
  timestamp,
  fileUrl,
  deleted,
  currentMember,
  isUpdated,
  socketUrl,
  socketQuery,
}: ChatItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const { onOpen } = useModal();
  const params = useParams();
  const router = useRouter();

  const onMemberClick = () => {
    if (member.id === currentMember.id) {
      return;
    }
    router.push(`/servers/${params?.serverId}/conversations/${member.id}`);
  };

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.key === "Escape" || event.keyCode === 27) {
        setIsEditing(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keyDown", handleKeyDown);
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: content,
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: `${socketUrl}/${id}`,
        query: socketQuery,
      });
      await apiClient
        .patch(url, values)
        .then((res) => {
          if (res.status) {
            form.reset();
            setIsEditing(false);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    form.reset({
      content: content,
    });
  }, [content]);

  const fileType = fileUrl?.split(".").pop();

  const isAdmin = currentMember.role === MemberRole.ADMIN;
  const isModerator = currentMember.role === MemberRole.MODERATOR;
  const isOwner = currentMember.id === member.id;
  const canDeleteMessage = !deleted && (isAdmin || isModerator || isOwner);
  const canEditMessage = !deleted && isOwner && !fileUrl;
  const isPDF = fileType === "pdf" && fileUrl;
  const isImage = !isPDF && fileUrl;

  return (
    <div className="relative group flex items-start gap-x-3 p-3 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-md transition w-full">
      <div
        onClick={onMemberClick}
        className="cursor-pointer hover:scale-105 transform transition"
      >
        <UserAvatar src={member.profile.imageUrl!} />
      </div>
      <div className="flex flex-col w-full">
        <div className="flex items-center justify-between gap-x-2">
          <div className="flex items-center">
            <p
              onClick={onMemberClick}
              className="font-semibold text-sm hover:underline cursor-pointer text-zinc-800 dark:text-zinc-200"
            >
              {member.profile.name}
            </p>
            <ActionTooltip label={member.role}>
              {roleIconMap[member.role]}
            </ActionTooltip>
          </div>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            {timestamp}
          </span>
        </div>
        {isImage && (
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="relative aspect-square rounded-md mt-2 overflow-hidden border border-zinc-200 dark:border-zinc-700 flex items-center justify-center bg-zinc-100 dark:bg-zinc-700 h-48 w-48 hover:scale-105 transform transition"
          >
            <Image
              src={fileUrl}
              alt={content}
              fill
              className="object-cover"
            />
          </a>
        )}
        {isPDF && (
          <div className="relative flex items-center p-3 mt-2 rounded-md bg-zinc-100 dark:bg-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-600 transition">
            <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-3 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
            >
              PDF File
            </a>
          </div>
        )}
        {!fileUrl && !isEditing && (
          <p
            className={cn(
              "text-sm text-zinc-700 dark:text-zinc-300 mt-1",
              deleted &&
                "italic text-zinc-500 dark:text-zinc-400 text-xs"
            )}
          >
            {content}
            {isUpdated && !deleted && (
              <span className="text-[10px] mx-2 text-zinc-500 dark:text-zinc-400">
                (edited)
              </span>
            )}
          </p>
        )}
        {!fileUrl && isEditing && (
          <Form {...form}>
            <form
              className="flex items-center w-full gap-x-2 mt-2"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isLoading}
                        className="p-2 bg-zinc-100 dark:bg-zinc-700 border-none text-zinc-800 dark:text-zinc-200"
                        placeholder="Edit message"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button disabled={isLoading} size="sm" variant="default">
                Save
              </Button>
            </form>
            <span className="text-[10px] mt-1 text-zinc-400">
              Press escape to cancel, enter to save
            </span>
          </Form>
        )}
      </div>
      {canDeleteMessage && (
        <div className="hidden group-hover:flex items-center gap-x-2 absolute p-1 -top-3 right-4 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-sm shadow-lg">
          {canEditMessage && (
            <ActionTooltip label="Edit">
              <Edit
                onClick={() => setIsEditing(true)}
                className="cursor-pointer w-4 h-4 text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
              />
            </ActionTooltip>
          )}
          <ActionTooltip label="Delete">
            <Trash
              onClick={() =>
                onOpen("deleteMessage", {
                  apiUrl: `${socketUrl}/${id}`,
                  query: socketQuery,
                })
              }
              className="cursor-pointer w-4 h-4 text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
            />
          </ActionTooltip>
        </div>
      )}
    </div>
  );
};
