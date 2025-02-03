import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchHistory } from "../redux/user/historySlice";
import { toast } from "react-toastify";
import {
  Button,
  Label,
  TextInput,
  Select,
  Spinner,
  Modal,
} from "flowbite-react";
import axios from "axios";

function ScheduledMessage() {
  const dispatch = useDispatch();
  const { history, loading: historyLoading } = useSelector(
    (state) => state.history
  );
  const [scheduledMessages, setScheduledMessages] = useState([]); // Initialize as an array
  const [audioHistoryId, setAudioHistoryId] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [callNumber, setCallNumber] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [loading, setLoading] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const [openModal, setOpenModal] = useState(null);
  const [messageToDelete, setMessageToDelete] = useState(null);
  const [loadingScheduled, setLoadingScheduled] = useState(false);

  useEffect(() => {
    const fetchScheduledMessages = async () => {
      setLoadingScheduled(true);
      try {
        const response = await axios.get("/api/scheduledMessage/get", {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (response.status === 200) {
          setScheduledMessages(response.data);
        } else {
          console.error("failed to fetch scheduled messages");
          toast.error("Failed to load scheduled messages");
          setScheduledMessages([]);
        }
      } catch (error) {
        console.error("Error loading scheduled messages:", error);
        toast.error("Error loading scheduled messages");
        setScheduledMessages([]);
      } finally {
        setLoadingScheduled(false);
      }
    };

    fetchScheduledMessages();
  }, []);

  const updateAudio = useCallback(() => {
    if (history && history.length > 0) {
      setAudioHistoryId(history[0].id);
    }
  }, [history]);

  useEffect(() => {
    updateAudio();
  }, [updateAudio]);

  const handleCreateScheduledMessage = async (e) => {
    console.log("handleCreateScheduledMessage function was called");
    e.preventDefault();
    setLoading(true);
    if (
      !audioHistoryId ||
      !whatsappNumber ||
      !scheduledTime ||
      !scheduledDate
    ) {
      setLoading(false);
      return toast.error("All fields are required!");
    }
    console.log("Audio ID:", audioHistoryId);
    console.log("whatsApp number:", whatsappNumber);
    console.log("schedule time:", scheduledTime);
    console.log("schedule date:", scheduledDate);
    console.log("call number:", callNumber);

    try {
      const res = await axios.post(
        "/api/scheduledMessage/create",
        {
          audioHistoryId,
          whatsappNumber,
          scheduledTime,
          scheduledDate,
          callNumber,
        },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.status === 201) {
        setScheduledMessages((prev) => {
          const newScheduledMessages = [
            ...(prev || []),
            res.data.scheduledMessage,
          ];
          return newScheduledMessages;
        });
        toast.success("Scheduled successfully");
        setAudioHistoryId("");
        setWhatsappNumber("");
        setScheduledTime("");
        setScheduledDate("");
        setCallNumber("");
      } else {
        toast.error("Scheduled failed");
      }
    } catch (error) {
      toast.error("Scheduled failed");
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteMessage = async () => {
    setLoadingScheduled(true);
    try {
      const res = await axios.delete(
        `/api/scheduledMessage/delete/${messageToDelete._id}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.status === 200) {
        setScheduledMessages((prevMessages) =>
          prevMessages.filter((message) => message._id !== messageToDelete._id)
        );
        toast.success("Scheduled message deleted successfully");
        setOpenModal(null);
        setMessageToDelete(null);
      } else {
        toast.error("Failed to delete scheduled message");
        setOpenModal(null);
      }
    } catch (error) {
      toast.error("Failed to delete scheduled message");
      setOpenModal(null);
    } finally {
      setLoadingScheduled(false);
    }
  };

  useEffect(() => {
    dispatch(fetchHistory());
  }, [dispatch]);

  const openDeleteModal = (message) => {
    setMessageToDelete(message);
    setOpenModal("delete");
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 w-full pt-16">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
        Scheduled Message
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        Here you can schedule a message for future delivery.
      </p>
      <div className="flex flex-wrap">
        {/* Left side - Form */}
        <div className="w-full md:w-1/2 pr-4">
          <form
            className="flex flex-col gap-4 mb-8"
            onSubmit={handleCreateScheduledMessage}
          >
            <div>
              <Label
                htmlFor="audioHistoryId"
                value="Select audio from history"
              />
              <Select
                id="audioHistoryId"
                value={audioHistoryId}
                onChange={(e) => setAudioHistoryId(e.target.value)}
                disabled={historyLoading || history?.length === 0}
                required
              >
                <option value="">Select an audio</option>
                {history &&
                  history.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.originalText.length > 30
                        ? `${item.originalText.slice(0, 30)}...`
                        : item.originalText}
                    </option>
                  ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="whatsappNumber" value="WhatsApp Number" />
              <TextInput
                type="tel"
                id="whatsappNumber"
                placeholder="09........."
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="callNumber" value="Call Number (optional)" />
              <TextInput
                type="tel"
                id="callNumber"
                placeholder="09........."
                value={callNumber}
                onChange={(e) => setCallNumber(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="scheduledTime" value="Scheduled Time" />
              <TextInput
                type="time"
                id="scheduledTime"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="scheduledDate" value="Scheduled Date" />
              <TextInput
                type="date"
                id="scheduledDate"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                required
              />
            </div>
            <Button type={"submit"} disabled={loading}>
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span>Scheduling...</span>
                </>
              ) : (
                "Schedule Message"
              )}
            </Button>
          </form>
        </div>

        {/* Right Side - Logs */}
        <div className="w-full md:w-1/2 pl-4">
          <h3>Scheduled Messages</h3>
          {loadingScheduled ? (
            <p>Loading scheduled messages...</p>
          ) : scheduledMessages &&
            Array.isArray(scheduledMessages) &&
            scheduledMessages.length > 0 ? (
            <ul className="overflow-y-scroll max-h-96 ">
              {scheduledMessages &&
                scheduledMessages.map((message) => (
                  <li
                    key={message._id}
                    className="p-4 border rounded shadow mb-2 bg-gray-100 dark:bg-gray-700 relative"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-gray-800 dark:text-white font-semibold">
                        {message.audioHistoryId.originalText.length > 30
                          ? `${message.audioHistoryId.originalText.slice(
                              0,
                              30
                            )}...`
                          : message.audioHistoryId.originalText}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm ">
                        {new Date(message.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm ">
                      Status : {message.status}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm ">
                      Scheduled Date :{" "}
                      {new Date(message.scheduledDate).toLocaleDateString()}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm ">
                      Scheduled Time : {message.scheduledTime}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm ">
                      WhatsApp Number : {message.whatsappNumber}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm ">
                      Call Number :{" "}
                      {message.callNumber ? message.callNumber : "Not Set"}
                    </p>
                    <Button
                      color="failure"
                      onClick={() => openDeleteModal(message)}
                      size="xs"
                      className="absolute top-2 right-2"
                    >
                      Delete
                    </Button>
                  </li>
                ))}
            </ul>
          ) : (
            <p>You don't have any scheduled message</p>
          )}
        </div>
        <Modal
          show={openModal === "delete"}
          size="md"
          popup
          onClose={() => setOpenModal(null)}
        >
          <Modal.Header />
          <Modal.Body>
            <div className="text-center">
              <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                Are you sure you want to delete this message?
              </h3>
              <div className="flex justify-center gap-4">
                <Button color="failure" onClick={handleDeleteMessage}>
                  Yes, I'm Sure{" "}
                </Button>
                <Button color="gray" onClick={() => setOpenModal(null)}>
                  No, cancel
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
}

export default ScheduledMessage;
