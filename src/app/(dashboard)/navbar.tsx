import { UserButton } from "@/features/editor/components/user-button";

export const Navbar = () => {
  return (
    <nav className="w-full flex items-center p-4 h-[68px]">
      <div className="ml-auto">
        <UserButton />
      </div>
    </nav>
  );
};
