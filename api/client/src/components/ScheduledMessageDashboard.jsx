import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Button, Spinner, Modal, Table } from "flowbite-react";
import axios from "axios";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { FaAngleLeft, FaAngleRight, FaEllipsisH } from "react-icons/fa";

function ScheduledMessageDashboard() {
  const [scheduledMessages, setScheduledMessages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [messagesPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingScheduled, setLoadingScheduled] = useState(false);
  const [openModal, setOpenModal] = useState(null);
  const [messageToDelete, setMessageToDelete] = useState(null);

  useEffect(() => {
    const fetchScheduledMessages = async () => {
      setLoadingScheduled(true);
      try {
        const res = await axios.get(
          `/api/scheduledMessage/get?page=${currentPage}&limit=${messagesPerPage}`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (res.status === 200) {
          setScheduledMessages(res.data.messages);
          setTotalPages(Math.ceil(res.data.totalMessages / messagesPerPage));
        } else {
          console.error("failed to fetch scheduled messages");
          toast.error("Failed to load scheduled messages");
          setScheduledMessages([]);
          setTotalPages(1);
        }
      } catch (error) {
        console.error("Error loading scheduled messages:", error);
        toast.error("Error loading scheduled messages");
        setScheduledMessages([]);
        setTotalPages(1);
      } finally {
        setLoadingScheduled(false);
      }
    };

    fetchScheduledMessages();
  }, [currentPage, messagesPerPage]);

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
        setCurrentPage(1);
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

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (totalPages <= 5 || (i >= currentPage - 2 && i <= currentPage + 2)) {
        pages.push(
          <Button
            key={i}
            color={currentPage === i ? "gray" : "light"}
            size="xs"
            onClick={() => setCurrentPage(i)}
          >
            {i}
          </Button>
        );
      } else if (
        i === 1 ||
        i === totalPages ||
        (i === currentPage - 3 && currentPage > 4) ||
        (i === currentPage + 3 && currentPage < totalPages - 3)
      ) {
        pages.push(
          <Button
            key={i}
            color="light"
            size="xs"
            onClick={() => setCurrentPage(i)}
          >
            {i}
          </Button>
        );
        if (i === 1 && currentPage > 4) {
          pages.push(
            <span key="ellipsis-start">
              <FaEllipsisH />
            </span>
          );
        } else if (i === totalPages && currentPage < totalPages - 3) {
          pages.push(
            <span key="ellipsis-end">
              <FaEllipsisH />
            </span>
          );
        }
      }
    }
    return pages;
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
        ) : scheduledMessages && scheduledMessages.length === 0 ? (
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
            {scheduledMessages &&
              scheduledMessages.map((message) => (
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
                      {message.audioHistoryId
                        ? message.audioHistoryId.originalText.length > 30
                          ? `${message.audioHistoryId.originalText.slice(
                              0,
                              30
                            )}...`
                          : message.audioHistoryId.originalText
                        : "No Audio Text"}
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
        <div className="flex justify-center items-center gap-2 py-4">
          <Button
            disabled={currentPage === 1}
            onClick={handlePreviousPage}
            size="sm"
          >
            <FaAngleLeft />
          </Button>
          {renderPageNumbers()}
          <Button
            disabled={
              currentPage === totalPages || scheduledMessages?.length === 0
            }
            onClick={handleNextPage}
            size="sm"
          >
            <FaAngleRight />
          </Button>
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

export default ScheduledMessageDashboard;
