import React, { useContext, useEffect, useState } from 'react';
import assets, { imagesDummyData } from '../assets/assets';
import { ChatContext } from '../../context/ChatContext';
import { AuthContext } from '../../context/AuthContext';

const RightSidebar = () => {

    const {selectedUser, messages} = useContext(ChatContext);
    const {logout, onlineUsers} = useContext(AuthContext);
    const [msgImage, setMsgImages] = useState([]);
    
    useEffect(() => {
        setMsgImages(
            messages.filter(msg => msg.image).map(msg => msg.image)
        );
    }, [messages]);

    return selectedUser && (
        <div className={`bg-[#8185B2]/10 text-white w-full relative overflow-y-scroll ${selectedUser ? "max-md:hidden" : ""}`}>
            <div className='pt-16 flex flex-col items-center gap-2 text-xs font-light mx-auto'>
                <img src={selectedUser?.profilePic || assets.avatar_icon} alt="" className='w-20 aspect-[1/1] rounded-full'/>
                {/* FIX: Correctly render the user's name and online status */}
                <div className='px-10 text-xl font-medium mx-auto flex items-center gap-2'>
                    {onlineUsers.includes(selectedUser._id) && (
                        <span className='w-2 h-2 rounded-full bg-green-500'></span>
                    )}
                    {selectedUser.fullName}
                </div>
                <p className='px-10 mx-auto break-words'>{selectedUser.bio}</p>
            </div>
            <hr className='border-[#ffffff50] my-4'/>
            <div className='px-5 text-xs flex flex-col h-[calc(100%-250px)]'>
                <p>Media</p>
                <div className='mt-2 flex-1 overflow-y-scroll grid grid-cols-2 gap-4 opacity-80'>
                    {msgImage.map((url, index) => (
                        <div onClick={() => window.open(url)} className='cursor-pointer rounded' key={index}>
                            <img src={url} className='rounded-md h-full' alt="" />
                        </div>
                    ))}
                </div>
                {/* Logout button always at bottom, centered */}
                <div onClick={() => logout()} className="flex justify-center mt-4 mb-6">
                    <button className='bg-gradient-to-r from-purple-400 to-violet-600 text-white text-sm font-light py-2 px-10 rounded-full cursor-pointer'>
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RightSidebar;