import { cn } from "@/lib/utils";
import Image from "next/image";
import LogoSvg from "@/assets/logo.svg";

export function Logo({ className }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <Image src={LogoSvg} alt="Bolna Logo" width={25} height={25} priority />
    </div>
  );
}
