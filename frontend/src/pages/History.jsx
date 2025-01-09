// client/src/pages/History.jsx
import React, { useEffect, useState } from 'react';
 import Table from '../components/ui/Table';
 import useStore from '../store/store';
 import api from '../services/api';
 import Button from '../components/ui/Button';

function History() {
  const [history, setHistory] = useState([]);
  const { user } = useStore();

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
          {" "}
          Download
        </Button>
      ),
    },
  ];

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get("/projects");
        setHistory(response.data);
      } catch (error) {
        console.error("Error fetching projects", error);
      }
    };
    fetchProjects();
  }, [user]);

  const handleDownload = async (audioFileUrl) => {
    try {
      const filename = audioFileUrl.split("/").pop();
      const response = await api.get(`/storage/get-download-url/${filename}`);
      const link = document.createElement("a");
      link.href = response.data.url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.log("Error on download", error);
    }
  };
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Audio Generation History
      </h2>
      <p className="text-gray-600 mb-4">
        Note: Audio files are only retained for 72 hours.
      </p>
      <Table
        columns={columns}
        data={history}
        emptyMessage="No audios generated yet."
      />
    </div>
  );
}
export default History;