// // import { Home, Flame, PlusCircle, Compass, Book, User, Settings } from 'lucide-react';
// // import { Link } from 'react-router-dom';

// // const navItems = [
// //   { name: "Home", icon: <Home size={20} />, to: "/" },
// //   { name: "Popular", icon: <Flame size={20} />, to: "/popular" },
// //   { name: "All", icon: <Compass size={20} />, to: "/all" },
// //   { name: "Create Post", icon: <PlusCircle size={20} />, to: "/submit" },
// //   { name: "My Communities", icon: <Book size={20} />, to: "/my-communities" },
// //   { name: "Profile", icon: <User size={20} />, to: "/profile" },
// //   { name: "Settings", icon: <Settings size={20} />, to: "/settings" },
// // ];

// // export default function SideNav() {
// //   return (
// //     <aside className="fixed top-0 left-0 h-full w-60 bg-reddit_dark-brightest border-r border-reddit_border p-4 text-white hidden md:block z-50">
// //       <div className="mb-6 px-2">
// //         <h2 className="text-lg font-semibold">Menu</h2>
// //       </div>
// //       <nav className="space-y-1">
// //         {navItems.map((item, idx) => (
// //           <Link
// //             to={item.to}
// //             key={idx}
// //             className="flex items-center px-3 py-2 rounded-lg hover:bg-reddit_dark transition text-sm"
// //           >
// //             <span className="mr-3">{item.icon}</span>
// //             {item.name}
// //           </Link>
// //         ))}
// //       </nav>
// //     </aside>
// //   );
// // }


import {
    HomeIcon,
    PlusCircleIcon,
    GlobeAltIcon,
    BookOpenIcon,
    UserCircleIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import AuthModalContext from "./AuthModalContext";
import { useContext } from "react";
import UserContext from "./UserContext";

const navItems = [
    { name: "Home", icon: HomeIcon, to: "/" },
    { name: "All", icon: GlobeAltIcon, to: "/all" },
    { name: "Create Post", icon: PlusCircleIcon, to: "/create-post" },
    { name: "Create Community", icon: PlusCircleIcon, to: "/createCommunity" },
    { name: "My Communities", icon: BookOpenIcon, to: "/myCommunities" },
    { name: "Profile", icon: UserCircleIcon, to: "/profile" },
];

export default function SideNav() {

  const user = useContext(UserContext)

    return (
        <aside className="fixed top-12 left-0 bottom-0 min-h-dvh w-60 bg-black border-r border-[#343536] text-white p-4 md:block z-20">
            {/* <div className="mb-6 px-2">
          <h2 className="text-lg font-semibold">Menu</h2>
        </div> */}
            <nav className="space-y-1">
                {navItems.map(({ name, icon: Icon, to }) => (
                    //  if (userInfo.username == undefined) {
                    //     authModal.setShow('login');
                    // }

                    (user.username || name == "All") && (
                        <Link
                            to={to}
                            key={name}
                            className="flex items-center px-3 py-2 rounded-lg hover:bg-[#2D2D2F] transition text-sm"
                        >
                            <Icon className="w-5 h-5 mr-3" />
                            {name}
                        </Link>)

                ))}
            </nav>
        </aside>
    );
}


// import { HomeIcon, FireIcon } from "@heroicons/react/24/outline";

// export default function SideNav() {
//   return (
//     <aside className="fixed top-0 left-0 h-full w-60 bg-[#1A1A1B] text-white p-4 z-50">
//       <nav className="space-y-4">
//         <div className="text-xs uppercase text-gray-400 mb-2">Feeds</div>

//         <a href="/" className="flex items-center space-x-3 hover:bg-[#2A2A2B] px-2 py-2 rounded">
//           <HomeIcon className="w-6 h-6" />
//           <span className="text-sm">Home</span>
//         </a>

//         <a href="/popular" className="flex items-center space-x-3 hover:bg-[#2A2A2B] px-2 py-2 rounded">
//           <FireIcon className="w-6 h-6" />
//           <span className="text-sm">Popular</span>
//         </a>
//       </nav>
//     </aside>
//   );
// }
