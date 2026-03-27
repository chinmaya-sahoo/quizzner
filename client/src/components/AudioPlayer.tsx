'use client';
import { useState, useEffect, useRef } from 'react';

interface AudioPlayerProps {
  text: string;
}

export default function AudioPlayer({ text }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (synth) {
      utteranceRef.current = new SpeechSynthesisUtterance(text);
      utteranceRef.current.onend = () => setIsPlaying(false);
    }
    return () => {
      if (synth) synth.cancel();
    };
  }, [text, synth]);

  const handlePlay = () => {
    if (!synth || !utteranceRef.current) return;
    
    if (isPaused) {
      synth.resume();
      setIsPaused(false);
    } else {
      synth.speak(utteranceRef.current);
      setIsPlaying(true);
      setIsPaused(false);
    }
  };

  const handlePause = () => {
    if (!synth) return;
    synth.pause();
    setIsPaused(true);
  };

  const handleStop = () => {
    if (!synth) return;
    synth.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  };

  return (
    <div className="bg-gray-100 p-4 rounded-lg flex items-center space-x-4">
      <h3 className="font-semibold text-gray-700">Audio Playback</h3>
      {!isPlaying || isPaused ? (
        <button onClick={handlePlay} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Play
        </button>
      ) : (
        <button onClick={handlePause} className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">
          Pause
        </button>
      )}
      <button 
        onClick={handleStop} 
        disabled={!isPlaying && !isPaused}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
      >
        Stop
      </button>
    </div>
  );
}
