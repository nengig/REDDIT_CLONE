import Logo from './logo.png'
import Avatar from './avatar.png'
import {
  BellIcon,
  ChatBubbleLeftEllipsisIcon, ChatBubbleOvalLeftEllipsisIcon,
  ChevronDownIcon, MagnifyingGlassIcon,
  PlusIcon, UserCircleIcon, ArrowRightEndOnRectangleIcon, ArrowRightStartOnRectangleIcon, EllipsisHorizontalIcon
} from '@heroicons/react/24/outline';
import Button from './Button';
import { useState, useRef, useContext } from 'react';
import { useClickAway } from 'react-use';
import AuthModalContext from './AuthModalContext';
import UserContext from './UserContext';
import { Link } from 'react-router-dom';
function Header() {
  const [userDropdownVisibility, setuserDropdownVisibility] = useState(false);
  const dropdownRef = useRef(null); // Create ref for the dropdown
  useClickAway(dropdownRef, () => setuserDropdownVisibility(false));
  const authModal = useContext(AuthModalContext)
  const user = useContext(UserContext)

  function toggleUserDropDown() {
    setuserDropdownVisibility(!userDropdownVisibility)

  }
  return (
    <div>
      <header className="w-full bg-reddit_dark p-2">
        <div className='mx-4 flex'>
          <img src={Logo} alt="reddit logo" className="w-8 h-8 mr-4 " />
          <form action="" className='"bg-reddit_dark-brighter px-0  flex rounded-2xl border border-reddit_border mx-4 flex-grow'>
            <div className='flex bg-reddit_dark-brighter rounded-2xl flex-grow'>
              <MagnifyingGlassIcon className='text-gray-300 h-6 w-6 mt-1 pl-2' />
              <input type='text' className=' bg-reddit_dark-brighter text-md p-1 pl-2 pr-0 block focus:outline-none text-white rounded-2xl' placeholder='Search' />
            </div>
          </form>
          {user.username && (
            <>
              <button className='px-2 py-1'>
                <ChatBubbleOvalLeftEllipsisIcon className="text-gray-400 w-6 h-6 mx-2" />
              </button>
              <button className='px-2 py-1 flex'>
                <PlusIcon className="text-gray-400 w-6 h-6 mx-2" />
                <p className='text-gray-400 font-semibold'>Create</p>
              </button>
              <button className='px-2 py-1'>
                <BellIcon className="text-gray-400 w-6 h-6 mx-2" />
              </button>
            </>
          )}

          {!user.username && (
            <div className='mx-2 hidden sm:block'>
              <Button outline className="mr-1 h-8" onClick={() => authModal.setShow('register')}>Sign Up</Button>
              <Button className="h-8 " onClick={() => authModal.setShow('login')}>Log In</Button>
            </div>
          )}



          <button className="rounded-full flex ml-4" onClick={() => toggleUserDropDown()}>
            {!user.username && (
              <EllipsisHorizontalIcon className='w-6 h-6 text-gray-400 m-1 p-1 border border-gray-700 rounded-full' />
            )}
            {user.username && (
              <div className="bg-gray-600 rounded-full w-8 h-8 overflow-hidden">
                <img src={Avatar} alt="" className="block w-full h-full object-cover" />
              </div>
            )}
            {/*<ChevronDownIcon  className="text-gray-500 w-5 h-5 mt-2 m-1"/>*/}
          </button>

          {userDropdownVisibility && (
            <div
              ref={dropdownRef} // Attach ref to the dropdown
              className="absolute right-0 top-8 text-white bg-reddit_dark 
                          border border-gray-700 rounded-md z-10"
            >
              {user.username && (
                <div>
                  <span className='w-50 block py-2 px-3 text-sm'>Hello, {user.username}</span>
                  <Link
                    to="/profile"
                    className="flex items-center w-full py-2 px-4 text-sm hover:bg-gray-300 hover:text-black transition"
                  >
                    <UserCircleIcon className="w-5 h-5 mr-2" />
                    Profile
                  </Link>
                  <button
                    className='block flex w-50 py-2 px-3 hover:bg-gray-300 hover:text-black 
         overflow-hidden text-sm '
                    onClick={() => user.logout()}
                  >
                    <ArrowRightStartOnRectangleIcon className="w-5 h-5 mr-2" />
                    Log Out
                  </button>

                </div>
              )}
              {!user.username && (
                <button
                  className='block flex w-50 py-2 px-3 hover:bg-gray-300 hover:text-black 
           overflow-hidden text-sm '
                  onClick={() => authModal.setShow('login')}
                >
                  <ArrowRightEndOnRectangleIcon className="w-5 h-5 mr-2" />
                  Log In / Sign Up
                </button>
              )}


            </div>
          )}
        </div>
      </header>
    </div>
  )
}

export default Header
