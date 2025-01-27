import React, { useEffect, useState, useRef, useCallback } from "react";
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
import {
  FaPlay,
  FaPause,
  FaPaperclip,
  FaMicrophone,
  FaPaperPlane,
} from "react-icons/fa";
import socket from "../../socket";
import ConversationsList from "../ui/ConversationsList";
import { useLocation } from "react-router-dom";
import InputText from "./InputText";
import Dropdown from "./Dropdown";

function AudioMessage() {
  const dispatch = useDispatch();
  const { messages, loading, error } = useSelector(
    (state) => state.audioMessage
  );
  const { currentUser } = useSelector((state) => state.user);
  const { history } = useSelector((state) => state.history);
  const [selectedReceiver, setSelectedReceiver] = useState("");
  const [selectedAudioHistoryId, setSelectedAudioHistoryId] = useState("");
  const [messageText, setMessageText] = useState("");
  const [playingAudioId, setPlayingAudioId] = useState(null);
  const audioRefs = useRef({});
  const [users, setUsers] = useState([]);
  const location = useLocation();
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const audioRecorder = useRef(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showHistoryDropdown, setShowHistoryDropdown] = useState(false);

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
  useEffect(() => {
    const urlPrams = new URLSearchParams(location.search);
    const receiverFromUrl = urlPrams.get("receiver");
    if (receiverFromUrl) {
      const user = users.find((user) => user._id === receiverFromUrl);
      setSelectedReceiver(receiverFromUrl);
      setSelectedUser(user);
    } else {
      setSelectedUser(null);
      setSelectedReceiver("");
    }
  }, [location, users]);
  const handleSendMessage = async () => {
    if (!selectedAudioHistoryId && !messageText && !recordedAudio)
      return toast.error("Please record audio or type a message");
    if (!selectedReceiver)
      return toast.error("Please select a user to send the message");
    let audioHistoryId = selectedAudioHistoryId;
    let messageData = {
      receiverId: selectedReceiver,
      audioHistoryId: audioHistoryId,
      message: messageText,
    };
    if (!audioHistoryId && recordedAudio) {
      try {
        const formData = new FormData();
        formData.append("audio", recordedAudio, "voice-note.mp3");
        const res = await fetch("/api/audio/upload", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        });
        const data = await res.json();
        if (res.ok) {
          messageData.audioHistoryId = data.historyId;
        } else {
          toast.error("Error uploading the audio");
          return;
        }
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
    try {
      const message = await dispatch(createAudioMessage(messageData)).unwrap();
      dispatch(updateMessageState(message));
      setSelectedAudioHistoryId("");
      setMessageText("");
      setRecordedAudio(null);
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
  const markAsRead = useCallback(
    async (messageId) => {
      try {
        await dispatch(markMessageAsRead(messageId)).unwrap();
      } catch (error) {
        console.log(error.message);
      }
    },
    [dispatch]
  );
  const markAsDelivered = useCallback(
    async (messageId) => {
      try {
        await dispatch(deliveredMessage(messageId)).unwrap();
      } catch (error) {
        console.log(error.message);
      }
    },
    [dispatch]
  );

  useEffect(() => {
    dispatch(fetchAudioMessages());
  }, [dispatch, location, selectedReceiver]);

  useEffect(() => {
    dispatch(fetchHistory());
  }, [dispatch]);
  useEffect(() => {
    if (currentUser) {
      socket.on("receive_message", (message) => {
        if (
          message.senderId._id === currentUser._id ||
          message.receiverId._id === currentUser._id
        ) {
          dispatch(updateMessageState(message));
        }
      });

      socket.on("message_delivered", (message) => {
        if (
          message.senderId._id === currentUser._id ||
          message.receiverId._id === currentUser._id
        ) {
          dispatch(updateMessageState(message));
        }
      });

      socket.on("message_read", (message) => {
        if (
          message.senderId._id === currentUser._id ||
          message.receiverId._id === currentUser._id
        ) {
          dispatch(updateMessageState(message));
        }
      });
      return () => {
        socket.off("receive_message");
        socket.off("message_delivered");
        socket.off("message_read");
      };
    }
  }, [dispatch, currentUser, selectedReceiver]);
  const handleStartRecording = async () => {
    setIsRecording(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioRecorder.current = new MediaRecorder(stream);
      audioRecorder.current.start();
      const audioChunks = [];
      audioRecorder.current.addEventListener("dataavailable", (event) => {
        audioChunks.push(event.data);
      });
      audioRecorder.current.addEventListener("stop", async () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/mpeg" });

        setRecordedAudio(audioBlob);
      });
    } catch (error) {
      console.log(error);
      toast.error("Error Accessing the microphone");
      setIsRecording(false);
    }
  };
  const handleStopRecording = () => {
    setIsRecording(false);
    if (audioRecorder.current) {
      audioRecorder.current.stop();
      audioRecorder.current.dispatchEvent(new Event("stop"));
      audioRecorder.current = null;
    }
  };
  const toggleHistoryDropdown = () => {
    setShowHistoryDropdown(!showHistoryDropdown);
  };
  const handleHistorySelect = (selected) => {
    setSelectedAudioHistoryId(selected.id);
    setShowHistoryDropdown(false);
  };
  return (
    <div className="p-4 md:p-6 lg:p-8 w-full pt-16 flex flex-col md:flex-row gap-2">
      <div className="w-full md:w-1/4">
        <ConversationsList />
      </div>

      <div className="flex-grow flex flex-col  border rounded p-2 relative dark:bg-gray-900 dark:border-gray-700">
        {selectedUser && (
          <div className="p-3 flex gap-2 border-b border-gray-300 dark:border-gray-700">
            <img
              src={selectedUser?.profilePicture}
              alt={selectedUser?.username}
              className="w-10 h-10 object-cover rounded-full bg-gray-300"
            />
            <div>
              <h3 className="font-bold text-gray-700 dark:text-gray-300">
                {selectedUser?.username}
              </h3>
              {/*<p className="text-gray-500 text-sm truncate">Last seen  </p>*/}
            </div>
          </div>
        )}
        <div className="flex-grow overflow-y-auto h-[500px] scrollbar scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600">
          {messages &&
            messages.map((message) => (
              <div
                key={message._id}
                className={`mb-4 p-3  rounded shadow-sm max-w-[80%]  ${
                  message.senderId._id === currentUser._id
                    ? "bg-primary/10 dark:bg-gray-700 ml-auto  "
                    : "bg-gray-100 dark:bg-gray-800 mr-auto"
                }`}
              >
                <div className="flex flex-col">
                  <div className="flex justify-between items-center  pb-1 mb-1">
                    <p className="font-bold text-sm text-gray-700 dark:text-white ">
                      {message.senderId._id === currentUser._id
                        ? `Me`
                        : message.senderId.username}
                    </p>
                    <p className="text-gray-500 dark:text-gray-300 text-sm ">
                      {new Date(message.createdAt).toLocaleString()}
                    </p>
                  </div>
                  {message.message && (
                    <p className="mb-1 text-gray-700 dark:text-gray-200 break-words">
                      {message.message}
                    </p>
                  )}

                  <div className="flex items-center gap-2">
                    <Button
                      size="small"
                      onClick={() =>
                        handlePlayAudio(
                          message._id,
                          message.audioHistoryId?.audioFileUrl
                        )
                      }
                    >
                      {playingAudioId === message._id ? (
                        <FaPause />
                      ) : (
                        <FaPlay />
                      )}
                    </Button>
                    {message.audioHistoryId && (
                      <audio
                        src={message.audioHistoryId?.audioFileUrl}
                        ref={(ref) => {
                          if (ref) {
                            audioRefs.current[message._id] = ref;
                          }
                        }}
                        onEnded={() => handleEnded(message._id)}
                        style={{ display: "none" }}
                      />
                    )}
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
                      <p className="text-gray-500 dark:text-gray-300 text-xs ">
                        delivered
                      </p>
                    )}
                  {message.status === "read" &&
                    message.senderId._id !== currentUser._id && (
                      <p className="text-gray-500 dark:text-gray-300 text-xs ">
                        read
                      </p>
                    )}
                </div>
              </div>
            ))}
        </div>
        <div className="border-t border-gray-300 dark:border-gray-600 p-2 pt-4 flex  items-center gap-2">
          <div className="relative">
            <Button
              onClick={toggleHistoryDropdown}
              size="small"
              className="rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <FaPaperclip className="h-5 w-5" />
            </Button>
            {showHistoryDropdown && (
              <div className="absolute left-0 mt-2 w-48 bg-white border rounded shadow-md z-20 dark:bg-gray-700 dark:border-gray-600">
                {history.map((item) => (
                  <button
                    key={item.id}
                    className="block w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-white"
                    onClick={() => handleHistorySelect(item)}
                  >
                    {item.originalText.length > 30
                      ? `${item.originalText.slice(0, 30)}...`
                      : item.originalText}
                  </button>
                ))}
              </div>
            )}
          </div>

          {recordedAudio && (
            <audio
              controls
              src={URL.createObjectURL(recordedAudio)}
              className="w-1/5"
            />
          )}
          <div className="flex-grow">
            <InputText
              placeholder="Type your message or record a voice note..."
              value={messageText}
              onTextChange={setMessageText}
              style={{ height: "20px", borderRadius: "1.25rem" }}
            />
          </div>
          {!isRecording && (
            <Button
              onClick={handleStartRecording}
              size="small"
              className="rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <FaMicrophone className="h-5 w-5" />
            </Button>
          )}
          {isRecording && (
            <Button
              onClick={handleStopRecording}
              size="small"
              className="rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              Stop
            </Button>
          )}
          {!isRecording && (
            <Button
              onClick={handleSendMessage}
              size="small"
              className="rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <FaPaperPlane className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default AudioMessage;
