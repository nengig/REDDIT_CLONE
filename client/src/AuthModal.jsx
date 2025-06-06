import AuthModalContext from "./AuthModalContext"
import Button from "./Button"
import Input from "./Input"
import { useState, useContext, useRef, useEffect } from "react"
import { useClickAway } from 'react-use';
import UserContext from "./UserContext";
import axios from "axios";

function AuthModal(props) {
    const [modalType, setModalType] = useState('login')
    const [email, setEmail] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [message, setMessage] = useState("")
    const modalContext = useContext(AuthModalContext)
    const visibleClass = modalContext.show != 'false' ? 'block' : 'hidden'
    const authModalRef = useRef(null); // Create ref for the dropdown
    const user = useContext(UserContext);

    useClickAway(authModalRef, () => modalContext.setShow('false'));

    if (modalContext.show != modalType) {
        setModalType(modalContext.show)
    }
    function register(e) {
        e.preventDefault();
        const data = { email, username, password }
        console.log(`server: ${import.meta.env.VITE_SERVER_URL}user/register`)
        axios.post(`${import.meta.env.VITE_SERVER_URL}user/register`, data, { withCredentials: true })
            .then(() => {
                user.getUser();
                modalContext.setShow('false');
                setEmail('');
                setPassword('');
                setUsername('');
                setMessage('')
            })
            .catch(error => {
                console.error('register error:', error);
                // pull the message out of the response body (with a fallback)
                const msg = error.response?.data?.message || 'An unexpected error occurred';
                setMessage(msg);
            });
    }

    function login() {
        const data = { username, password }
        console.log(`server: ${import.meta.env.VITE_SERVER_URL}user/login`)
        axios.post(`${import.meta.env.VITE_SERVER_URL}user/login`, data, { withCredentials: true })
            .then(() => {
                user.getUser();
                modalContext.setShow('false');
                setEmail('');
                setPassword('');
                setUsername('');
                setMessage('')
            })
            .catch(error => {
                console.error('Login error:', error);
                // pull the message out of the response body (with a fallback)
                const msg = error.response?.data?.message || 'An unexpected error occurred';
                setMessage(msg);
            });
    }
    useEffect(()=>{
        setMessage("")
    },[modalType])

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
                {message && (
                    <p className="text-red-500 py-3">*{message}*</p>
                )}
                {modalType == 'login' && (
                    <div>
                        <Button className="w-full py-2 mb-3 hover:opacity-75" onClick={login}>
                            Log In
                        </Button>
                        New to Reddit? <button className="text-blue-300 hover:opacity-75" onClick={() => modalContext.setShow('register')}>Sign Up</button>
                    </div>
                )}
                {modalType == 'register' && (
                    <div>
                        <Button className="w-full py-2 mb-3 hover:opacity-75" onClick={register}>
                            Sign Up
                        </Button>
                        Already a redditor? <button className="text-blue-300 hover:opacity-75" onClick={() => modalContext.setShow('login')}>Log In</button>
                    </div>
                )}

            </div>
        </div>

    )
}
export default AuthModal