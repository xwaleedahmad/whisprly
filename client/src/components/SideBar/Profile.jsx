import { TbMenuDeep } from "react-icons/tb";
import { FaUserCog } from "react-icons/fa";
import { ImUsers } from "react-icons/im";
import { ImExit } from "react-icons/im";

import { useAuthContext } from "../../context/AuthContext";
import useGetFriendRequests from "../../hooks/useGetFriendRequests";
import useLogout from "../../hooks/useLogout";
import useAddFriend from "../../hooks/useAddFriend";
import useRejectFriendRequest from "../../hooks/useRejectFriendRequest";

import { Link } from "react-router-dom";
import { useState } from "react";
import useGlobalState from "../../zustand/useGlobalState";

const Profile = () => {
  const { authUser } = useAuthContext();
  const { logout } = useLogout();
  const {addFriend} = useAddFriend()
  const { getFriendRequests } = useGetFriendRequests()
  const {rejectFriendRequest} = useRejectFriendRequest();
  const {friendRequests,setFriendRequests,setHandleFriendRequest,setAddFriend} =  useGlobalState();

  const [loading, setLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState({});
  
  const handleFriendRequests = async () => {
    const data = await getFriendRequests();
    setFriendRequests(data);
    setLoading(true)
  };

  const handleAddFriend = async (id) => {
    setButtonLoading((prev=>({...prev,[id]:true})))
    const res = await addFriend(id);
    setAddFriend(res)
    setHandleFriendRequest(id)
    setButtonLoading((prev=>({...prev,[id]:false})))
  }
  const handleRejectFriendRequest = async (id) => {
    setButtonLoading((prev=>({...prev,[id]:true})))
    await rejectFriendRequest(id);
    setHandleFriendRequest(id)
    setButtonLoading((prev=>({...prev,[id]:false})))

  }

  return (
    <div className="w-full flex items-center justify-between p-5  border-b borderColor">
      {authUser && (
        <Link to="/profile" key={authUser._id} className="flex gap-2">
          <div className="avatar">
            <div className="w-12 bg-secondary skeleton rounded-full">
              <img src={authUser.profilePic} alt="Profile Pic" />
            </div>
          </div>
          <div className="name -space-y-1">
            <h2>{authUser.fullName}</h2>
            <h5 className="ps-1 text-xs">{authUser.userName}</h5>
          </div>
        </Link>
      )}

      <div className="dropdown dropdown-bottom dropdown-end">
        <div tabIndex={0} role="button" className="btn text-2xl btn-ghost text-gray-300 hover:bg-primary ">
          <TbMenuDeep />
        </div>
        <ul tabIndex={0} className="dropdown-content bg-quaternary  menu text-gray-300  rounded-box z-50 shadow-2xl">
          <li >
            <Link to="/profile"  className="text-md hover:bg-primary">
              <span className="text-nowrap">Profile</span>
              <FaUserCog />
            </Link>
          </li>
          <li >
            <button  onClick={() => {document.getElementById("friendRequests").showModal(),handleFriendRequests();}}  className="text-md hover:bg-primary">
              <span className="text-nowrap">Requests</span>
              <ImUsers />
            </button>
          </li>
          <li>
            <button onClick={logout} className="bg-transparent border-none text-md hover:bg-primary">
              <span>Logout</span>
              <ImExit  />
            </button>
          </li>
        </ul>
      </div>

      <dialog id="friendRequests" className="modal ">
        <div className="modal-box absolute py-6 px-4 top-24 xl:relative xl:top-0  bg-primary w-full xl:w-[400px] xl:max-w-[500px]  rounded-xl shadow-lg p-3">
          <form method="dialog">
            <button className="btn btn-sm text-base btn-circle hover:bg-quaternary text-gray-400 btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-semibold text-2xl mb-5 ">Friend Requests</h3>
         {!loading ? 
          <div >
            <div className="flex items-center gap-2">
              <div className="skeleton h-10 w-10 shrink-0 rounded-full bg-secondary"></div>
              <div className="flex flex-col gap-1">
                <div className="skeleton h-3 w-24 bg-secondary"></div>
                <div className="skeleton h-3 w-20 bg-secondary"></div>
              </div>
            </div>
          </div>   
          : <>
           {friendRequests && friendRequests.length > 0 ? (
            friendRequests.map((user,index)=>(
              <div key={user._id} className={`w-full ${index < friendRequests.length - 1  ? "border-1 border-b border-secondary" : ""} flex items-center justify-between py-2  cursor-default`}>
           <div className="flex gap-2 items-center  flex-grow">
             <div className={`avatar`}>
               <div className="w-10 bg-secondary skeleton rounded-full">
                 <img src={user.profilePic} />
               </div>
             </div>
             <div className="-space-y-1">
               <h2 className="text-base">{user.fullName}</h2>
               <h5 className="text-[11px]">{user.userName}</h5>
             </div>
           </div>
           <div className="flex gap-2">
             <button disabled={buttonLoading[user._id]} onClick={()=>handleRejectFriendRequest(user._id)} className={`text-xs disabled:cursor-wait hover:bg-red-800 bg-red-700 text-gray-200 rounded-md px-3 py-1`}>
               Reject
             </button>
             <button disabled={buttonLoading[user._id]} onClick={()=>handleAddFriend(user._id)} className={`text-xs disabled:cursor-wait hover:bg-green-700 bg-green-600 text-gray-200 rounded-md px-3 py-1`}>
               Accept
             </button>
           </div>
         </div>
            ))
          ) : (
            <p className=" text-base pt-3 ps-2 text-gray-300 ">No Requests. Check back later!</p>
          )}
         </>
         }
        </div>
      </dialog>
    </div>
  );
};

export default Profile;
