import { BellIcon, PlusIcon, ChatBubbleOvalLeftEllipsisIcon, MagnifyingGlassIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

function Header() {
    return (

        <header className=' w-full  bg-reddit_dark p-2'>
            <div className="mx-4 flex">
                <img src="https://redditinc.com/hs-fs/hubfs/Reddit%20Inc/Brand/Reddit_Logo.png" alt="" className='w-8 h-8 mr-4' />

                <form className='bg-reddit_dark-brighter flex rounded-md px-4 border border-reddit_border mx-4 lg:mx-50  flex-grow'>
                    <MagnifyingGlassIcon className="text-gray-300 mt-1 h-6 w-6" />
                    <input type="text" className="bg-reddit_dark-brighter text-white text-sm p-1 pl-2 pr-0 block focus: outline-none" placeholder='Search Reddit' />
                </form>

                <button className='px-2 py-1'>
                    <ChatBubbleOvalLeftEllipsisIcon className='text-gray-400 w-6 h-6 mx-2' />
                </button>
                <button className='px-2 py-1'>
                    <BellIcon className='text-gray-400 w-6 h-6 mx-2' />
                </button>
                <button className='px-2 py-1'>
                    <PlusIcon className='text-gray-400 w-6 h-6 mx-2' />
                </button>

                <button className='rounded-md flex ml-4'>
                    <div className=' w-8 h-8 '>
                        <img src="https://www.redditstatic.com/avatars/defaults/v2/avatar_default_4.png" alt="" className='rounded-md' />
                    </div>
                    <ChevronDownIcon className='text-gray-500  w-5 h-5 mt-2 ml-2' />
                </button>
            </div>
        </header>
    )
}

export default Header;