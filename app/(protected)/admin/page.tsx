"use client";

import { logout } from "@/actions/logout";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/use-current-user";

const AdminPage = () => {
  const user = useCurrentUser();
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-center mb-4">Welcome</h1>
        <p className="text-center text-gray-700 mb-8">
          {user?.name
            ? `Hello, ${user.name}! You have successfully logged in.`
            : "Hello! You have successfully logged in."}
        </p>
        <div className="flex justify-center">
          <Button size="lg" variant="outline" color="primary">
            Go to Chat
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
