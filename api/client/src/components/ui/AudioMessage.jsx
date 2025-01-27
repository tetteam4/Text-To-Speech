import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
fetchAudioMessages,
createAudioMessage,
markMessageAsRead,
clearMessages,
deliveredMessage,
updateMessageState,
} from "../../redux/user/audioMessageSlice";
import { fetchHistory } from "../../redux/user/historySlice";
import Button from "./Button";
import { toast } from "react-toastify";
import { FaPlay, FaPause } from "react-icons/fa";
import socket from "../../socket"; // Import the socket
import ConversationsList from "../ui/ConversationsList";
import { useLocation } from "react-router-dom";

function AudioMessage() {
  const dispatch = useDispatch();
  const { messages, loading, error } = useSelector(
    (state) => state.audioMessage
  );
  const { currentUser } = useSelector((state) => state.user);
  const { history } = useSelector((state) => state.history);
  const [selectedReceiver, setSelectedReceiver] = useState("");
  const [selectedAudioHistoryId, setSelectedAudioHistoryId] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [playingAudioId, setPlayingAudioId] = useState(null);
  const audioRefs = useRef({});
  const [users, setUsers] = useState([]);
  const location = useLocation();
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/user/getusers");
        const data = await res.json();
        if (res.ok) {
          setUsers(
            data.users.filter(
              (user) => user._id !== currentUser._id && user.activeForAudio
            )
          );
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchUsers();
  }, [currentUser._id]);

  const handleSendMessage = async () => {
    if (!selectedAudioHistoryId)
      return toast.error("Please select audio to send");
    if (!selectedReceiver)
      return toast.error("Please select a user to send the message");

    try {
      await dispatch(
        createAudioMessage({
          receiverId: selectedReceiver,
          audioHistoryId: selectedAudioHistoryId,
          message: messageText,
        })
      ).unwrap();

      setSelectedAudioHistoryId(null);
      setMessageText("");
      toast.success("Message sent successfully");
    } catch (error) {
      toast.error(error.message);
    }
  };
  const handlePlayAudio = (audioId, audioUrl) => {
    if (playingAudioId === audioId) {
      setPlayingAudioId(null);
      if (audioRefs.current[audioId]) {
        audioRefs.current[audioId].pause();
      }
      return;
    }
    setPlayingAudioId(audioId);
    if (audioRefs.current[audioId]) {
      audioRefs.current[audioId].src = audioUrl;
      audioRefs.current[audioId].play();
    }
  };

  const handleEnded = (audioId) => {
    setPlayingAudioId(null);
  };
  const markAsRead = async (messageId) => {
    try {
      await dispatch(markMessageAsRead(messageId)).unwrap();
    } catch (error) {
      console.log(error.message);
    }
  };
  const markAsDelivered = async (messageId) => {
    try {
      await dispatch(deliveredMessage(messageId)).unwrap();
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    dispatch(fetchAudioMessages());
  }, [dispatch, location]);

  useEffect(() => {
    dispatch(fetchHistory());
  }, [dispatch]);

  useEffect(() => {
    socket.on("receive_message", (message) => {
      dispatch(updateMessageState(message));
    });

    socket.on("message_delivered", (message) => {
      dispatch(updateMessageState(message));
    });
    socket.on("message_read", (message) => {
      dispatch(updateMessageState(message));
    });
    return () => {
      socket.off("receive_message");
      socket.off("message_delivered");
      socket.off("message_read");
    };
  }, [dispatch]);
  useEffect(() => {
    const urlPrams = new URLSearchParams(location.search);
    const receiverFromUrl = urlPrams.get("receiver");
    if (receiverFromUrl) {
      setSelectedReceiver(receiverFromUrl);
    }
  }, [location]);
  return (
    <div className="p-4 md:p-6 lg:p-8 w-full pt-16 flex flex-col md:flex-row gap-2">
      <div className="w-full md:w-1/4">
        <ConversationsList />
      </div>

      <div className="flex-grow">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
          Audio Message
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Note: Audio files are only retained for 72 hours.
        </p>

        <div className="mb-4">
          <label
            htmlFor="receiver"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Send to
          </label>
          <select
            id="receiver"
            className="mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:text-white"
            value={selectedReceiver}
            onChange={(e) => setSelectedReceiver(e.target.value)}
          >
            <option value="">Select a User</option>
            {users &&
              users.map((user) => (
                <option value={user._id} key={user._id}>
                  {user.username}
                </option>
              ))}
          </select>
        </div>
        <div className="mb-4">
          <label
            htmlFor="audioHistoryId"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Select from your Audio History
          </label>
          <select
            id="audioHistoryId"
            className="mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:text-white"
            value={selectedAudioHistoryId}
            onChange={(e) => setSelectedAudioHistoryId(e.target.value)}
          >
            <option value="">Select from your history</option>
            {history &&
              history.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.originalText.length > 30
                    ? `${item.originalText.slice(0, 30)}...`
                    : item.originalText}
                </option>
              ))}
          </select>
        </div>
        <div className="mb-4">
          <label
            htmlFor="textMessage"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Message (Optional)
          </label>
          <textarea
            id="textMessage"
            className="mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:text-white"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
          />
        </div>
        <Button
          onClick={handleSendMessage}
          disabled={!selectedReceiver || !selectedAudioHistoryId}
        >
          Send Message
        </Button>

        {loading && <p className="dark:text-gray-300">Loading messages...</p>}
        {error && <p className="dark:text-red-300">Error loading messages</p>}
        {messages.length === 0 && !loading && <p>No messages yet.</p>}
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
            Messages
          </h3>
          {messages &&
            messages.map((message) => (
              <div
                key={message._id}
                className="mb-4 p-3 border rounded shadow-sm bg-gray-100 dark:bg-gray-700 dark:border-gray-600"
              >
                <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-600 pb-2 mb-2">
                  <p className="text-gray-800 dark:text-white font-bold">
                    {message.senderId._id === currentUser._id
                      ? `Me`
                      : message.senderId.username}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm ">
                    {new Date(message.createdAt).toLocaleString()}
                  </p>
                </div>
                {message.message && (
                  <p className="mb-2 text-gray-700 dark:text-gray-200">
                    {message.message}
                  </p>
                )}

                <div className="flex items-center gap-2">
                  <Button
                    size="small"
                    onClick={() =>
                      handlePlayAudio(
                        message._id,
                        message.audioHistoryId.audioFileUrl
                      )
                    }
                  >
                    {playingAudioId === message._id ? <FaPause /> : <FaPlay />}
                  </Button>
                  <audio
                    src={message.audioHistoryId.audioFileUrl}
                    ref={(ref) => {
                      if (ref) {
                        audioRefs.current[message._id] = ref;
                      }
                    }}
                    onEnded={() => handleEnded(message._id)}
                    style={{ display: "none" }}
                  />
                  {message.status !== "read" &&
                    message.senderId._id !== currentUser._id && (
                      <Button
                        size="small"
                        variant="primary"
                        onClick={() => {
                          markAsDelivered(message._id);
                          markAsRead(message._id);
                        }}
                      >
                        Mark as Read
                      </Button>
                    )}
                </div>
                {message.status === "delivered" &&
                  message.senderId._id !== currentUser._id && (
                    <p className="text-gray-600 dark:text-gray-300 text-sm ">
                      delivered
                    </p>
                  )}
                {message.status === "read" &&
                  message.senderId._id !== currentUser._id && (
                    <p className="text-gray-600 dark:text-gray-300 text-sm ">
                      read
                    </p>
                  )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default AudioMessage;