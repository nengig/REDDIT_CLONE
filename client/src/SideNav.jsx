import {
    HomeIcon,
    PlusCircleIcon,
    GlobeAltIcon,
    BookOpenIcon,
    UserCircleIcon,
} from "@heroicons/react/24/outline";
import { Link, useLocation } from "react-router-dom";
import AuthModalContext from "./AuthModalContext";
import { useContext } from "react";
import UserContext from "./UserContext";

const navItems = [
    { name: "Home", icon: HomeIcon, to: "/home" },
    { name: "All", icon: GlobeAltIcon, to: "/" },
    { name: "Create Post", icon: PlusCircleIcon, to: "/create-post" },
    { name: "Create Community", icon: PlusCircleIcon, to: "/createCommunity" },
    { name: "My Communities", icon: BookOpenIcon, to: "/myCommunities" },
    { name: "Profile", icon: UserCircleIcon, to: "/profile" },
];

export default function SideNav() {

  const user = useContext(UserContext);
  const location = useLocation();

    return (
        <aside className="fixed top-12 left-0 bottom-0 min-h-dvh w-60 bg-black border-r border-[#343536] text-white p-4 md:block z-20">
            <nav className="space-y-1">
                {navItems.map(({ name, icon: Icon, to }) => {

                    const isActive = (location.pathname == to);

                    return (user.username || name == "All") && (
                        <Link
                            to={to}
                            key={name}
                            className={`flex items-center px-3 py-2 rounded-lg text-sm transition 
                                ${isActive ? "bg-[#2D2D2F] font-semibold text-white" : "hover:bg-[#2D2D2F] text-gray-300"}
                            `}
                        >
                            <Icon className="w-5 h-5 mr-3" />
                            {name}
                        </Link>)

                    })}
            </nav>
        </aside>
    );
}