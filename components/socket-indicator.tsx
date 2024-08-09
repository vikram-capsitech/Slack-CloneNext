"use client";

import { useSocket } from "@/providers/socket-provider";
import { Badge } from "@/components/ui/badge";

export const SocketIndicator = () => {
  const { isConnected } = useSocket();

  if (!isConnected) {
    return (
      <Badge
        variant={"outline"}
        className="bg-yellow-600 text-white border-none"
      >
        Polling every 1s
      </Badge>
    );
  }

  return (
    <Badge
      variant={"outline"}
      className="bg-emerald-800 text-white border-none"
    >
      Real-Time updates
    </Badge>
  );
};
