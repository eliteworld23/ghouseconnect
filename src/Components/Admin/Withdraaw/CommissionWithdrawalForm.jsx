// CommissionWithdrawalForm.jsx
// POST /withdrawal/admin/commission — System admin withdrawal of commission funds

import { useState } from "react";
import { withdrawCommission } from "./UseWithdrawal";

const NIGERIAN_BANKS = [
  { code: "044", name: "Access Bank" },
  { code: "023", name: "Citibank Nigeria" },
  { code: "050", name: "EcoBank Nigeria" },
  { code: "070", name: "Fidelity Bank" },
  { code: "011", name: "First Bank of Nigeria" },
  { code: "214", name: "First City Monument Bank (FCMB)" },
  { code: "058", name: "Guaranty Trust Bank (GTB)" },
  { code: "030", name: "Heritage Bank" },
  { code: "301", name: "Jaiz Bank" },
  { code: "082", name: "Keystone Bank" },
  { code: "526", name: "Parallex Bank" },
  { code: "076", name: "Polaris Bank" },
  { code: "101", name: "ProvidusBank" },
  { code: "221", name: "Stanbic IBTC Bank" },
  { code: "068", name: "Standard Chartered Bank" },
  { code: "232", name: "Sterling Bank" },
  { code: "100", name: "Suntrust Bank" },
  { code: "032", name: "Union Bank of Nigeria" },
  { code: "033", name: "United Bank for Africa (UBA)" },
  { code: "215", name: "Unity Bank" },
  { code: "035", name: "Wema Bank" },
  { code: "057", name: "Zenith Bank" },
];

const FIELD = ({ label, required, children }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    {children}
  </div>
);

const INPUT_CLS = `w-full text-sm border border-gray-200 rounded-xl px-3.5 py-2.5 bg-gray-50
  text-gray-800 font-medium placeholder:text-gray-300 focus:outline-none focus:ring-2
  focus:ring-blue-100 focus:border-blue-400 transition-all`;

export default function CommissionWithdrawalForm() {
  const [form, setForm]       = useState({ amount: "", bankCode: "", accountNumber: "", narration: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError]     = useState(null);

  const set = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  const handleSubmit = async () => {
    setError(null); setSuccess(null);

    if (!form.amount || !form.bankCode || !form.accountNumber) {
      setError("Amount, bank, and account number are required."); return;
    }
    if (isNaN(Number(form.amount)) || Number(form.amount) <= 0) {
      setError("Please enter a valid amount."); return;
    }

    setLoading(true);
    try {
      await withdrawCommission({
        amount:        Number(form.amount),
        bankCode:      form.bankCode,
        accountNumber: form.accountNumber,
        narration:     form.narration || undefined,
      });
      setSuccess("Commission withdrawal submitted successfully!");
      setForm({ amount: "", bankCode: "", accountNumber: "", narration: "" });
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 max-w-lg">
      {/* Card header */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white text-lg shadow-sm">
          🏦
        </div>
        <div>
          <h2
            className="text-[15px] font-extrabold text-[#0b1a2e] leading-tight"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Commission Withdrawal
          </h2>
          <p className="text-xs text-gray-400 font-medium">
            Withdraw admin commission funds to a bank account
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {/* Amount */}
        <FIELD label="Amount (₦)" required>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">₦</span>
            <input
              type="number"
              min="1"
              placeholder="e.g. 50000"
              value={form.amount}
              onChange={(e) => set("amount", e.target.value)}
              className={`${INPUT_CLS} pl-7`}
            />
          </div>
        </FIELD>

        {/* Bank */}
        <FIELD label="Bank" required>
          <select
            value={form.bankCode}
            onChange={(e) => set("bankCode", e.target.value)}
            className={INPUT_CLS}
          >
            <option value="">Select a bank</option>
            {NIGERIAN_BANKS.map((b) => (
              <option key={b.code} value={b.code}>{b.name}</option>
            ))}
          </select>
        </FIELD>

        {/* Account Number */}
        <FIELD label="Account Number" required>
          <input
            type="text"
            maxLength={10}
            placeholder="10-digit NUBAN"
            value={form.accountNumber}
            onChange={(e) => set("accountNumber", e.target.value.replace(/\D/g, ""))}
            className={INPUT_CLS}
          />
        </FIELD>

        {/* Narration */}
        <FIELD label="Narration (optional)">
          <input
            type="text"
            placeholder="e.g. Q2 commission payout"
            value={form.narration}
            onChange={(e) => set("narration", e.target.value)}
            className={INPUT_CLS}
          />
        </FIELD>

        {/* Feedback */}
        {error && (
          <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
            <span className="mt-0.5">⚠️</span> {error}
          </div>
        )}
        {success && (
          <div className="flex items-start gap-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">
            <span className="mt-0.5">✅</span> {success}
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-3 rounded-xl bg-[#1a56db] hover:bg-blue-700 text-white
                     text-sm font-bold transition-all shadow-sm hover:shadow-md
                     disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Submitting…" : "Submit Withdrawal"}
        </button>
      </div>
    </div>
  );
}