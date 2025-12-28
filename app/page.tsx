"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const SCENE_DURATIONS = [10000, 15000, 15000, 15000, 5000];

const VOICEOVER_SEGMENTS = [
  "Ever feel like your protection tasks multiply faster than you can answer them? When new rules surface every day, even the most diligent teams can hesitate and wonder what to do next.",
  "With the right guide, every requirement lines up. Think of clear playbooks, shielded data, and checklists that gently confirm nothing is missed, all flowing in the same calm direction.",
  "Without that flow, warnings pile up. Paperwork floats away, alerts flash red, and the clock ticks louder while everyone waits for answers that should already be on the desk.",
  "Now picture the moment structure returns. A trusted shield glows, updates arrive automatically, and your team smiles again because protection is simple, timely, and confidently handled.",
  "This is your invitation to own the calm. Add your message here, welcome viewers to join, and let the story fade out with a friendly wave toward the next step."
];

type VoiceStatus = "idle" | "playing" | "error";

type SceneProps = {
  active: boolean;
};

type CharacterMood = "curious" | "worried" | "happy" | "neutral";

type CharacterPose = "neutral" | "pointing" | "thumbs";

function useSceneTimeline(durations: number[]) {
  const [sceneIndex, setSceneIndex] = useState(0);
  useEffect(() => {
    if (!durations.length) {
      return;
    }
    setSceneIndex(0);
    const timers: number[] = [];
    let elapsed = 0;
    for (let i = 0; i < durations.length - 1; i += 1) {
      elapsed += durations[i];
      timers.push(window.setTimeout(() => setSceneIndex(i + 1), elapsed));
    }
    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [durations]);
  return sceneIndex;
}

function useVoiceover(script: string[]) {
  const [status, setStatus] = useState<VoiceStatus>("idle");
  const utterancesRef = useRef<SpeechSynthesisUtterance[] | null>(null);

  const speak = useCallback(() => {
    if (typeof window === "undefined" || typeof window.speechSynthesis === "undefined") {
      setStatus("error");
      return;
    }

    const synth = window.speechSynthesis;
    synth.cancel();

    const voices = synth.getVoices();
    const preferredVoice = voices.find((voice) => /female|sara|wave|jessica|uk english/i.test(voice.name));

    utterancesRef.current = script.map((segment, index) => {
      const utterance = new SpeechSynthesisUtterance(segment);
      utterance.rate = 0.9;
      utterance.pitch = 1.05;
      utterance.volume = 0.85;
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      if (index === 0) {
        utterance.onstart = () => setStatus("playing");
      }
      if (index === script.length - 1) {
        utterance.onend = () => setStatus("idle");
        utterance.onerror = () => setStatus("error");
      }
      return utterance;
    });

    utterancesRef.current.forEach((utterance) => synth.speak(utterance));
  }, [script]);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.speechSynthesis === "undefined") {
      setStatus("error");
      return;
    }

    const preloadVoices = () => {
      window.speechSynthesis.getVoices();
    };

    window.speechSynthesis.addEventListener("voiceschanged", preloadVoices);
    preloadVoices();

    const autoplay = window.setTimeout(() => {
      speak();
    }, 900);

    return () => {
      window.clearTimeout(autoplay);
      window.speechSynthesis.removeEventListener("voiceschanged", preloadVoices);
      window.speechSynthesis.cancel();
    };
  }, [speak]);

  return useMemo(
    () => ({
      status,
      play: speak,
    }),
    [speak, status]
  );
}

function Character({ mood, pose }: { mood: CharacterMood; pose?: CharacterPose }) {
  const eyeClass = ["eye", mood === "worried" ? "eye-worried" : "", mood === "happy" ? "eye-happy" : ""].filter(Boolean).join(" ");
  const smileClass = [
    "smile",
    mood === "happy" ? "smile-happy" : "",
    mood === "worried" ? "smile-worried" : "",
  ]
    .filter(Boolean)
    .join(" ");
  const rightArmClass = [
    "character__arm",
    "arm-right",
    pose === "pointing" ? "arm-pointing" : "",
    pose === "thumbs" ? "arm-thumbs" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="character">
      <div className="character__shadow" />
      <div className="character__body" />
      <div className="character__arm arm-left" />
      <div className={rightArmClass} />
      <div className="character__head">
        <div className="character__hair" />
        <div className="character__face">
          <span className={eyeClass} />
          <span className={eyeClass} />
        </div>
        <div className={smileClass} />
      </div>
    </div>
  );
}

function SceneOne({ active }: SceneProps) {
  return (
    <div className={`scene scene-1 ${active ? "scene-active" : ""}`}>
      <div className="scene-layer">
        <div className="scene-content">
          <div className="cloud cloud-lg cloud-1" />
          <div className="cloud cloud-sm cloud-2" />
          <div className="cloud cloud-sm cloud-3" />
          <Character mood="curious" pose="neutral" />
          <div className="question-mark" />
          <div className="question-mark" />
          <div className="question-mark" />
          <div className="question-mark" />
        </div>
      </div>
    </div>
  );
}

function SceneTwo({ active }: SceneProps) {
  return (
    <div className={`scene scene-2 ${active ? "scene-active" : ""}`}>
      <div className="scene-layer">
        <div className="scene-content">
          <div className="scene-two-layout">
            <Character mood="neutral" pose="pointing" />
            <div className="icon-row">
              <div className="icon-card">
                <div className="icon-document" />
              </div>
              <div className="icon-card">
                <div className="icon-shield" />
              </div>
              <div className="icon-card">
                <div className="icon-checklist">
                  <span className="icon-check" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SceneThree({ active }: SceneProps) {
  return (
    <div className={`scene scene-3 ${active ? "scene-active" : ""}`}>
      <div className="scene-layer">
        <div className="scene-content">
          <div className="scene-three-layout">
            <Character mood="worried" pose="neutral" />
            <div className="problem-grid">
              <div className="paper-stack">
                <div className="paper-sheet" />
                <div className="paper-sheet" />
                <div className="paper-sheet" />
              </div>
              <div className="warning-sign" />
              <div className="clock">
                <div className="clock-face">
                  <div className="hand" />
                  <div className="hand hand-minute" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SceneFour({ active }: SceneProps) {
  return (
    <div className={`scene scene-4 ${active ? "scene-active" : ""}`}>
      <div className="scene-layer">
        <div className="scene-content">
          <div className="scene-four-layout">
            <div className="shield-glow">
              <div className="sparkle" />
              <div className="sparkle" />
              <div className="sparkle" />
              <div className="shield-core" />
            </div>
            <Character mood="happy" pose="thumbs" />
          </div>
        </div>
      </div>
    </div>
  );
}

function SceneFive({ active }: SceneProps) {
  return (
    <div className={`scene scene-5 ${active ? "scene-active" : ""}`}>
      <div className="scene-layer end-screen">
        <span className="placeholder-title" />
        <span className="placeholder-sub" />
      </div>
    </div>
  );
}

export default function Home() {
  const sceneIndex = useSceneTimeline(SCENE_DURATIONS);
  const { play, status } = useVoiceover(VOICEOVER_SEGMENTS);

  return (
    <main>
      <div className="voiceover-indicator">
        <span className="voiceover-led" style={{ background: status === "error" ? "#ffb84d" : undefined }} />
        <button
          type="button"
          className="voiceover-button"
          onClick={play}
          disabled={status === "error"}
          style={status === "error" ? { opacity: 0.6, cursor: "not-allowed" } : undefined}
        >
          {status === "playing" ? "Voice playing" : status === "error" ? "Voice unavailable" : "Replay voice"}
        </button>
      </div>
      <div className="scene-stack">
        <SceneOne active={sceneIndex === 0} />
        <SceneTwo active={sceneIndex === 1} />
        <SceneThree active={sceneIndex === 2} />
        <SceneFour active={sceneIndex === 3} />
        <SceneFive active={sceneIndex === 4} />
      </div>
    </main>
  );
}
