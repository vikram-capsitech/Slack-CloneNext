"use client";

import { NavigationAction } from "./navigation-action";
import { NavigationItem } from "./navigation-item";

import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ModeToggle } from "@/components/mode-toggle";
import { UserButton } from "@/components/auth/user-button";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  FaChevronDown,
  FaChevronUp,
  FaFacebookMessenger,
  FaHome,
  FaUser,
} from "react-icons/fa";
import apiClient from "@/helpers/ApiUtility";
import { cn } from "@/lib/utils";
import { GearIcon } from "@radix-ui/react-icons";
import { Group, MessageCircle, UsbIcon } from "lucide-react";

export const NavigationSidebar = () => {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [isServersVisible, setIsServersVisible] = useState(false);

  const toggleServersVisibility = () => {
    setIsServersVisible(!isServersVisible);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get("/api/organization/list");
        if (response.data.status) {
          console.log(response.data.items);
          setOrganizations(response.data.items ?? []);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-2 flex flex-col items-center h-full text-primary w-full dark:bg-[#1E1F22] bg-[#E3E5E8] py-0.5">
      {/* <NavigationAction /> */}
      <Separator
        className="h-[1px] bg-zinc-300 dark:bg-zinc-700
      rounded-md w-10 mx-auto"
      />
      <div className="mt-3 flex items-center flex-col">
          <div className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded cursor-pointer">
            <MessageCircle className="h-5 w-5" />
          </div>
          <div className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded cursor-pointer">
            <Group className="h-5 w-5" />
          </div>
        </div>
      <div
        className="cursor-pointer flex-1 w-full pb-3 mt-auto flex items-center flex-col gap-y-3 hover:bg-gray-200 dark:hover:bg-gray-800"
        onClick={toggleServersVisibility}
      >
        {organizations.length > 1 && (
          <>
          {isServersVisible ? (
          <FaChevronUp className="h-2 w-2" title="Show less" />
        ) : (
          <FaChevronDown className="h-2 w-2" title="Show more" />
        )}
        <div
          className={cn(
            "absolute top-full left-0 bg-white dark:bg-gray-800 shadow-lg rounded mt-2 z-50",
            isServersVisible ? "block" : "hidden"
          )}
        >
          {isServersVisible && (
            <ScrollArea className="flex-1 w-full">
              {organizations.map((organization) => (
                <div key={organization.id} className="mb-4">
                  <NavigationItem
                    id={organization.id}
                    imageUrl={organization.imageUrl ?? ""}
                    name={organization.name} 
                    inviteCode={organization.inviteCode} 
                    profileId={organization.profileId}                  />
                </div>
              ))}
            </ScrollArea>
          )}
        </div>
          </>
        )}
        
        
      </div>
      <div className="pb-3 mt-auto flex items-center flex-col gap-y-3">
      <GearIcon className="h-5 w-5" />
        <ModeToggle />
        <UserButton />
      </div>
    </div>
  );
};
