import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import Image from "next/image";
import logo from "@/public/wings.svg";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

interface HeaderProps {
  label: string;
}

export const Header = ({ label }: HeaderProps) => {
  return (
    <div className="w-full flex flex-col gap-y-4 items-center justify-center">
      <div className="flex items-center flex-col">
        <Image src={logo} alt="Logo" className="h-8 w-8 mr-3" />
        <h1 className={cn("text-3xl font-semibold", font.className)}>
          Scraawl
        </h1>
      </div>

      <p className="text-muted-foreground text-sm">{label}</p>
    </div>
  );
};
