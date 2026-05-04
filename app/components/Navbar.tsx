import { useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router";
import { usePuterStore } from "~/lib/puter";

const Navbar = () => {
  const {auth} = usePuterStore();
    const [showProfile, setShowProfile] = useState(false);
    const navigate = useNavigate();
  return (
    <nav className="navbar">
      <Link to="/">
      <p className="text-2xl font-bold text-gradient">RESUMIND</p>
      </Link>
      <Link to="/upload" className="primary-button w-fit shadow-md hover:shadow-amber-800">
      Upload Resume
      </Link>
      <div className="flex items-center relative">
          <img src="/images/profile.png" alt="profile" className="size-15 p-1 cursor-pointer shadow-md hover:shadow-amber-800 bg-gray-200 rounded-full " onClick={()=> setShowProfile(!showProfile)}/>
      
        {showProfile && (
            <div className="absolute right-10 top-20 p-4 bg-[url('/images/bg-auth.svg')] bg-cover rounded-xl items-center flex flex-col gap-4 transition-all duration-700 border-4 border-purple-500">
                <h2 className="font-bold">Profile</h2>
               <p className=" text-gray-800 font-bold flex items-center gap-2">Username: <span className="text-sm text-gray-500">{auth.user?.username}</span></p> 
               <p className="text-md font-bold bg-red-400 p-2 rounded-full text-gray-200 shadow-md hover:shadow-amber-700 cursor-pointer" onClick={()=> navigate("/auth")}>Logout</p>
            </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar;
