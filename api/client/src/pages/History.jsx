// client/src/pages/History.jsx
import React, { useEffect } from "react";
import Table from "../components/ui/Table";
import { useDispatch, useSelector } from "react-redux";
import { fetchHistory, generateDownloadUrl } from "../redux/user/historySlice";
import Button from "../components/ui/Button";
import { API_URL } from "../util/config";
import { toast } from "react-toastify";
import { FaWhatsapp, FaEnvelope } from "react-icons/fa";
import AudioPlayer from "../components/ui/AudioPlayer.jsx";

function History() {
  const dispatch = useDispatch();
  const { history, loading, error } = useSelector((state) => state.history);
  const { currentUser } = useSelector((state) => state.user);

  const columns = [
    { label: "Text", key: "originalText" },
    {
      label: "Voice",
      key: "voiceSettings",
      render: (voiceSettings) => voiceSettings?.name || "N/A",
    },
    {
      label: "Created At",
      key: "createdAt",
      render: (createdAt) => new Date(createdAt).toLocaleString(),
    },
    {
      label: "Audio",
      key: "audioFileUrl",
      render: (audioFileUrl, row) => (
        <div className="flex gap-2">
          {audioFileUrl && <AudioPlayer audioUrl={audioFileUrl} />}
          <Button onClick={() => handleShare(row.id)} size="small">
            Share
          </Button>
          <Button
            onClick={() => handleWhatsAppShare(audioFileUrl)}
            size="small"
          >
            <FaWhatsapp />
          </Button>
          <Button onClick={() => handleEmailShare(audioFileUrl)} size="small">
            <FaEnvelope />
          </Button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    dispatch(fetchHistory());
  }, [dispatch, currentUser]);

  const handleWhatsAppShare = async (audioFileUrl) => {
    const message = `Check out this audio file: ${window.location.origin}${audioFileUrl}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleEmailShare = async (audioFileUrl) => {
    const subject = "Check out this audio file";
    const body = `Check out this audio file: ${window.location.origin}${audioFileUrl}`;
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl, "_blank");
  };

  const handleShare = async (audioId) => {
    const email = prompt("Enter the email to share");
    if (!email) return toast.error("Please input an email");
    try {
      const res = await fetch(`${API_URL}/user/getusers`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) {
        return toast.error(data.message);
      }
      const foundUser = data.users.find((user) => user.email === email);
      if (!foundUser) {
        return toast.error("User not found");
      }
      const response = await fetch(`${API_URL}/audio/share/${audioId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: foundUser._id }),
      });
      const responseData = await response.json();
      if (!response.ok) {
        return toast.error(responseData.message);
      }
      toast.success(responseData.message);
    } catch (error) {
      toast.error("Error sharing audio");
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 w-full pt-16">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
        Audio Generation History
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        Note: Audio files are only retained for 72 hours.
      </p>
      {loading && <p className="dark:text-gray-300">Loading history...</p>}
      {error && <p className="dark:text-red-300">Error loading history</p>}
      <Table
        columns={columns}
        data={history}
        emptyMessage="No audios generated yet."
      />
    </div>
  );
}

export default History;
