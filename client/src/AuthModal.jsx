import AuthModalContext from "./AuthModalContext"
import Button from "./Button"
import Input from "./Input"
import { useState, useContext, useRef } from "react"
import { useClickAway } from 'react-use';
import UserContext from "./UserContext";
function AuthModal(props) {
    const [modalType, setModalType] = useState('login')
    const [email, setEmail] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const modalContext = useContext(AuthModalContext)
    const visibleClass = modalContext.show != 'false' ? 'block' : 'hidden'
    const authModalRef = useRef(null); // Create ref for the dropdown
    const { user, setUser } = useContext(UserContext);

    useClickAway(authModalRef, () => modalContext.setShow('false'));

    if (modalContext.show != modalType) {
        setModalType(modalContext.show)
    }
    function register() {
        fetch("http://localhost:8000/dummy/register", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, email, password }),
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.message === "Registration successful") {
                console.log("User registered:", data.user);
                setUser(data.user)
                // Handle successful registration (e.g., navigate to login page or show success message)
              } else {
                setErrorMessage(data.message); // Show error message
              }
              modalContext.setShow('false')
              setUsername("")
              setEmail("")
              setPassword("")
            })
            .catch((error) => {
              console.error("Error during registration:", error);
              setErrorMessage("Something went wrong. Please try again.");
            });
    }
    function login() {
        fetch("http://localhost:8000/dummy/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.message === "Login successful") {
                    setUser(data.user); // Store the user info in the variable
                    console.log("Login successful:", data);
                } else {
                    console.error("Invalid login:", data.message);
                }
                modalContext.setShow('false')
                setUsername("")
                setPassword("")
            })
            .catch((error) => {
                console.error("Error logging in:", error);
            });
    }

    return (
        <div className={"w-screen h-screen fixed top-0 left-0 z-30 flex " + visibleClass}
            style={{ backgroundColor: 'rgba(0,0,0,.6)' }}>
            <div ref={authModalRef} className="border border-reddit_dark-brightest 
                        w-3/4 sm:w-1/2 lg:w-1/4 
                        bg-reddit_dark p-5 \
                        text-reddit_text self-center 
                        mx-auto rounded-md">
                {modalType == 'login' && (
                    <h1 className="text-2xl mb-5">Login</h1>
                )}
                {modalType == 'register' && (
                    <>
                        <h1 className="text-2xl mb-5">Sign Up</h1>
                        <Input
                            type="text"
                            className="mb-3 w-full"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} />
                    </>
                )}
                <Input
                    type="text"
                    className="mb-3 w-full"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)} />
                <Input type="password"
                    className="mb-3 w-full"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} />

                {modalType == 'login' && (
                    <div>
                        <Button className="w-full py-2 mb-3" onClick={login}>
                            Log In
                        </Button>
                        New to Reddit? <button className="text-blue-600" onClick={() => modalContext.setShow('register')}>Sign Up</button>
                    </div>
                )}
                {modalType == 'register' && (
                    <div>
                        <Button className="w-full py-2 mb-3" onClick={register}>
                            Sign Up
                        </Button>
                        Already a redditor? <button className="text-blue-600" onClick={() => modalContext.setShow('login')}>Log In</button>
                    </div>
                )}

            </div>
        </div>

    )
}
export default AuthModal