import { Link } from "react-router-dom";
import { UserNav } from "./UserNav";
import { ModeToggle } from "./ModeToggle";

const Header = () => {
  return (
    <header className="sticky top-4 z-50 flex justify-center px-4">
      <div className="w-full max-w-screen-xl bg-background/80 backdrop-blur-sm border rounded-full p-2 flex items-center justify-between shadow-lg">
        <Link to="/" className="flex items-center gap-2 pl-4">
          {/* Removed img tag */}
          <span className="font-orbitron text-xl font-bold text-primary tracking-wider">IdeasLab</span>
        </Link>
        <div className="flex items-center gap-2 pr-2">
          <ModeToggle />
          <UserNav />
        </div>
      </div>
    </header>
  );
};

export default Header;