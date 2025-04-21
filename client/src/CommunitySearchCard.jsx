import { Link } from 'react-router-dom';

const RedditCommunityCard = ({ name, members, description }) => {
    return (
        <Link to={`/r/` + name}>
            <div className="flex items-center justify-between border-b border-gray-600 p-4 hover:bg-muted transition">
                <div className="flex items-start space-x-4 w-full">
                    {/* Fixed-size r/ circle */}
                    <div className="shrink-0 w-[60px] h-[60px] md:w-24 md:h-24 rounded-full bg-green-600 flex items-center justify-center shadow text-white text-5xl font-bold">
                        r/
                    </div>


                    {/* Content block with clamped description */}
                    <div className="flex flex-col justify-between w-full overflow-hidden">
                        <p className="text-md truncate pb-2 text-gray-300">r/{name}</p>
                        <p className="text-light text-gray-400 line-clamp-3 mb-1">
                            {description}
                        </p>
                        <p className="text-sm text-gray-500">{members.toLocaleString()} members</p>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default RedditCommunityCard;
