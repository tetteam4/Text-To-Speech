import { useEffect } from "react";
import Table from "../components/ui/Table";
import { useDispatch, useSelector } from "react-redux";
import { fetchHistory, generateDownloadUrl } from "../redux/user/historySlice";
import Button from "../components/ui/Button";

function History() {
  const dispatch = useDispatch();
  const { history, loading, error } = useSelector((state) => state.history);
  const { user } = useSelector((state) => state.user);

  const columns = [
    { label: "Text", key: "text" },
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
          <Button
              onClick={() => handleDownload(audioFileUrl, row.id)}
              size="small"
          >
            Download
          </Button>
      ),
    },
  ];

  useEffect(() => {
    dispatch(fetchHistory());
  }, [dispatch, user]);

  const handleDownload = async (audioFileUrl) => {
    try {
      const filename = audioFileUrl.split("/").pop();
      const url = await dispatch(generateDownloadUrl(filename)).unwrap();
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.log("Error on download", error);
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