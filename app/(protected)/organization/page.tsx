"use client";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useCreateWorkspaceValues } from "@/hooks/create-workspace-values";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import Typography from "@/components/ui/typegraphy";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import axios from "axios";
import ImageDropZone from "@/components/image-upload";
import React from "react";
import apiClient from "@/helpers/ApiUtility";
import { FaUser } from "react-icons/fa";
import Image from "next/image";
import { currentUser } from "@/lib/auth";

const OrganizationSetup = () => {
  const [organizations,setOrganizations] = React.useState<any[]>([])
  const user:any = useCurrentUser();

useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await apiClient.get('/api/organization/list');
      debugger
      if (response.data.status) {
        console.log(response.data.items);
        setOrganizations(response.data.items ?? [])
      }
    } catch (err) {
      console.error(err);
    }
  };

  fetchData();
}, []);

  return (
<div className="h-full bg-purple-800 flex flex-col items-center justify-center">
      <div className="bg-white rounded-lg p-8 shadow-lg w-full max-w-md">
      <h1 className="text-2xl font-bold mb-2 text-center">Welcome back</h1>

    <p className="text-sm mb-2 overflow-scroll">Workspaces for {user.email}</p>
        {organizations.map((org)=>{
          return(
            <Card name={org.name} image={org.imageUrl} id={org.id} members={org.members} />
          )
        })}
        <div className="bg-white p-4 flex-col rounded-lg flex items-center shadow-md">
    <p className="mb-1">Want to use Scraawl with your team?</p>
    <Button onClick={()=>{
      redirect('/organization/create')
    }}>Create a new workspace</Button>
  </div>
      </div>
      <div className="text-white mt-4">
    <p>
      Not seeing your workspace?{" "}
      <a href="/login" className="underline">
        Try using a different email
      </a>
    </p>
  </div>
    </div>
  );
};

export default OrganizationSetup;


interface CardProps {
  name: string;
  image: string;
  id:string;
  members:any[]
}

const Card: React.FC<CardProps> = ({ name, image,id,members }) => {
  const maxDisplayMembers = 4;
  const displayedMembers = members.slice(0, maxDisplayMembers);
  const remainingMembersCount = members.length - maxDisplayMembers;

  return (
    <div className="bg-purple-200 p-4 rounded-lg mb-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <Image
        className="rounded-full ring-2 h-12 w-12"
          src={image}
          alt="Simpliexpand Logo"
          width={40}
          height={40}
        />
        <div className="ml-2">
          <p className="font-semibold">{name}</p>
          <div className="flex -space-x-2 overflow-hidden">
            {displayedMembers.map((member, index) => (
              <Avatar imageUrl={member.imageUrl} name={member.name}/>
              ))}
              {remainingMembersCount > 0 && (
                <span className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-gray-300 text-xs flex items-center justify-center">
                  +{remainingMembersCount}
                </span>
              )}
          </div>
        </div>
      </div>
      <Button onClick={()=>{
        redirect(`/servers/${id}`)
      }}>Launch Slack</Button>
    </div>
  </div>
  );
};




const Avatar = ({ imageUrl, name }:any) => {
  debugger
  const initial = name.charAt(0).toUpperCase();

  return (
    <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-gray-300 flex items-center justify-center">
      {imageUrl ? (
        <Image
          className="h-full w-full rounded-full"
          src={imageUrl}
          alt={name}
          width={32}
          height={32}
        />
      ) : (
        <span className="text-sm font-medium text-white">{initial}</span>
      )}
    </div>
  );
};