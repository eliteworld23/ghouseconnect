// src/components/CreateListingPage.jsx
import { useState } from "react";
import axios from "axios";
import DescriptionSection from "./DescriptionSection";
import TypeLocationSection from "./Typelocationsection";
import PriceSection        from "./PriceSection";
import DetailsSection      from "./Detailssection";
import FeaturesSection     from "./Featureection";
import MediaUploadSection  from "./Mediauploadsection";
import FormFooter          from "./Formfotter";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://gtimeconnect.onrender.com";

const INITIAL_FORM = {
  propertyTitle: "",
  description: "",
  type: "", purpose: "", label: "",
  state: "", city: "", area: "", address: "", zipCode: "",
  currency: "NGN", price: "", agencyFee: "", duration: "monthly",
  bedrooms: "", bathrooms: "", toilets: "",
  propertySize: "", propertySizePostfix: "Sqft", parking: "",
  noOfPlots: "", landSize: "", landSizePostfix: "Sqft",
  features: [], otherFeatures: "",
  images: [], videos: [],
};

export default function CreateListingPage() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [submitError, setSubmitError]   = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (name, value) =>
    setForm((prev) => ({ ...prev, [name]: value }));

  const handleSubmit = async () => {
    setSubmitError("");
    setUploadProgress(0);

    if (!form.propertyTitle.trim()) return setSubmitError("Property title is required.");
    if (!form.type)                 return setSubmitError("Please select a property type.");
    if (!form.state)                return setSubmitError("Please select a state.");
    if (!form.city)                 return setSubmitError("Please select a city.");
    if (!form.price)                return setSubmitError("Price is required.");

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");

      // ── Agent ID: try every known storage key and shape ────────────────
      let agentId = null;
      for (const key of ["user", "nestfind_user", "agent", "agentData"]) {
        try {
          const raw = localStorage.getItem(key);
          if (!raw) continue;
          const u = JSON.parse(raw);
          agentId =
            u?.agent?._id || u?.agent?.id ||
            u?.agentId    ||
            u?._id        || u?.id        || null;
          if (agentId) break;
        } catch (_) {}
      }

      if (!agentId) {
        setSubmitError(
          "Could not find your agent ID. Please log out and log in again.\n" +
          "Keys checked: user, nestfind_user, agent, agentData"
        );
        setIsSubmitting(false);
        return;
      }

      const fd = new FormData();
      fd.append("title",         form.propertyTitle.trim());
      fd.append("propertyType",  form.type);
      fd.append("street",        form.address || "N/A");
      fd.append("city",          form.city);
      fd.append("state",         form.state);
      fd.append("country",       "Nigeria");
      fd.append("zipCode",       form.zipCode || "100001");
      fd.append("price",         Number(form.price));
      fd.append("inspectionFee", Number(form.agencyFee) || 0);
      fd.append("agent",         agentId);

      if (form.description)           fd.append("description",   form.description);
      if (form.area)                  fd.append("area",          form.area);
      if (form.purpose)               fd.append("purpose",       form.purpose);
      if (form.label)                 fd.append("label",         form.label);
      if (form.duration)              fd.append("duration",      form.duration);
      if (form.currency)              fd.append("currency",      form.currency);
      if (form.otherFeatures?.trim()) fd.append("otherFeatures", form.otherFeatures.trim());

      if (form.bedrooms)     fd.append("bedrooms",   Number(form.bedrooms));
      if (form.bathrooms)    fd.append("bathrooms",  Number(form.bathrooms));
      if (form.toilets)      fd.append("toilets",    Number(form.toilets));
      if (form.propertySize) fd.append("squareFeet", form.propertySize);
      if (form.parking)      fd.append("parking",    Number(form.parking));
      if (form.noOfPlots)    fd.append("noOfPlots",  Number(form.noOfPlots));
      if (form.landSize)     fd.append("landSize",   form.landSize);

      if (form.features.length > 0) {
        form.features.forEach((f) => fd.append("features", f));
      }

      form.images.filter(img => img.file).forEach((img) => fd.append("images", img.file));
      form.videos.filter(vid => vid.file).forEach((vid) => fd.append("video",  vid.file));

      const { data } = await axios.post(
        `${API_BASE}/api/v1/properties/post`,
        fd,
        {
          headers: { Authorization: `Bearer ${token}` },
          // No hard timeout — images/video uploads can take time on Render
          timeout: 0,
          onUploadProgress: (e) => {
            if (e.total) {
              setUploadProgress(Math.round((e.loaded / e.total) * 100));
            }
          },
        }
      );

      console.log("Property created:", data);
      setUploadProgress(100);
      setSubmitSuccess(true);
      setForm(INITIAL_FORM);

    } catch (err) {
      console.error("Submit error:", err.response?.data ?? err.message);

      const responseData = err.response?.data;
      let msg = "";
      if (responseData) {
        msg = typeof responseData === "string"
          ? responseData
          : responseData.message || responseData.error || JSON.stringify(responseData, null, 2);
      } else {
        msg = err.message || "Network error — no response from server.";
      }

      setSubmitError(`Error (${err.response?.status ?? "network"}):\n${msg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasFiles = form.images.some(i => i.file) || form.videos.some(v => v.file);

  return (
    <>
    <style>{`
      *, *::before, *::after { box-sizing: border-box; }
      body, html { overflow-x: hidden; }
      /* AgentLayout in App.jsx already applies margin-left:260px — no extra margin here */
      .cl-layout-root { min-height: 100vh; background: #f9fafb; width: 100%; }
      .cl-inner { max-width: 860px; margin: 0 auto; padding: 72px 14px 80px; width: 100%; }
      @media (min-width: 480px) { .cl-inner { padding: 72px 20px 80px; } }
      @media (min-width: 640px) { .cl-inner { padding: 72px 28px 80px; } }
      @media (min-width: 768px) { .cl-inner { padding: 36px 28px 80px; } }
      @media (min-width: 1024px) { .cl-inner { padding: 40px 44px 80px; max-width: 960px; } }
      .cl-header { flex-direction: column; gap: 12px; align-items: flex-start !important; }
      @media (min-width: 480px) { .cl-header { flex-direction: row !important; align-items: center !important; } }
    `}</style>
    <div className="cl-layout-root">
      <div className="cl-inner">

        <div className="cl-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <h1 className="text-lg sm:text-xl font-bold text-gray-900">Create a Listing</h1>
          <button
            type="button"
            onClick={() => alert("Draft saved!")}
            className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg bg-white text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            Save as Draft
          </button>
        </div>

        {submitSuccess && (
          <div className="mb-5 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm font-medium">
            ✓ Listing created successfully!
          </div>
        )}

        {submitError && (
          <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm whitespace-pre-wrap font-mono">
            ⚠ {submitError}
          </div>
        )}

        {/* Upload progress bar — shown while submitting with files */}
        {isSubmitting && (
          <div className="mb-5 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-700">
                {uploadProgress < 100
                  ? hasFiles
                    ? `Uploading files… ${uploadProgress}%`
                    : "Submitting listing…"
                  : "Saving to database…"}
              </span>
              <span className="text-xs text-blue-500">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-blue-100 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress || (isSubmitting ? 5 : 0)}%` }}
              />
            </div>
            <p className="text-xs text-blue-400 mt-2">
              {hasFiles
                ? "Uploading images/video to server — this may take up to a minute. Please do not close this page."
                : "Please wait…"}
            </p>
          </div>
        )}

        <DescriptionSection  data={form} onChange={handleChange} />
        <TypeLocationSection data={form} onChange={handleChange} />
        <PriceSection        data={form} onChange={handleChange} />
        <DetailsSection      data={form} onChange={handleChange} />
        <FeaturesSection     data={form} onChange={handleChange} />
        <MediaUploadSection  data={form} onChange={handleChange} />

        <FormFooter
          onBack={() => console.log("back")}
          onNext={handleSubmit}
          isLoading={isSubmitting}
        />
      </div>
    </div></>
  );
}