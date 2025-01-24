import React, { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchHistory, deleteAudioHistory } from "../redux/user/historySlice";
import Button from "../components/ui/Button";
import { toast } from "react-toastify";
import {
  FaPlay,
  FaPause,
  FaShareAlt,
  FaTrash,
  FaDownload,
  FaEye,
  FaWhatsapp,
  FaEnvelope,
} from "react-icons/fa";
import { useLocation } from "react-router-dom";
import Modal from "../components/ui/Modal";

function History() {
  const dispatch = useDispatch();
  const { history, loading, error } = useSelector((state) => state.history);
  const { currentUser } = useSelector((state) => state.user);
  const location = useLocation();
  const [playingAudioId, setPlayingAudioId] = useState(null);
  const [selectedText, setSelectedText] = useState(null);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const audioRefs = useRef({});
  const [shareDropdownOpen, setShareDropdownOpen] = useState({});

  const handleDownload = (audioFileUrl, audioId) => {
    const link = document.createElement("a");
    link.href = audioFileUrl;
    link.download = `audio_${audioId}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const handleShare = useCallback(async (audioFileUrl, text) => {
    const shareData = {
      title: "Check out this audio file",
      text: `Check out this audio file:\n${text}\n`,
      url: audioFileUrl,
    };
    console.log("Share URL:", shareData.url);
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast.success("Shared successfully");
      } catch (error) {
        const mailtoUrl = `mailto:?subject=${encodeURIComponent(
          shareData.title
        )}&body=${encodeURIComponent(shareData.text + shareData.url)}`;
        window.open(mailtoUrl, "_blank");
      }
    } else {
      const mailtoUrl = `mailto:?subject=${encodeURIComponent(
        shareData.title
      )}&body=${encodeURIComponent(shareData.text + shareData.url)}`;
      window.open(mailtoUrl, "_blank");
    }
  }, []);
  const toggleShareDropdown = (audioId) => {
    setShareDropdownOpen((prev) => ({
      ...prev,
      [audioId]: !prev[audioId],
    }));
  };
  const handleWhatsAppShareDemo = () => {
    toast.info("WhatsApp share demo");
  };
  const handleEmailShareDemo = () => {
    toast.info("Email share demo");
  };
  const handleDeleteAudio = async (audioId) => {
    if (!window.confirm("Are you sure you want to delete this audio?")) {
      return;
    }
    try {
      dispatch(deleteAudioHistory(audioId));
      toast.success("Deleted successfully");
    } catch (error) {
      toast.error("Failed to delete audio");
    }
  };
  const handleDeleteSelected = async () => {
    if (selectedRows.size === 0) {
      return toast.error("Please select audios to delete");
    }
    if (
      !window.confirm("Are you sure you want to delete the selected audios?")
    ) {
      return;
    }
    try {
      await Promise.all(
        Array.from(selectedRows).map(async (audioId) => {
          return dispatch(deleteAudioHistory(audioId));
        })
      );
      toast.success("Deleted audios successfully");
      setSelectedRows(new Set());
    } catch (error) {
      toast.error("Failed to delete selected audios");
    }
  };
  const handleCheckboxChange = (audioId) => {
    setSelectedRows((prevSelectedRows) => {
      const newSelectedRows = new Set(prevSelectedRows);
      if (newSelectedRows.has(audioId)) {
        newSelectedRows.delete(audioId);
      } else {
        newSelectedRows.add(audioId);
      }
      return newSelectedRows;
    });
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
  const handleViewText = (text) => {
    setSelectedText(text);
  };
  const closeModal = () => {
    setSelectedText(null);
  };

  useEffect(() => {
    dispatch(fetchHistory());
  }, [dispatch, location, currentUser]);

  return (
    <div className="p-4 md:p-6 lg:p-8 w-full pt-16">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
        Audio Generation History
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        Note: Audio files are only retained for 72 hours.
      </p>
      {selectedRows.size > 0 && (
        <p>
          {selectedRows.size} of {history?.length} row(s) selected.
        </p>
      )}
      {history?.length > 0 && (
        <div className="flex justify-end items-center mb-2">
          {selectedRows.size > 0 && (
            <Button
              size="small"
              variant="danger"
              onClick={handleDeleteSelected}
            >
              <FaTrash /> Delete Selected
            </Button>
          )}
        </div>
      )}
      {loading && <p className="dark:text-gray-300">Loading history...</p>}
      {error && <p className="dark:text-red-300">Error loading history</p>}
      {history?.length === 0 && !loading && <p>No audios generated yet.</p>}
      {history && history.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-200 dark:border-gray-700">
            <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
              <tr>
                <th className="py-2 px-4 border border-gray-200 dark:border-gray-700 text-left w-10"></th>
                <th className="py-2 px-4 border border-gray-200 dark:border-gray-700 text-left w-60 md:w-auto break-words">
                  Text
                </th>
                <th className="py-2 px-4 border border-gray-200 dark:border-gray-700 text-left w-32 md:w-auto">
                  Voice
                </th>
                <th className="py-2 px-4 border border-gray-200 dark:border-gray-700 text-left w-48 md:w-auto break-words">
                  Created At
                </th>
                <th className="py-2 px-4 border border-gray-200 dark:border-gray-700 text-left w-48 md:w-auto">
                  Audio
                </th>
                <th className="py-2 px-4 border border-gray-200 dark:border-gray-700 text-left w-48 md:w-auto">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300">
              {history.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="py-2 px-4 border border-gray-200 dark:border-gray-700">
                    <input
                      type="checkbox"
                      checked={selectedRows.has(row.id)}
                      onChange={() => handleCheckboxChange(row.id)}
                    />
                  </td>
                  <td className="py-2 px-4 border border-gray-200 dark:border-gray-700">
                    {row.originalText.split(" ").length <= 60 ? (
                      row.originalText
                    ) : (
                      <Button
                        size="small"
                        onClick={() => handleViewText(row.originalText)}
                      >
                        <FaEye /> View Text
                      </Button>
                    )}
                  </td>
                  <td className="py-2 px-4 border border-gray-200 dark:border-gray-700">
                    {row.voiceSettings?.name || "N/A"}
                  </td>
                  <td className="py-2 px-4 border border-gray-200 dark:border-gray-700">
                    {new Date(row.createdAt).toLocaleString()}
                  </td>
                  <td className="py-2 px-4 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                      <Button
                        size="small"
                        onClick={() =>
                          handlePlayAudio(row.id, row.audioFileUrl)
                        }
                      >
                        {playingAudioId === row.id ? <FaPause /> : <FaPlay />}
                      </Button>
                      <audio
                        src={row.audioFileUrl}
                        ref={(ref) => {
                          if (ref) {
                            audioRefs.current[row.id] = ref;
                          }
                        }}
                        onEnded={() => handleEnded(row.id)}
                        style={{ display: "none" }}
                      />
                      <Button
                        size="small"
                        onClick={() => handleDownload(row.audioFileUrl, row.id)}
                      >
                        <FaDownload />
                      </Button>
                    </div>
                  </td>
                  <td className="py-2 px-4 border border-gray-200 dark:border-gray-700">
                    <div className="relative">
                      <Button
                        onClick={() => toggleShareDropdown(row.id)}
                        size="small"
                      >
                        <FaShareAlt /> Share
                      </Button>
                      {shareDropdownOpen[row.id] && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-md z-10 dark:bg-gray-700 dark:border-gray-600">
                          <button
                            className="block w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-white flex items-center gap-2"
                            onClick={() => handleWhatsAppShareDemo()}
                          >
                            <FaWhatsapp /> Share via WhatsApp
                          </button>
                          <button
                            className="block w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-white flex items-center gap-2"
                            onClick={() => handleEmailShareDemo()}
                          >
                            <FaEnvelope /> Share via Email
                          </button>
                          <button
                            className="block w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-white"
                            onClick={() =>
                              handleShare(row.audioFileUrl, row.originalText)
                            }
                          >
                            Share via System
                          </button>
                        </div>
                      )}
                    </div>
                    <Button
                      size="small"
                      variant="danger"
                      onClick={() => handleDeleteAudio(row.id)}
                    >
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {selectedText && (
        <Modal isOpen={!!selectedText} onClose={closeModal} title="Text">
          <p>{selectedText}</p>
        </Modal>
      )}
    </div>
  );
}

export default History;
