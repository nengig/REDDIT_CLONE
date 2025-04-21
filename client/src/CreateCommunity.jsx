// // import { useState, useContext } from "react";

// // export default function CreateCommunity() {
// //     const [name, setName] = useState("");
// //     const [desc, setDesc] = useState("");

// //     const handleSubmit = (e) => {
// //         e.preventDefault();

// //         if (!name) return alert("Community name required.");

// //         // addCommunity({ name, desc }); //add community to db
// //         setName("");
// //         setDesc("");
// //     };
// // //reddit_dark-brightest
// //     return (
// //         <div className="flex items-center min-h-dvh bg-reddit_dark text-reddit_text ">
// //             <div className="max-w-lg w-full mx-auto p-4  bg-reddit_dark-brightest shadow rounded">
// //                 <h2 className="text-xl font-bold mb-4">Create a Community</h2>
// //                 <form onSubmit={handleSubmit} className="space-y-4">
// //                     {/* Community name input with r/ prefix */}
// //                     <div className="relative">
// //                         <span className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500">r/</span>
// //                         <input
// //                             type="text"
// //                             className="w-full pl-8 p-2 border rounded border-reddit_border focus:outline-none "
// //                             placeholder="community-name"
// //                             value={name}
// //                             onChange={(e) => setName(e.target.value)}
// //                         />
// //                     </div>

// //                     <textarea
// //                         className="w-full p-2 border rounded border-reddit_border focus:outline-none "
// //                         placeholder="Description"
// //                         rows={5}
// //                         value={desc}
// //                         onChange={(e) => setDesc(e.target.value)}
// //                     />
// //                     <div className="flex justify-center">
// //                         <button
// //                             type="submit"
// //                             className="bg-blue-700 text-white px-8 py-2 rounded-full hover:bg-blue-600 " //#105bca
// //                         >
// //                             Create
// //                         </button>
// //                     </div>
// //                 </form>
// //             </div>
// //         </div>
// //     );
// // }



// import { useState, useContext } from "react";

// export default function CreateCommunity() {
//   const [name, setName] = useState("");
//   const [desc, setDesc] = useState("");
//   const [error, setError] = useState("");

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     // Validation
//     if (!name.trim()) {
//       return setError("Community name is required.");
//     }

//     if (!/^[a-zA-Z0-9_]+$/.test(name)) {
//       return setError("Only letters, numbers, and underscores are allowed.");
//     }

//     // Clear errors
//     setError("");

//     // Submit logic
//     try {
//       // Example: You could post to your backend here
//       // await addCommunity({ name, desc });

//       console.log("Community created:", { name, desc });

//       // Clear form
//       setName("");
//       setDesc("");
//     } catch (err) {
//       setError("Something went wrong. Please try again.");
//     }
//   };

//   return (
//     <div className="flex items-center min-h-dvh bg-reddit_dark text-reddit_text">
//       <div className="max-w-lg w-full mx-auto p-4 bg-reddit_dark-brightest shadow rounded">
//         <h2 className="text-xl font-bold mb-4">Create a Community</h2>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           {/* Community name input with r/ prefix */}
//           <div className="relative">
//             <span className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500">r/</span>
//             <input
//               type="text"
//               className="w-full pl-8 p-2 border rounded border-reddit_border focus:outline-none"
//               placeholder="community-name"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//             />
//             {error && (
//               <p className="text-red-500 text-sm mt-1">{error}</p>
//             )}
//           </div>

//           <textarea
//             className="w-full p-2 border rounded border-reddit_border focus:outline-none"
//             placeholder="Description"
//             rows={5}
//             value={desc}
//             onChange={(e) => setDesc(e.target.value)}
//           />

//           <div className="flex justify-center">
//             <button
//               type="submit"
//               className="bg-blue-700 text-white px-8 py-2 rounded-full hover:bg-blue-600"
//             >
//               Create
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }


import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateCommunity() {
    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        const newErrors = {};

        if (!name.trim()) {
            newErrors.name = "Community name is required.";
        } else if (!/^[a-zA-Z0-9_]+$/.test(name)) {
            newErrors.name = "Only letters, numbers, and underscores are allowed.";
        }

        if (!desc.trim()) {
            newErrors.desc = "Description is required.";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }


        fetch(`${import.meta.env.VITE_SERVER_URL}community/check-name?name=${encodeURIComponent(name)}`).then((res) => res.json()).then((data) => {
            console.log(data);
            if (!data) {
                fetch(`${import.meta.env.VITE_SERVER_URL}community/`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, desc }),
                    credentials: "include"
                }).then((res) => res.json()).then((data) => {
                    console.log(data);
                    navigate('/r/' + encodeURIComponent(name), { replace: true });
                })
            }
            else {
                newErrors.name = `Community name ${name} already exists.`;
                setErrors(newErrors);
                return
            }
        }).catch((error) => {
            console.log(error);
        })

        // No errors
        setErrors({});
        console.log("Create community:", { name, desc });

        // Reset form
        // setName("");
        // setDesc("");
    };

    return (
        <div className="flex items-center min-h-dvh bg-reddit_dark text-reddit_text">
            <div className="max-w-lg w-full mx-auto p-4 bg-reddit_dark-brightest shadow rounded mb-30">
                <h2 className="text-xl font-bold mb-4">Create a Community</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Community name input with r/ prefix */}
                    <div className="relative">
                        <label className="block text-sm mb-1">Community Name</label>
                        <div className="relative">
                            <span className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500">r/</span>
                            <input
                                type="text"
                                className={`w-full pl-8 p-2 border rounded border-reddit_border focus:outline-none ${errors.name ? "border-red-500" : ""
                                    }`}
                                placeholder="community-name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>

                    {/* Description input */}
                    <div>
                        <label className="block text-sm mb-1">Description</label>
                        <textarea
                            className={`w-full p-2 border rounded border-reddit_border focus:outline-none ${errors.desc ? "border-red-500" : ""
                                }`}
                            placeholder="Description"
                            rows={5}
                            value={desc}
                            onChange={(e) => setDesc(e.target.value)}
                        />
                        {errors.desc && <p className="text-red-500 text-sm mt-1">{errors.desc}</p>}
                    </div>

                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className={`text-white px-8 py-2 rounded ${!(desc.length > 0 && name.length > 0) ? " bg-gray-600 cursor-not-allowed " : " cursor-pointer  bg-reddit_orange  "}`}
                            disabled={!(desc.length > 0 && name.length > 0)}
                        >
                            Create
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
