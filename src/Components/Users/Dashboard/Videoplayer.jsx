import { useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { BLUE, WHITE } from "./Constant";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://gtimeconnect.onrender.com";

/* Resolve relative paths uploaded by agents to absolute URLs */
const resolveVideoUrl = (url) => {
  if (!url) return null;
  // Handle cases where url may be an object e.g. { url: "..." } or { src: "..." }
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
            <div onClick={seek} style={{ height: 4, background: "rgba(255,255,255,0.25)", cursor: "pointer", margin: "0 0 12px" }}>
              <div style={{ height: "100%", width: `${progress}%`, background: BLUE, transition: "width .1s" }} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "0 20px 16px" }}>
              <button onClick={toggle} style={{ width: 42, height: 42, borderRadius: "50%", background: "rgba(255,255,255,0.15)", backdropFilter: "blur(6px)", border: "none", cursor: "pointer", display: "grid", placeItems: "center", color: WHITE }}>
                {playing ? <Pause size={18} /> : <Play size={18} />}
              </button>
              <button onClick={toggleMute} style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "none", cursor: "pointer", display: "grid", placeItems: "center", color: WHITE }}>
                {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
              </button>
              <div style={{ flex: 1 }} />
              <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 12, fontWeight: 500 }}>🎬 Property Tour</span>
            </div>
          </div>
          {!playing && (
            <button onClick={toggle} style={{
              position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
              width: 72, height: 72, borderRadius: "50%",
              background: "rgba(26,86,219,0.85)", backdropFilter: "blur(6px)",
              border: "3px solid rgba(255,255,255,0.5)", cursor: "pointer",
              display: "grid", placeItems: "center", color: WHITE,
              boxShadow: "0 8px 32px rgba(26,86,219,0.5)", transition: "transform .2s",
            }}>
              <Play size={28} style={{ marginLeft: 4 }} />
            </button>
          )}
        </>
      ) : (
        <>
          <img src={fallbackImage} alt={title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to top, rgba(7,20,34,0.7) 0%, rgba(7,20,34,0.2) 60%, transparent 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <div style={{ textAlign: "center" }}>
              <div style={{
                width: 72, height: 72, borderRadius: "50%",
                background: "rgba(26,86,219,0.8)", backdropFilter: "blur(6px)",
                border: "3px solid rgba(255,255,255,0.4)",
                display: "grid", placeItems: "center", margin: "0 auto 12px",
              }}>
                <Play size={28} color={WHITE} style={{ marginLeft: 4 }} />
              </div>
              <p style={{ color: WHITE, fontSize: 13, fontWeight: 600, opacity: .85 }}>Video Tour Coming Soon</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default VideoPlayer;