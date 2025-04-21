import { Link } from 'react-router-dom';
import Avatar from './avatar.png';


const UserSearchCard = ({ name }) => {
    return (
        <Link to={`/u/` + name}>
            <div className="flex items-center justify-between border-b border-gray-600 px-1 py-4 hover:bg-muted transition">
                <div className="flex items-start space-x-4 w-full">
                    {/* Fixed-size r/ circle */}

                    <div className="w-22 h-20 bg-reddit-border rounded-full flex items-center justify-center text-2xl font-bold  text-gray-400 overflow-hidden">
                        <img
                            src={Avatar}
                            alt=""
                            className="w-full h-full object-cover rounded-full"
                        />
                    </div>

                    {/* Content block with clamped description */}
                    <div className="flex items-center h-full w-full overflow-hidden mt-5 ml-3">
                        <p className="text-md truncate pb-2 text-gray-300">{name}</p>
                        {/* <p className="text-light text-gray-400 line-clamp-3 mb-1">
                            {description}
                        </p>
                        <p className="text-sm text-gray-500">{members.toLocaleString()} members</p> */}
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default UserSearchCard;
