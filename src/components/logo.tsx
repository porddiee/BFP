import Image from "next/image";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Logo({ size = "md", className = "" }: LogoProps) {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-16 h-16",
  };

  return (
    <div className={`relative ${sizes[size]} ${className}`}>
      <Image
        src="/images/bfp-seal.png"
        alt="Bureau of Fire Protection Seal"
        fill
        className="object-contain"
        priority
      />
    </div>
  );
}
