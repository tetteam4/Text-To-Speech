import React, { useRef, useState, useEffect } from "react";
import {
  PlayIcon,
  PauseIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
} from "@heroicons/react/24/solid";
import Slider from "./Slider";
import { useDispatch, useSelector } from "react-redux";
import { setIsPlaying } from "../../redux/user/speechSlice"; // Import the action

function AudioPlayer({ audioUrl }) {
  const audioRef = useRef(null);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const dispatch = useDispatch();
  const { isPlaying } = useSelector((state) => state.speech); // Get isPlaying from Redux
  const [isAudioPaused, setIsAudioPaused] = useState(true);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
        setIsAudioPaused(false);
      } else {
        audioRef.current.pause();
        setIsAudioPaused(true);
      }
    }
  }, [isPlaying]);

  useEffect(() => {
        const audio = audioRef.current;
    if (audio && audioUrl) {
      const handleLoadedMetadata = () => {
        setDuration(audio.duration);
      };

      const handleTimeUpdate = () => {
        setCurrentTime(audio.currentTime);
        setProgress((audio.currentTime / audio.duration) * 100);
      };

      const handleEnded = () => {
        dispatch(setIsPlaying(false));
      };

      audio.addEventListener("loadedmetadata", handleLoadedMetadata);
      audio.addEventListener("timeupdate", handleTimeUpdate);
      audio.addEventListener("ended", handleEnded);

      return () => {
        audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
        audio.removeEventListener("timeupdate", handleTimeUpdate);
        audio.removeEventListener("ended", handleEnded);
      };
    }
  }, [audioUrl, audioRef, dispatch]);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isAudioPaused) {
        audioRef.current.play();
        dispatch(setIsPlaying(true));
      } else {
        audioRef.current.pause();
        dispatch(setIsPlaying(false));
      }
      setIsAudioPaused(!isAudioPaused);
    }
  };

  const handleVolumeChange = (newVolume) => {
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      setVolume(newVolume);
    }
  };

  const handleSeek = (newProgress) => {
    if (audioRef.current) {
      const newTime = (newProgress / 100) * duration;
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
      setProgress(newProgress);
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
    <div className="mt-4 overflow-hidden max-w-6xl mx-auto">
      <div className="max-w-full max-h-24 overflow-hidden ">
        <audio ref={audioRef} src={audioUrl} style={{ width: "100%" }} />
      </div>
      {audioUrl && (
        <div className="bg-white rounded p-4 shadow-md dark:bg-gray-800">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <button
                onClick={handlePlayPause}
                className="text-gray-700 dark:text-gray-300 focus:outline-none"
              >
                {isAudioPaused ? (
                  <PlayIcon className="h-6 w-6" />
                ) : (
                  <PauseIcon className="h-6 w-6" />
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
          <div className="mt-4">
            <Slider
              value={progress}
              onChange={handleSeek}
              min={0}
              max={100}
              step={1}
              className="w-full"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default AudioPlayer;