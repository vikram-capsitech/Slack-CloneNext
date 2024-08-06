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
} from "react-icons/fa";
import apiClient from "@/helpers/ApiUtility";

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
      <div
        className="cursor-pointer flex-1 w-full pb-3 mt-auto flex items-center flex-col gap-y-3 hover:bg-gray-200 dark:hover:bg-gray-800"
        onClick={toggleServersVisibility}
      >
        {isServersVisible ? (
          <FaChevronUp className="h-2 w-2" title="Show less" />
        ) : (
          <FaChevronDown className="h-2 w-2" title="Show more" />
        )}
        {isServersVisible && (
          <ScrollArea className="flex-1 w-full">
            {organizations.map((organization) => (
              <div key={organization.id} className="mb-4">
                <NavigationItem
                  id={organization.id}
                  imageUrl={organization.imageUrl ?? ""}
                  name={organization.name}
                />
              </div>
            ))}
          </ScrollArea>
        )}
      </div>

      <div className="pb-3 mt-auto flex items-center flex-col gap-y-3">
        <ModeToggle />
        <UserButton />
      </div>
    </div>
  );
};
