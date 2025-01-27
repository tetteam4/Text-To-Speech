
// frontend/src/components/ui/ConversationsList.js
import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAudioMessages, clearMessages } from "../../redux/user/audioMessageSlice";
import { Link } from "react-router-dom";
import socket from "../../socket";

function ConversationsList() {
    const dispatch = useDispatch();
    const { messages, loading, error } = useSelector(
        (state) => state.audioMessage
    );
    const { currentUser } = useSelector((state) => state.user);
    const [conversations, setConversations] = useState({});
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [lastSeen, setLastSeen] = useState({});

   const fetchLastSeen = async (userId) => {
        try {
            const response = await fetch("/api/user/lastSeen/" + userId, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            const data = await response.json();
            if (response.ok) {
                setLastSeen((prev) => ({ ...prev, [userId]: data.lastSeen }));
            }
        } catch (error) {
            console.log(error);
        }
    };


     useEffect(() => {
        const fetchUsersOnline = async () => {
            try {
                const response = await fetch("/api/user/online", {
                  method: "GET",
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                });
                const data = await response.json();
                if (response.ok) {
                  setOnlineUsers(data);
                }
            } catch (error) {
                console.log(error);
            }
        };
       fetchUsersOnline()
         socket.on('connect', () => {
             fetchUsersOnline();

        });
        socket.on('disconnect', () => {
            setOnlineUsers([])
         });

         return () => {
            socket.off('connect')
           socket.off('disconnect');

         }

    }, [currentUser._id]);

  const getConversationLastSeen = useCallback(
    (messages) => {
      if (messages) {
        messages.map((message) => {
          if (message.senderId._id !== currentUser._id) {
            fetchLastSeen(message.senderId._id);
          }
        });
      }
    },
    [fetchLastSeen, currentUser._id]
  );
    const formatTime = (dateString) => {
        const date = new Date(dateString);
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        const formattedTime = `${hours}:${
            minutes < 10 ? "0" + minutes : minutes
        } ${ampm}`;
        return formattedTime;
    };
    useEffect(() => {
        dispatch(fetchAudioMessages());
    }, [dispatch]);

    useEffect(() => {
        const groupedMessages = {};

        if (messages) {
            messages.forEach((message) => {
                const otherUserId =
                    message.senderId._id === currentUser._id
                        ? message.receiverId._id
                        : message.senderId._id;

                if (!groupedMessages[otherUserId]) {
                    groupedMessages[otherUserId] = {
                        messages: [],
                        userInfo: null,
                    };
                }
                groupedMessages[otherUserId].messages.push(message);
                if (message.senderId._id !== currentUser._id) {
                  groupedMessages[otherUserId].userInfo = message.senderId;
                } else{
                      groupedMessages[otherUserId].userInfo = null;
                }
            });

            setConversations(groupedMessages);
            getConversationLastSeen(messages);
        }
    }, [messages, currentUser, getConversationLastSeen]);

    return (
        <div className="p-4 md:p-6 lg:p-8 w-full pt-16">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
                Conversations
            </h2>
            <div className="max-h-[600px] overflow-y-auto p-2 border rounded">
                {Object.keys(conversations).length > 0 &&
                    Object.keys(conversations).map((userId) => {
                        const conversation = conversations[userId];
                        const lastMessage =
                            conversation.messages[conversation.messages.length - 1];
                        const lastMessageContent = lastMessage?.message
                            ? lastMessage.message
                            : "Audio Message";
                        const conversationUser = conversation.userInfo;
                        return (
                            <Link
                                to={`/dashboard?tab=audio-message&receiver=${userId}`}
                                className="w-full"
                                key={userId}
                                onClick={() => dispatch(clearMessages())}
                            >
                                <div className="flex items-center gap-3 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 p-3  rounded-md">
                                    <img
                                        src={conversationUser?.profilePicture}
                                        alt={conversationUser?.username || "user"}
                                        className="w-12 h-12 object-cover rounded-full bg-gray-300"
                                    />
                                    <div className="flex-grow">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-bold">
                                                {conversationUser?.username}{" "}
                                            </h3>
                                             <p className="text-gray-600 text-sm dark:text-gray-400">
                                                     {formatTime(lastMessage?.createdAt)}
                                             </p>
                                        </div>
                                         <p className="text-gray-600 dark:text-gray-400 truncate">
                                                {lastMessageContent}
                                           </p>
                                    </div>

                                  {onlineUsers && onlineUsers.includes(userId) && (
                                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    )}
                                    {!onlineUsers.includes(userId) && lastSeen[userId] &&(
                                      <p className="text-gray-600 text-sm dark:text-gray-400">
                                            last seen {formatTime(lastSeen[userId])}{" "}
                                       </p>

                                    )}
                                </div>
                            </Link>
                        );
                    })}
                {Object.keys(conversations).length === 0 && !loading && (
                    <p>You don't have any conversations yet</p>
                )}
                {loading && (
                    <p className="dark:text-gray-300">Loading conversations...</p>
                )}
                {error && (
                    <p className="dark:text-red-300">Error loading conversations</p>
                )}
            </div>
        </div>
    );
}

export default ConversationsList;