"use client";

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";

interface Organization {
  id: string;
  name: string;
  imageUrl: string;
  profileId: string;
  inviteCode: string;
}

interface OrganizationContextType {
  organization: Organization | null;
  setOrganization: (org: Organization) => void;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(
  undefined
);

export const OrganizationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [organization, setOrganization] = useState<Organization | null>(null);

  useEffect(() => {
    const storedOrganization = localStorage.getItem("organization");
    if (storedOrganization) {
      setOrganization(JSON.parse(storedOrganization));
    }
    // else {
    //   // Fetch organization data from API
    //   fetchOrganizationData();
    // }
  }, []);

  const setOrganizationWithLocalStorage = (org: Organization) => {
    setOrganization(org);
    localStorage.setItem("organization", JSON.stringify(org));
  };

  // const fetchOrganizationData = async () => {
  //   // Replace with your API call
  //   const response = await fetch('/api/getOrganization');
  //   const data = await response.json();
  //   setOrganizationWithLocalStorage(data); // Store in both state and local storage
  // };

  return (
    <OrganizationContext.Provider
      value={{ organization, setOrganization: setOrganizationWithLocalStorage }}
    >
      {children}
    </OrganizationContext.Provider>
  );
};

export const useOrganization = () => {
  const context = useContext(OrganizationContext);
  if (context === undefined) {
    throw new Error(
      "useOrganization must be used within an OrganizationProvider"
    );
  }
  return context;
};
