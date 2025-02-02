import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchHistory } from "../redux/user/historySlice";
import { toast } from "react-toastify";
import { Button, Label, TextInput, Select, Spinner } from "flowbite-react";
import axios from "axios";

function ScheduledMessage() {
  const dispatch = useDispatch();
  const { history, loading: historyLoading } = useSelector(
    (state) => state.history
  );
  const [scheduledMessages, setScheduledMessages] = useState(null);
  const [audioHistoryId, setAudioHistoryId] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [callNumber, setCallNumber] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [loading, setLoading] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
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
        }
      } catch (error) {
        console.error("Error loading scheduled messages:", error);
        toast.error("Error loading scheduled messages");
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

  useEffect(() => {
    dispatch(fetchHistory());
  }, [dispatch]);

  return (
    <div className="p-4 md:p-6 lg:p-8 w-full pt-16">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
        Scheduled Message
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        Here you can schedule a message for future delivery.
      </p>
      <form
        className="flex flex-col gap-4 mb-8"
        onSubmit={handleCreateScheduledMessage}
      >
        <div>
          <Label htmlFor="audioHistoryId" value="Select audio from history" />
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
      <div>
        <h3>Scheduled Messages</h3>
        {loadingScheduled ? (
          <p>Loading scheduled messages...</p>
        ) : scheduledMessages === null ? (
          <p>You don't have any scheduled message</p>
        ) : (
          <ul className="overflow-y-scroll max-h-96 ">
            {scheduledMessages.map((message) => (
              <li
                key={message._id}
                className="p-4 border rounded shadow mb-2 bg-gray-100 dark:bg-gray-700"
              >
                <div className="flex items-center justify-between">
                  <p className="text-gray-800 dark:text-white font-semibold">
                    {message.audioHistoryId.originalText.length > 30
                      ? `${message.audioHistoryId.originalText.slice(0, 30)}...`
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
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default ScheduledMessage;
