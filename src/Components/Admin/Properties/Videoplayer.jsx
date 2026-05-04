import { useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { BLUE, WHITE } from "./Constant";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://gtimeconnect.onrender.com";

/* Resolve relative paths uploaded by agents to absolute URLs */
const resolveVideoUrl = (url) => {
  if (!url) return null;
  const str = typeof url === "string" ? url : url?.url || url?.src || null;
  if (!str || str === "null" || str === "undefined") return null;
  if (str.startsWith("http://") || str.startsWith("https://")) return str;
  return `${API_BASE}${str.startsWith("/") ? "" : "/"}${str}`;
};

const VideoPlayer = ({ videoUrl, fallbackImage, title }) => {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(false);

  const resolvedUrl = resolveVideoUrl(videoUrl);

  const toggle = () => {
    if (!videoRef.current) return;
    if (playing) { videoRef.current.pause(); setPlaying(false); }
    else { videoRef.current.play().catch(() => setError(true)); setPlaying(true); }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !muted;
    setMuted(m => !m);
  };

  const onTimeUpdate = () => {
    if (!videoRef.current) return;
    setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100 || 0);
  };

  const seek = (e) => {
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = pct * videoRef.current.duration;
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", background: "#000", overflow: "hidden" }}>
      {resolvedUrl && !error ? (
        <>
          <video
            ref={videoRef}
            src={resolvedUrl}
            muted={muted}
            loop
            playsInline
            preload="metadata"
            onTimeUpdate={onTimeUpdate}
            onEnded={() => setPlaying(false)}
            onError={() => setError(true)}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div style={{
            position: "absolute", inset: 0,
            background: playing ? "transparent" : "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 50%)",
            display: "flex", flexDirection: "column", justifyContent: "flex-end", transition: "background .3s",
          }}>
            {/* Seek bar — larger touch target on mobile */}
            <div
              onClick={seek}
              style={{
                height: "clamp(4px, 1vw, 6px)",
                background: "rgba(255,255,255,0.25)",
                cursor: "pointer",
                margin: "0 0 clamp(8px, 2vw, 12px)",
                /* Expanded hit area for touch */
                padding: "8px 0",
                marginTop: -8,
              }}
            >
              <div style={{ height: "clamp(4px, 1vw, 6px)", width: `${progress}%`, background: BLUE, transition: "width .1s", borderRadius: 3 }} />
            </div>

            {/* Controls */}
            <div style={{ display: "flex", alignItems: "center", gap: "clamp(8px, 2vw, 12px)", padding: "0 clamp(12px, 3vw, 20px) clamp(10px, 2vh, 16px)" }}>
              {/* Play/Pause */}
              <button
                onClick={toggle}
                style={{
                  width: "clamp(36px, 6vw, 42px)",
                  height: "clamp(36px, 6vw, 42px)",
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.15)",
                  backdropFilter: "blur(6px)",
                  border: "none",
                  cursor: "pointer",
                  display: "grid",
                  placeItems: "center",
                  color: WHITE,
                  flexShrink: 0,
                  /* Larger touch target */
                  touchAction: "manipulation",
                }}
              >
                {playing
                  ? <Pause size="clamp(14px, 2.5vw, 18px)" />
                  : <Play  size="clamp(14px, 2.5vw, 18px)" />
                }
              </button>

              {/* Mute */}
              <button
                onClick={toggleMute}
                style={{
                  width: "clamp(32px, 5vw, 36px)",
                  height: "clamp(32px, 5vw, 36px)",
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.1)",
                  border: "none",
                  cursor: "pointer",
                  display: "grid",
                  placeItems: "center",
                  color: WHITE,
                  flexShrink: 0,
                  touchAction: "manipulation",
                }}
              >
                {muted
                  ? <VolumeX size="clamp(12px, 2vw, 15px)" />
                  : <Volume2 size="clamp(12px, 2vw, 15px)" />
                }
              </button>

              <div style={{ flex: 1 }} />
              <span style={{ color: "rgba(255,255,255,0.8)", fontSize: "clamp(10px, 1.5vw, 12px)", fontWeight: 500, whiteSpace: "nowrap" }}>🎬 Property Tour</span>
            </div>
          </div>

          {/* Centre play button (only when paused) */}
          {!playing && (
            <button
              onClick={toggle}
              style={{
                position: "absolute",
                top: "50%", left: "50%",
                transform: "translate(-50%,-50%)",
                width: "clamp(56px, 10vw, 72px)",
                height: "clamp(56px, 10vw, 72px)",
                borderRadius: "50%",
                background: "rgba(26,86,219,0.85)",
                backdropFilter: "blur(6px)",
                border: "3px solid rgba(255,255,255,0.5)",
                cursor: "pointer",
                display: "grid",
                placeItems: "center",
                color: WHITE,
                boxShadow: "0 8px 32px rgba(26,86,219,0.5)",
                transition: "transform .2s",
                touchAction: "manipulation",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translate(-50%,-50%) scale(1.08)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translate(-50%,-50%) scale(1)"; }}
            >
              <Play size="clamp(22px, 4vw, 28px)" style={{ marginLeft: 3 }} />
            </button>
          )}
        </>
      ) : (
        /* Fallback image state */
        <>
          <img
            src={fallbackImage}
            alt={title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to top, rgba(7,20,34,0.7) 0%, rgba(7,20,34,0.2) 60%, transparent 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <div style={{ textAlign: "center" }}>
              <div style={{
                width: "clamp(56px, 10vw, 72px)",
                height: "clamp(56px, 10vw, 72px)",
                borderRadius: "50%",
                background: "rgba(26,86,219,0.8)",
                backdropFilter: "blur(6px)",
                border: "3px solid rgba(255,255,255,0.4)",
                display: "grid",
                placeItems: "center",
                margin: "0 auto 12px",
              }}>
                <Play size="clamp(22px, 4vw, 28px)" color={WHITE} style={{ marginLeft: 3 }} />
              </div>
              <p style={{ color: WHITE, fontSize: "clamp(11px, 1.5vw, 13px)", fontWeight: 600, opacity: .85 }}>Video Tour Coming Soon</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default VideoPlayer;