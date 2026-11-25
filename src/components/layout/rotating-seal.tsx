import Image from "next/image";

export function RotatingSeal() {
  return (
    <div className="relative shrink-0 flex items-center justify-center">
      <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-full p-1 bg-white/10 backdrop-blur-sm border border-white/20 shadow-md flex items-center justify-center overflow-hidden">
        <Image
          src="/images/Surigao del Norte Fire Protection Seal.png"
          alt="Surigao del Norte Fire Protection Seal"
          width={80}
          height={80}
          className="w-full h-full object-contain animate-spin-slow drop-shadow-md select-none pointer-events-none"
          priority
        />
      </div>
    </div>
  );
}
