import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Button, Spinner, Modal, Table } from "flowbite-react";
import axios from "axios";
import { HiOutlineExclamationCircle } from "react-icons/hi";

function ScheduledMessageDashboard() {
  const [scheduledMessages, setScheduledMessages] = useState(null);
  const [loadingScheduled, setLoadingScheduled] = useState(false);
  const [openModal, setOpenModal] = useState(null);
  const [messageToDelete, setMessageToDelete] = useState(null);

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

  const openDeleteModal = (message) => {
    setMessageToDelete(message);
    setOpenModal("delete");
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 w-full pt-16">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
        Scheduled Message Dashboard
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        Here you can manage all of your scheduled messages.
      </p>
      <div className=" flex-1 table-auto overflow-x-scroll md:mx-auto p-3 scrollbarscrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500 ">
        {loadingScheduled ? (
          <p>Loading scheduled messages...</p>
        ) : scheduledMessages === null || scheduledMessages.length === 0 ? (
          <p>You don't have any scheduled message</p>
        ) : (
          <Table hoverable className="shadow-lg ">
            <Table.Head>
              <Table.HeadCell> Delete</Table.HeadCell>
              <Table.HeadCell> Audio Text</Table.HeadCell>
              <Table.HeadCell> Status</Table.HeadCell>
              <Table.HeadCell>Scheduled Date</Table.HeadCell>
              <Table.HeadCell>Scheduled Time</Table.HeadCell>
              <Table.HeadCell>WhatsApp Number</Table.HeadCell>
              <Table.HeadCell>Call Number</Table.HeadCell>
              <Table.HeadCell>Date into</Table.HeadCell>
            </Table.Head>
            {scheduledMessages.map((message) => (
              <Table.Body key={message._id} className="divide-y">
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 hover:bg-slate-200">
                  <Table.Cell>
                    <span
                      onClick={() => {
                        openDeleteModal(message);
                      }}
                      className="font-semibold text-red-600 hover:underline cursor-pointer "
                    >
                      delete
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    {message.audioHistoryId.originalText.length > 30
                      ? `${message.audioHistoryId.originalText.slice(0, 30)}...`
                      : message.audioHistoryId.originalText}
                  </Table.Cell>
                  <Table.Cell>{message.status}</Table.Cell>
                  <Table.Cell>
                    {new Date(message.scheduledDate).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>{message.scheduledTime}</Table.Cell>
                  <Table.Cell>{message.whatsappNumber}</Table.Cell>
                  <Table.Cell>
                    {message.callNumber ? message.callNumber : "Not Set"}
                  </Table.Cell>
                  <Table.Cell>
                    {new Date(message.createdAt).toLocaleString()}
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
        )}

        <Modal
          show={openModal === "delete"}
          onClose={() => setOpenModal(null)}
          popup
          size="md"
        >
          <Modal.Header />
          <Modal.Body>
            <div className="text-center">
              <HiOutlineExclamationCircle className="h-14 w-14 text-gray-500 dark:text-gray-200 mb-4 mx-auto" />
              <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                {" "}
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

export default ScheduledMessageDashboard;
