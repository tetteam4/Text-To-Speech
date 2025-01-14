// client/src/components/ui/AudioPlayer.jsx
import React, { useState, useRef, useEffect } from "react";
import {
  PlayIcon,
  PauseIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
} from "@heroicons/react/24/solid"; // Using heroicons

function AudioPlayer({ audioUrl }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1); // Initial volume is 1 (full)
  const audioRef = useRef(null);
  const sliderRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener("loadedmetadata", handleLoadedMetadata);
      audioRef.current.addEventListener("timeupdate", handleTimeUpdate);
      audioRef.current.addEventListener("ended", handleEnded);
      audioRef.current.addEventListener("volumechange", handleVolumeChange);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener(
          "loadedmetadata",
          handleLoadedMetadata
        );
        audioRef.current.removeEventListener("timeupdate", handleTimeUpdate);
        audioRef.current.removeEventListener("ended", handleEnded);
        audioRef.current.removeEventListener(
          "volumechange",
          handleVolumeChange
        );
      }
    };
  }, [audioUrl]);

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleVolumeChange = () => {
    if (audioRef.current) {
      setVolume(audioRef.current.volume);
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };

  const handleSliderChange = (event) => {
    if (!sliderRef.current) return;
    const sliderRect = sliderRef.current.getBoundingClientRect();

    const clickX = event.clientX;
    const x = clickX - sliderRect.left;
    const newTime = (x / sliderRect.width) * duration;
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };
  const sliderWidth = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleVolumeChangeSlider = (newValue) => {
    if (audioRef.current) {
      audioRef.current.volume = newValue;
      setVolume(newValue);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
    }
  };

  const isMuted = audioRef.current ? audioRef.current.muted : false;

  return (
    <div className="flex items-center gap-2">
      <audio ref={audioRef} src={audioUrl} />
      <button onClick={togglePlay} className="focus:outline-none">
        {isPlaying ? (
          <PauseIcon className="h-6 w-6 text-gray-700" />
        ) : (
          <PlayIcon className="h-6 w-6 text-gray-700" />
        )}
      </button>

      <div className="flex-1">
        <div
          ref={sliderRef}
          onClick={handleSliderChange}
          className="h-2 bg-gray-300 rounded-full cursor-pointer relative"
        >
          <div
            style={{ width: `${sliderWidth}%` }}
            className="h-full bg-primary rounded-full "
          />
        </div>
        <div className="text-xs text-gray-500 mt-1 flex justify-between">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <button onClick={toggleMute} className="focus:outline-none">
          {isMuted ? (
            <SpeakerXMarkIcon className="h-5 w-5 text-gray-700" />
          ) : (
            <SpeakerWaveIcon className="h-5 w-5 text-gray-700" />
          )}
        </button>
        <div className="w-20">
          <Slider
            min={0}
            max={1}
            value={volume}
            onChange={handleVolumeChangeSlider}
          />
        </div>
      </div>
    </div>
  );
}

export default AudioPlayer;
