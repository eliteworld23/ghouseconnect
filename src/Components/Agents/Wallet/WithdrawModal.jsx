import { useState, useEffect, useRef } from "react";
import { CloseIcon, CheckIcon } from "./Icons";
import { Field } from "./Field";
import { BANKS, fmt } from "./data";

const API_BASE = import.meta.env?.VITE_API_BASE_URL || "https://gtimeconnect.onrender.com";

export default function WithdrawModal({ balance, onClose }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [resolving, setResolving] = useState(false);
  const [apiError, setApiError] = useState("");
  const [form, setForm] = useState({
    bank: "",
    bankCode: "",
    accountNumber: "",
    accountName: "",
    amount: "",
  });
  const [errors, setErrors] = useState({});

  // Track the latest resolve request so stale responses are ignored
  const resolveRef = useRef(0);

  const set = (k, v) => {
    setForm((p) => ({ ...p, [k]: v }));
    setErrors((p) => ({ ...p, [k]: "" }));
    setApiError("");
  };

  // Auto-resolve account name — debounced 600ms, stale-request safe
  useEffect(() => {
    if (form.accountNumber.length === 10 && form.bankCode) {
      const requestId = ++resolveRef.current;

      const timer = setTimeout(async () => {
        // If another resolve was triggered while we waited, abort
        if (requestId !== resolveRef.current) return;

        setResolving(true);
        try {
          const token = localStorage.getItem("token");
          const res = await fetch(
            `${API_BASE}/api/v1/withdrawal/resolve-account-name?accountNumber=${form.accountNumber}&bankCode=${form.bankCode}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          // If a newer request has started since this one, discard result
          if (requestId !== resolveRef.current) return;

          const json = await res.json();

          if (json.success && json.data?.account_name) {
            setForm((p) => ({ ...p, accountName: json.data.account_name }));
            setErrors((prev) => ({ ...prev, accountNumber: "" }));
          } else {
            setForm((p) => ({ ...p, accountName: "" }));
            setErrors((prev) => ({
              ...prev,
              accountNumber: json.message || "Unable to resolve account name",
            }));
          }
        } catch {
          if (requestId !== resolveRef.current) return;
          setForm((p) => ({ ...p, accountName: "" }));
          setErrors((prev) => ({
            ...prev,
            accountNumber: "Account name resolution failed. Check your connection.",
          }));
        } finally {
          if (requestId === resolveRef.current) setResolving(false);
        }
      }, 600);

      return () => clearTimeout(timer);
    } else {
      // Reset whenever number is incomplete or bank not selected
      setForm((p) => ({ ...p, accountName: "" }));
      setErrors((prev) => ({ ...prev, accountNumber: "" }));
      setResolving(false);
    }
  }, [form.accountNumber, form.bankCode]);

  const validate = () => {
    const e = {};
    if (!form.bank) e.bank = "Select a bank";
    if (!/^\d{10}$/.test(form.accountNumber))
      e.accountNumber = "Enter a valid 10-digit account number";
    else if (!form.accountName)
      e.accountNumber = "Account name not resolved. Wait for resolution or re-enter details.";
    if (!form.amount || Number(form.amount) < 1000)
      e.amount = "Minimum withdrawal is ₦1,000";
    else if (Number(form.amount) > balance)
      e.amount = "Amount exceeds available balance";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = () => {
    if (resolving) return; // don't proceed if still resolving
    if (validate()) setStep(2);
  };

  const handleConfirm = async () => {
    if (!form.accountName) {
      setErrors((prev) => ({
        ...prev,
        accountNumber: "Account name not resolved",
      }));
      return;
    }

    setLoading(true);
    setApiError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/v1/withdrawal/request`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Number(form.amount),
          bankName: form.bank,
          bankCode: form.bankCode,
          accountNumber: form.accountNumber,
          accountName: form.accountName,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        setApiError(json.message || "Withdrawal request failed. Please try again.");
        return;
      }

      setStep(3);
    } catch (err) {
      setApiError(err.message || "Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const inputCls = (err) =>
    `w-full h-11 rounded-xl text-sm outline-none transition px-3.5 bg-white border ${
      err
        ? "border-red-500 focus:ring-1 focus:ring-red-400"
        : "border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-400"
    } text-gray-900`;

  return (
    <div className="fixed inset-0 z-50 bg-[#0b1a2e]/55 backdrop-blur-sm flex items-center justify-center p-5">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden relative">

        {/* Header */}
        {step !== 3 && (
          <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100">
            <div>
              <div className="text-base font-bold text-[#0b1a2e]">
                {step === 1 ? "Withdraw Funds" : "Confirm Withdrawal"}
              </div>
              {step === 1 && (
                <div className="text-xs text-gray-400 mt-0.5">Available: {fmt(balance)}</div>
              )}
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-lg bg-gray-100 grid place-items-center text-gray-500 hover:bg-gray-200 transition-colors border-0 cursor-pointer"
            >
              <CloseIcon />
            </button>
          </div>
        )}

        <div className="px-7 py-6">
          {/* Step 1: Form */}
          {step === 1 && (
            <div className="flex flex-col gap-5">
              <Field label="Bank" error={errors.bank}>
                <div className="relative">
                  <select
                    value={form.bank}
                    onChange={(e) => {
                      const selected = BANKS.find((b) => b.name === e.target.value);
                      setForm((p) => ({
                        ...p,
                        bank: selected?.name || "",
                        bankCode: selected?.code || "",
                        accountName: "", // reset resolved name when bank changes
                      }));
                      setErrors((p) => ({ ...p, bank: "" }));
                    }}
                    className={inputCls(!!errors.bank) + " appearance-none cursor-pointer pr-8"}
                  >
                    <option value="">Select your bank</option>
                    {BANKS.map((b) => (
                      <option key={b.code} value={b.name}>{b.name}</option>
                    ))}
                  </select>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none">▾</span>
                </div>
              </Field>

              <Field label="Account Number" error={errors.accountNumber}>
                <input
                  type="text"
                  maxLength={10}
                  placeholder="10-digit account number"
                  value={form.accountNumber}
                  onChange={(e) => set("accountNumber", e.target.value.replace(/\D/g, ""))}
                  className={inputCls(!!errors.accountNumber)}
                />
                {resolving && (
                  <div className="mt-1.5 flex items-center gap-1.5 text-xs text-gray-500 tracking-wide">
                    <span className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin inline-block" />
                    Resolving account name…
                  </div>
                )}
                {form.accountName && !resolving && (
                  <div className="mt-1.5 text-xs font-semibold text-green-600 tracking-wide">
                    ✓ {form.accountName}
                  </div>
                )}
              </Field>

              <Field label="Amount (₦)" error={errors.amount}>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-semibold">₦</span>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={form.amount}
                    onChange={(e) => set("amount", e.target.value)}
                    className={inputCls(!!errors.amount) + " pl-8"}
                  />
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {[10000, 50000, 100000, 200000]
                    .filter((v) => v <= balance)
                    .map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => set("amount", String(v))}
                        className={`px-3 py-1 rounded-full border text-xs font-semibold transition-all cursor-pointer ${
                          Number(form.amount) === v
                            ? "bg-blue-600 border-blue-600 text-white"
                            : "bg-transparent border-blue-600 text-blue-600 hover:bg-blue-50"
                        }`}
                      >
                        {fmt(v)}
                      </button>
                    ))}
                </div>
              </Field>

              <button
                onClick={handleSubmit}
                disabled={resolving}
                className="w-full h-11 rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 text-white text-sm font-bold border-0 cursor-pointer shadow-md shadow-blue-300/40 hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {resolving ? "Resolving account…" : "Continue"}
              </button>
            </div>
          )}

          {/* Step 2: Confirm */}
          {step === 2 && (
            <div className="flex flex-col">
              <div className="bg-blue-50 rounded-xl p-5 mb-5 border border-blue-100">
                {[
                  ["Bank", form.bank],
                  ["Account Number", form.accountNumber],
                  ["Account Name", form.accountName || "—"],
                  ["Amount", fmt(form.amount)],
                ].map(([label, val]) => (
                  <div
                    key={label}
                    className="flex justify-between items-center py-2.5 border-b border-blue-100 last:border-0"
                  >
                    <span className="text-sm text-gray-500">{label}</span>
                    <span className="text-sm font-semibold text-[#0b1a2e]">{val}</span>
                  </div>
                ))}
              </div>

              <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                Please review the details above carefully. This withdrawal cannot be reversed once processed.
              </p>

              {apiError && (
                <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium">
                  {apiError}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => { setStep(1); setApiError(""); }}
                  className="flex-1 h-11 rounded-xl bg-gray-100 text-gray-700 text-sm font-semibold border-0 cursor-pointer hover:bg-gray-200 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={loading}
                  className="flex-[2] h-11 rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 text-white text-sm font-bold border-0 cursor-pointer shadow-md shadow-blue-300/40 disabled:opacity-80 transition-opacity"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin inline-block" />
                      Processing…
                    </span>
                  ) : (
                    "Confirm Withdrawal"
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Success */}
          {step === 3 && (
            <div className="text-center py-2">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-600 to-green-400 grid place-items-center mx-auto mb-5 text-white shadow-lg shadow-green-600/30">
                <CheckIcon />
              </div>
              <div className="text-xl font-bold text-[#0b1a2e] mb-2">Withdrawal Requested!</div>
              <div className="text-sm text-gray-500 leading-relaxed mb-2">
                <strong className="text-[#0b1a2e]">{fmt(form.amount)}</strong> will be reviewed and
                credited to your {form.bank} account within{" "}
                <strong className="text-[#0b1a2e]">1–3 business days</strong>.
              </div>
              <div className="text-xs text-gray-400 mb-7">Account: {form.accountNumber}</div>
              <button
                onClick={onClose}
                className="w-full h-11 rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 text-white text-sm font-bold border-0 cursor-pointer shadow-md shadow-blue-300/40 hover:opacity-90 transition-opacity"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}