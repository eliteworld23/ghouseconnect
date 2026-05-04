import { useState, useEffect } from "react";
import {
  ChevronLeft, ChevronRight, Clock, Mail, CreditCard, CheckCircle, User,
} from "lucide-react";
import {
  BLUE, NAVY, WHITE,
  DAYS, MONTHS, TIME_SLOTS,
  getDaysInMonth, getFirstDayOfMonth, formatDateLabel, formatPrice,
} from "./Constant";

const InspectionModal = ({ property, onClose }) => {
  const today = new Date();
  const [step, setStep] = useState(1);
  const [calYear, setCalYear]   = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [paymentError, setPaymentError] = useState("");



  const currentUser = (() => {
    try { return JSON.parse(localStorage.getItem("nestfind_user") || "{}"); } catch { return {}; }
  })();
  const userEmail = currentUser.email || "";
  const userName  = currentUser.name  || currentUser.displayName || "";

  const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}`;
  const daysInMonth   = getDaysInMonth(calYear, calMonth);
  const firstDayIndex = getFirstDayOfMonth(calYear, calMonth);

  const prevMonth = () => {
    if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); }
    else setCalMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); }
    else setCalMonth(m => m + 1);
  };
  const isPast = (d) => {
    const ds = `${calYear}-${String(calMonth+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
    return ds < todayStr;
  };
  const selectDay = (d) => {
    if (isPast(d)) return;
    const ds = `${calYear}-${String(calMonth+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
    setSelectedDate(ds);
    setSelectedTime(null);
  };

  // Converts "10:00 AM" / "2:00 PM" → "10:00" / "14:00"
  const to24Hour = (timeStr) => {
    if (!timeStr) return "";
    const [time, modifier] = timeStr.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    if (modifier === "AM" && hours === 12) hours = 0;
    if (modifier === "PM" && hours !== 12) hours += 12;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  };

  const handleMakePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPaymentError("");
    try {
      const token = localStorage.getItem("token");

      // The callback URL Paystack returns the user to after payment.
      // Since Paystack hardcodes the redirect to /bookings on your backend,
      // we send /bookings as the callback so Booking.jsx can handle the return.
      const callbackUrl = `${window.location.origin}/bookings`;

      const API_BASE = "https://gtimeconnect.onrender.com";

      const res = await fetch(
        `${API_BASE}/api/v1/booking/${property._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            bookedDate:   selectedDate,
            startTime:    to24Hour(selectedTime),
            notes:        note,
            callbackUrl,
          }),
        }
      );
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Booking failed. Please try again.");
      }
      const data = await res.json();
      // Support multiple Paystack response shapes:
      // { paymentUrl } | { data: { authorization_url } } | { authorization_url }
      const payUrl =
        data.paymentUrl ||
        data.authorization_url ||
        data.data?.authorization_url ||
        data.data?.paymentUrl ||
        null;

      const booking = {
        id: Date.now(), propertyId: property._id, propertyTitle: property.title,
        propertyAddress: property.address,
        propertyImage: (() => {
          // Resolve image from mapped property.image (already a string) or raw images array
          const raw = property.image || property.images?.[0];
          if (!raw) return "https://placehold.co/400x300/e5e7eb/6b7280?text=Property";
          const str = typeof raw === "string" ? raw : raw?.url || raw?.src || raw?.path || null;
          if (!str || str === "null" || str === "undefined") return "https://placehold.co/400x300/e5e7eb/6b7280?text=Property";
          // Prepend API base for relative paths
          if (str.startsWith("http://") || str.startsWith("https://")) return str;
          return `${API_BASE}${str.startsWith("/") ? "" : "/"}${str}`;
        })(),
        agentName: property.agent.name, price: property.price, priceType: property.type,
        date: selectedDate, time: selectedTime, note, userEmail, userName,
        bookedAt: new Date().toISOString(), status: "Pending Confirmation",
      };
      // Save FULL booking to localStorage — survives cross-page Paystack redirect
      // Booking.jsx reads "nestfind_pending_booking" on return and adds it to the bookings list
      localStorage.setItem("nestfind_pending_booking", JSON.stringify(booking));

      // Paystack redirect — save booking first, then redirect
      if (payUrl) {
        window.location.href = payUrl;
        return;
      }

      // No payment URL returned — go straight to success step
      setLoading(false);
      setStep(3);
    } catch (err) {
      setLoading(false);
      setPaymentError(err.message || "Something went wrong. Please try again.");
    }
  };

  const inp = {
    width: "100%", padding: "11px 14px", border: "1.5px solid #e5e7eb",
    borderRadius: 9, fontSize: 14, color: NAVY, outline: "none",
    fontFamily: "inherit", boxSizing: "border-box", transition: "border-color .2s", background: WHITE,
  };

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(7,20,34,0.65)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, overflowY: "auto" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        .cal-day:hover{background:#eff6ff!important;color:#1a56db!important;}
        .time-slot:hover{background:#eff6ff!important;border-color:#bfdbfe!important;color:#1a56db!important;}

        /* Modal width responsive */
        .insp-modal { width: 100% !important; max-width: 560px !important; }
        @media (max-width: 480px) { .insp-modal { max-width: 100% !important; border-radius: 18px !important; } }

        /* Modal header padding */
        .insp-header { padding: 18px 20px !important; }
        @media (min-width: 480px) { .insp-header { padding: 22px 28px !important; } }

        /* Modal body padding */
        .insp-body { padding: 18px 18px !important; }
        @media (min-width: 480px) { .insp-body { padding: 24px 28px !important; } }

        /* Mini property card — stack on tiny screens */
        .insp-prop-card { flex-direction: column !important; }
        @media (min-width: 400px) { .insp-prop-card { flex-direction: row !important; } }

        /* Time slots — 2 cols on mobile, 3 on wider */
        .insp-timegrid { grid-template-columns: repeat(2,1fr) !important; }
        @media (min-width: 400px) { .insp-timegrid { grid-template-columns: repeat(3,1fr) !important; } }

        /* Step 2 buttons */
        .insp-btn-row { flex-direction: column !important; gap: 10px !important; }
        @media (min-width: 400px) { .insp-btn-row { flex-direction: row !important; } }

        /* Success buttons */
        .insp-success-btns { flex-direction: column !important; }
        @media (min-width: 400px) { .insp-success-btns { flex-direction: row !important; } }

        /* Calendar day font size */
        .cal-day-num { font-size: 12px !important; }
        @media (min-width: 380px) { .cal-day-num { font-size: 13px !important; } }
      `}</style>

      <div className="insp-modal" style={{
        background: WHITE, borderRadius: 22, boxShadow: "0 32px 80px rgba(0,0,0,0.4)",
        animation: "fadeUp .35s cubic-bezier(.16,1,.3,1) both",
        margin: "auto", maxHeight: "92vh", display: "flex", flexDirection: "column", overflow: "hidden",
      }}>
        {/* Header */}
        <div className="insp-header" style={{ background: NAVY, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p style={{ color: "#93c5fd", fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 4 }}>
              {step === 1 ? "Step 1 of 2 — Pick a Date & Time" : step === 2 ? "Step 2 of 2 — Review & Pay" : "Booking Confirmed"}
            </p>
            <h3 style={{ color: WHITE, fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "1.05rem", margin: 0 }}>
              {step === 3 ? "🎉 Inspection Booked!" : "Book Property Inspection"}
            </h3>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 8, width: 34, height: 34, display: "grid", placeItems: "center", cursor: "pointer", color: WHITE, fontSize: 18, flexShrink: 0 }}>✕</button>
        </div>

        {/* Progress bar */}
        {step < 3 && (
          <div style={{ height: 4, background: "#f3f4f6" }}>
            <div style={{ height: "100%", width: step === 1 ? "50%" : "100%", background: BLUE, transition: "width .4s ease" }} />
          </div>
        )}

        <div className="insp-body" style={{ overflowY: "auto", flex: 1 }}>

          {/* ── STEP 1 ── */}
          {step === 1 && (
            <div>
              {/* Property mini card */}
              <div className="insp-prop-card" style={{ display: "flex", gap: 12, padding: "12px 14px", background: "#f8fafc", borderRadius: 12, marginBottom: 20, border: "1px solid #f3f4f6" }}>
                {/* Image — handles string, object {url}, or array */}
                {(() => {
                  const raw = property.images?.[0] || property.image;
                  const src = typeof raw === "string" ? raw : raw?.url || raw?.src || null;
                  return src
                    ? <img src={src} alt="" style={{ width: 64, height: 64, borderRadius: 9, objectFit: "cover", flexShrink: 0, border: "1px solid #e5e7eb" }} onError={e => { e.target.style.display = "none"; }} />
                    : <div style={{ width: 64, height: 64, borderRadius: 9, background: "#e5e7eb", flexShrink: 0, display: "grid", placeItems: "center", fontSize: 22 }}>🏠</div>;
                })()}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 700, fontSize: 14, color: NAVY, margin: "0 0 3px", fontFamily: "Poppins, sans-serif", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{property.title}</p>
                  <p style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>{property.address}</p>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <p style={{ fontSize: 10, fontWeight: 600, color: "#9ca3af", margin: "0 0 2px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Inspection Fee</p>
                  <p style={{ fontWeight: 800, fontSize: 14, color: BLUE, margin: 0, fontFamily: "Poppins, sans-serif" }}>
                    {property.inspectionFee
                      ? formatPrice(property.inspectionFee)
                      : property.agentFee || property.agent?.fee
                        ? formatPrice(property.agentFee || property.agent?.fee)
                        : "Contact Agent"}
                  </p>
                </div>
              </div>

              {/* Calendar */}
              <div style={{ background: "#f8fafc", borderRadius: 14, padding: "16px 14px", marginBottom: 18, border: "1px solid #f3f4f6" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                  <button onClick={prevMonth} style={{ width: 32, height: 32, borderRadius: 8, border: "1.5px solid #e5e7eb", background: WHITE, cursor: "pointer", display: "grid", placeItems: "center" }}>
                    <ChevronLeft size={16} color={NAVY} />
                  </button>
                  <span style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 14, color: NAVY }}>
                    {MONTHS[calMonth]} {calYear}
                  </span>
                  <button onClick={nextMonth} style={{ width: 32, height: 32, borderRadius: 8, border: "1.5px solid #e5e7eb", background: WHITE, cursor: "pointer", display: "grid", placeItems: "center" }}>
                    <ChevronRight size={16} color={NAVY} />
                  </button>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", marginBottom: 6 }}>
                  {DAYS.map(d => (
                    <div key={d} style={{ textAlign: "center", fontSize: 10, fontWeight: 700, color: "#9ca3af", padding: "3px 0" }}>{d}</div>
                  ))}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 3 }}>
                  {Array.from({ length: firstDayIndex }).map((_, i) => <div key={`empty-${i}`} />)}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const d = i + 1;
                    const ds = `${calYear}-${String(calMonth+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
                    const past = isPast(d);
                    const selected = ds === selectedDate;
                    const isToday = ds === todayStr;
                    return (
                      <button key={d} className={`cal-day-num${!past && !selected ? " cal-day" : ""}`}
                        onClick={() => selectDay(d)} disabled={past}
                        style={{
                          width: "100%", aspectRatio: "1", borderRadius: 8, border: "none",
                          fontFamily: "Poppins, sans-serif", fontWeight: selected ? 700 : 500,
                          cursor: past ? "not-allowed" : "pointer",
                          background: selected ? BLUE : isToday ? "#eff6ff" : WHITE,
                          color: selected ? WHITE : past ? "#d1d5db" : isToday ? BLUE : NAVY,
                          boxShadow: selected ? "0 4px 12px rgba(26,86,219,0.35)" : "none",
                          transition: "all .15s",
                          outline: isToday && !selected ? `2px solid ${BLUE}` : "none", outlineOffset: -2,
                        }}
                      >{d}</button>
                    );
                  })}
                </div>
              </div>

              {/* Time slots */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
                  <Clock size={15} color={BLUE} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: NAVY }}>
                    {selectedDate ? `Available Times — ${formatDateLabel(selectedDate)}` : "Select a date to see available times"}
                  </span>
                </div>
                {selectedDate && (
                  <div className="insp-timegrid" style={{ display: "grid", gap: 8 }}>
                    {TIME_SLOTS.map(t => {
                      const active = selectedTime === t;
                      return (
                        <button key={t} className={!active ? "time-slot" : ""}
                          onClick={() => setSelectedTime(t)}
                          style={{ padding: "10px 6px", borderRadius: 9, fontSize: 13, fontWeight: 600, border: `1.5px solid ${active ? BLUE : "#e5e7eb"}`, background: active ? BLUE : WHITE, color: active ? WHITE : NAVY, cursor: "pointer", boxShadow: active ? "0 4px 12px rgba(26,86,219,0.3)" : "none", transition: "all .15s", fontFamily: "inherit" }}
                        >{t}</button>
                      );
                    })}
                  </div>
                )}
              </div>

              <button onClick={() => setStep(2)} disabled={!selectedDate || !selectedTime}
                style={{
                  marginTop: 20, width: "100%", padding: "13px",
                  background: selectedDate && selectedTime ? `linear-gradient(135deg, ${BLUE}, #1444b8)` : "#e5e7eb",
                  color: selectedDate && selectedTime ? WHITE : "#9ca3af",
                  border: "none", borderRadius: 11, fontWeight: 700, fontSize: 15,
                  cursor: selectedDate && selectedTime ? "pointer" : "not-allowed",
                  fontFamily: "Poppins, sans-serif", transition: "all .2s",
                  boxShadow: selectedDate && selectedTime ? "0 6px 20px rgba(26,86,219,0.32)" : "none",
                }}>
                Continue →
              </button>
            </div>
          )}

          {/* ── STEP 2 ── */}
          {step === 2 && (
            <div>
              <div style={{ background: "#f0f4ff", borderRadius: 11, padding: "13px 16px", marginBottom: 18, border: "1px solid #bfdbfe", display: "flex", gap: 16, flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 11, color: "#6b7280", margin: "0 0 3px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>Booking Summary</p>
                  <p style={{ fontSize: 13.5, fontWeight: 700, color: NAVY, margin: "0 0 2px", fontFamily: "Poppins, sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{property.title}</p>
                  <p style={{ fontSize: 12.5, color: "#6b7280", margin: 0 }}>📅 {formatDateLabel(selectedDate)} &nbsp;·&nbsp; 🕐 {selectedTime}</p>
                </div>
                <button onClick={() => setStep(1)} style={{ alignSelf: "center", fontSize: 12, color: BLUE, fontWeight: 600, background: "none", border: "none", cursor: "pointer", textDecoration: "underline", whiteSpace: "nowrap" }}>Change</button>
              </div>

              <div style={{ background: "#f8fafc", border: "1px solid #e5e7eb", borderRadius: 10, padding: "11px 14px", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#eff6ff", display: "grid", placeItems: "center", flexShrink: 0 }}>
                  <User size={15} color={BLUE} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  {userName && <p style={{ fontSize: 13, fontWeight: 700, color: NAVY, margin: "0 0 1px" }}>{userName}</p>}
                  <p style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>
                    {userEmail ? <>Confirmation will be sent to <strong style={{ color: NAVY }}>{userEmail}</strong></> : "Confirmation will be sent to your registered email."}
                  </p>
                </div>
              </div>

              <form onSubmit={handleMakePayment} style={{ display: "flex", flexDirection: "column", gap: 13 }}>
                <div>
                  <label style={{ fontSize: 12.5, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>
                    Additional Notes <span style={{ fontWeight: 400, color: "#9ca3af" }}>(optional)</span>
                  </label>
                  <textarea
                    style={{ ...inp, resize: "none", height: 80 }}
                    placeholder="Any specific requests or questions for the agent…"
                    value={note} onChange={e => setNote(e.target.value)}
                    onFocus={e => e.target.style.borderColor = BLUE}
                    onBlur={e => e.target.style.borderColor = "#e5e7eb"}
                  />
                </div>

                {/* Agent Fee strip */}
                <div style={{ background: "#f0f4ff", border: "1px solid #bfdbfe", borderRadius: 10, padding: "11px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <span style={{ fontSize: 12.5, fontWeight: 600, color: "#374151" }}>Agent Fee</span>
                    <p style={{ fontSize: 11, color: "#9ca3af", margin: "2px 0 0", fontWeight: 500 }}>Payable to {property.agent.name}</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    {property.agentFee || property.agent?.fee ? (
                      <span style={{ fontSize: 15, fontWeight: 800, color: BLUE, fontFamily: "Poppins, sans-serif" }}>
                        {formatPrice(property.agentFee || property.agent?.fee)}
                      </span>
                    ) : (
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#6b7280", fontStyle: "italic" }}>Contact agent</span>
                    )}
                  </div>
                </div>

                {paymentError && (
                  <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 9, padding: "10px 14px", fontSize: 13, color: "#b91c1c", fontWeight: 500 }}>
                    ⚠️ {paymentError}
                  </div>
                )}

                <div className="insp-btn-row" style={{ display: "flex", marginTop: 4 }}>
                  <button type="button" onClick={() => setStep(1)} style={{ flex: 1, padding: "13px", background: WHITE, color: NAVY, border: "1.5px solid #e5e7eb", borderRadius: 10, fontWeight: 600, fontSize: 14, cursor: "pointer", fontFamily: "Poppins, sans-serif" }}>← Back</button>
                  <button type="submit" disabled={loading} style={{ flex: 2, padding: "13px", background: loading ? "#9ca3af" : `linear-gradient(135deg, ${BLUE}, #1444b8)`, color: WHITE, border: "none", borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: loading ? "not-allowed" : "pointer", fontFamily: "Poppins, sans-serif", boxShadow: loading ? "none" : "0 6px 20px rgba(26,86,219,0.3)", transition: "all .2s", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    {loading ? (
                      <><span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: WHITE, borderRadius: "50%", display: "inline-block", animation: "spin .7s linear infinite" }} /> Processing…</>
                    ) : (
                      <><CreditCard size={16} /> Make Payment</>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ── STEP 3 ── */}
          {step === 3 && (
            <div style={{ textAlign: "center", padding: "4px 0 8px" }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#f0fdf4", display: "grid", placeItems: "center", margin: "0 auto 10px" }}>
                <CheckCircle size={28} color="#16a34a" />
              </div>
              <h4 style={{ fontFamily: "Poppins, sans-serif", color: NAVY, fontSize: "1rem", marginBottom: 6 }}>Inspection Booked!</h4>
              <p style={{ color: "#6b7280", fontSize: 13, lineHeight: 1.6, marginBottom: 14 }}>
                Your inspection for <strong style={{ color: NAVY }}>{property.title}</strong> has been confirmed for<br />
                <strong style={{ color: BLUE }}>{formatDateLabel(selectedDate)}</strong> at <strong style={{ color: BLUE }}>{selectedTime}</strong>.
              </p>
              <div style={{ background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: 12, padding: "10px 14px", marginBottom: 12, display: "flex", alignItems: "flex-start", gap: 12, textAlign: "left" }}>
                <Mail size={20} color="#0284c7" style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <p style={{ fontWeight: 700, fontSize: 13.5, color: "#0c4a6e", margin: "0 0 3px" }}>Confirmation Email Sent</p>
                  <p style={{ fontSize: 13, color: "#0369a1", margin: 0 }}>
                    Sent to <strong>{userEmail || "your registered email"}</strong>. Check your inbox (and spam folder).
                  </p>
                </div>
              </div>
              <div style={{ background: "#f8fafc", borderRadius: 12, padding: "10px 14px", marginBottom: 14, textAlign: "left" }}>
                {[
                  ["Property", property.title],
                  ["Date", formatDateLabel(selectedDate)],
                  ["Time", selectedTime],
                  ["Agent", property.agent.name],
                  ["Booked By", userName || "You"],
                  ["Status", "⏳ Pending Agent Confirmation"],
                ].map(([label, value]) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 0", borderBottom: "1px solid #f3f4f6" }}>
                    <span style={{ fontSize: 12.5, color: "#6b7280", fontWeight: 600 }}>{label}</span>
                    <span style={{ fontSize: 13, color: NAVY, fontWeight: 600, textAlign: "right", maxWidth: "58%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{value}</span>
                  </div>
                ))}
              </div>
              <div className="insp-success-btns" style={{ display: "flex", gap: 10 }}>
                <button onClick={onClose} style={{ flex: 1, padding: "12px", background: WHITE, color: NAVY, border: "1.5px solid #e5e7eb", borderRadius: 10, fontWeight: 600, fontSize: 14, cursor: "pointer", fontFamily: "Poppins, sans-serif" }}>Close</button>
                <button onClick={() => { window.location.href = "/bookings"; }} style={{ flex: 1, padding: "12px", background: BLUE, color: WHITE, border: "none", borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "Poppins, sans-serif" }}>View My Bookings</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InspectionModal;