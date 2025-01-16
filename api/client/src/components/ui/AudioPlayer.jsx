import React, { useState, useRef, useEffect } from "react";
import {
  PlayIcon,
  PauseIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
} from "@heroicons/react/24/solid";
import Slider from "./Slider";

function AudioPlayer({ audioUrl }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1); // Initial volume is 1 (full volume)
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener("loadedmetadata", () => {
        setDuration(audioRef.current.duration);
      });
      audioRef.current.addEventListener("timeupdate", () => {
        setCurrentTime(audioRef.current.currentTime);
      });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("loadedmetadata", () => {
          setDuration(audioRef.current.duration);
        });
        audioRef.current.removeEventListener("timeupdate", () => {
          setCurrentTime(audioRef.current.currentTime);
        });
      }
    };
  }, [audioRef]);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (newVolume) => {
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      setVolume(newVolume);
    }
  };

  const handleSeek = (newTime) => {
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  return (
    <div className="bg-white rounded p-4 shadow-md dark:bg-gray-800">
      <audio ref={audioRef} src={audioUrl} />

      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <button
            onClick={handlePlayPause}
            className="text-gray-700 dark:text-gray-300 focus:outline-none"
          >
            {isPlaying ? (
              <PauseIcon className="h-6 w-6" />
            ) : (
              <PlayIcon className="h-6 w-6" />
            )}
          </button>

          <button
            onClick={toggleMute}
            className="ml-2 text-gray-700 dark:text-gray-300 focus:outline-none"
          >
            {isMuted ? (
              <SpeakerXMarkIcon className="h-6 w-6" />
            ) : (
              <SpeakerWaveIcon className="h-6 w-6" />
            )}
          </button>
          <div className="ml-4 flex items-center space-x-2 w-40">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Volume:
            </label>
            <Slider
              value={volume}
              onChange={handleVolumeChange}
              min={0}
              max={1}
              step={0.1}
            />
          </div>
        </div>
        <div className="text-gray-700 dark:text-gray-300">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>
      <div className="flex items-center">
        <Slider
          value={currentTime}
          onChange={handleSeek}
          min={0}
          max={duration}
          step={1}
          className="w-full"
        />
      </div>
    </div>
  );
}

export default AudioPlayer;
