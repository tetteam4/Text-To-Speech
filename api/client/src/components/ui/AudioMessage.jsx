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
import { FaPlay, FaPause, FaPaperclip } from "react-icons/fa";
import socket from "../../socket";
import ConversationsList from "../ui/ConversationsList";
import { useLocation } from "react-router-dom";
import InputText from "./InputText";

function AudioMessage() {
  const dispatch = useDispatch();
  const { messages, loading, error } = useSelector(
    (state) => state.audioMessage
  );
  const { currentUser } = useSelector((state) => state.user);
  const { history } = useSelector((state) => state.history);
  const [selectedReceiver, setSelectedReceiver] = useState("");
  const [selectedAudioHistoryId, setSelectedAudioHistoryId] = useState(""); // Changed initial value to ""
  const [messageText, setMessageText] = useState("");
  const [playingAudioId, setPlayingAudioId] = useState(null);
  const audioRefs = useRef({});
  const [users, setUsers] = useState([]);
  const location = useLocation();
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const audioRecorder = useRef(null);
  const [selectedUser, setSelectedUser] = useState(null);

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
    let audioHistoryId = selectedAudioHistoryId || null;
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

      setSelectedAudioHistoryId(""); // reset select input
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
        <div className="border-t border-gray-300 dark:border-gray-600 p-2 pt-4 flex gap-2">
          {recordedAudio && (
            <audio
              controls
              src={URL.createObjectURL(recordedAudio)}
              className="w-1/5"
            />
          )}
          <div className="flex flex-col gap-2 w-3/5">
            <InputText
              placeholder="type your message"
              value={messageText}
              onTextChange={setMessageText}
            />
            <select
              id="audioHistoryId"
              className=" py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:text-white"
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
          <div className="flex gap-1">
            {!isRecording && (
              <Button onClick={handleStartRecording} size="small">
                Record
              </Button>
            )}
            {isRecording && (
              <Button onClick={handleStopRecording} size="small">
                Stop
              </Button>
            )}

            <Button
              onClick={handleSendMessage}
              disabled={
                !selectedReceiver ||
                (!selectedAudioHistoryId && !messageText && !recordedAudio)
              }
              size="small"
            >
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AudioMessage;
