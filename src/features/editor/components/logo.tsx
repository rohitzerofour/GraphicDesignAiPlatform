import Link from "next/link";
import Image from "next/image";

export const Logo = () => {
  return (
    <Link href="/">
      <div className="size-8 relative shrink-0">
        <Image
          src="/logo.svg"
          fill
          alt="Graphic Design AI"
          className="shrink-0 hover:opacity-75 transition"
          priority
        />
      </div>
    </Link>
  );
};
