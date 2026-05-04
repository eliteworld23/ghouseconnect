// src/Components/Agents/Dashboard/EditListingPage.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import DescriptionSection  from "./DescriptionSection";
import TypeLocationSection from "./Typelocationsection";
import PriceSection        from "./PriceSection";
import DetailsSection      from "./Detailssection";
import FeaturesSection     from "./Featureection";
import MediaUploadSection  from "./Mediauploadsection";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://gtimeconnect.onrender.com";

const EMPTY_FORM = {
  propertyTitle: "",
  description: "",
  type: "", purpose: "", label: "",
  state: "", city: "", area: "", address: "", zipCode: "",
  currency: "NGN", price: "", agencyFee: "", duration: "monthly",
  // Details
  bedrooms: "", bathrooms: "", toilets: "",
  propertySize: "", propertySizePostfix: "Sqft", parking: "",
  noOfPlots: "", landSize: "", landSizePostfix: "Sqft",
  // Features
  features: [], otherFeatures: "",
  images: [], videos: [],
};

const normaliseImage = (img) => {
  if (!img) return null;
  if (typeof img === "string") return { url: img, name: "image", existing: true };
  if (img.url || img.secure_url) return { url: img.url || img.secure_url, name: img.name || "image", existing: true };
  return null;
};

const normaliseVideo = (vid) => {
  if (!vid) return null;
  if (typeof vid === "string") return { url: vid, name: "video", existing: true };
  if (vid.url || vid.secure_url) return { url: vid.url || vid.secure_url, name: vid.name || "video", existing: true };
  return null;
};

const apiToForm = (p) => {
  const images = Array.isArray(p.images)
    ? p.images.map(normaliseImage).filter(Boolean)
    : [];

  let videos = [];
  if (p.video) {
    const v = normaliseVideo(p.video);
    if (v) videos = [v];
  } else if (Array.isArray(p.videos) && p.videos.length > 0) {
    const v = normaliseVideo(p.videos[0]);
    if (v) videos = [v];
  }

  return {
    propertyTitle: p.title        || "",
    description:   p.description  || "",
    type:          p.propertyType || p.type    || "",
    purpose:       p.purpose      || "",
    label:         p.label        || "",
    state:         p.state        || "",
    city:          p.city         || "",
    area:          p.area         || "",
    address:       p.street       || p.address || "",
    zipCode:       p.zipCode      || "",
    currency:      p.currency     || "NGN",
    price:         p.price        ? String(p.price) : "",
    agencyFee:     p.inspectionFee ? String(p.inspectionFee) : "",
    duration:      p.duration     || "monthly",
    // Details — backend stores as squareFeet, we map it to propertySize for the form
    bedrooms:            p.bedrooms   ? String(p.bedrooms)  : "",
    bathrooms:           p.bathrooms  ? String(p.bathrooms) : "",
    toilets:             p.toilets    ? String(p.toilets)   : "",
    propertySize:        p.squareFeet ? String(p.squareFeet) : "",  // squareFeet → propertySize
    propertySizePostfix: "Sqft",
    parking:             p.parking    ? String(p.parking)   : "",
    noOfPlots:           p.noOfPlots  ? String(p.noOfPlots) : "",
    landSize:            p.landSize   ? String(p.landSize)  : "",
    landSizePostfix:     "Sqft",
    // Features
    features:      Array.isArray(p.features) ? p.features : [],
    otherFeatures: p.otherFeatures || "",
    images,
    videos,
  };
};

export default function EditListingPage() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm]                   = useState(EMPTY_FORM);
  const [loading, setLoading]             = useState(true);
  const [fetchError, setFetchError]       = useState("");
  const [isSubmitting, setIsSubmitting]   = useState(false);
  const [submitError, setSubmitError]     = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    const passedListing = location.state?.listing;
    if (passedListing) {
      setForm(apiToForm(passedListing));
      setLoading(false);
      return;
    }

    const fetchProperty = async () => {
      setLoading(true);
      setFetchError("");
      const token = localStorage.getItem("token");
      const endpoints = [
        `${API_BASE}/api/v1/properties/single/${id}`,
        `${API_BASE}/api/v1/properties/get/${id}`,
        `${API_BASE}/api/v1/properties/${id}`,
      ];

      for (const url of endpoints) {
        try {
          const { data } = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
          const property = data?.property || data?.data || data;
          if (property && (property._id || property.id || property.title)) {
            setForm(apiToForm(property));
            setLoading(false);
            return;
          }
        } catch (_) {}
      }

      setFetchError("Failed to load property. Please go back and try again.");
      setLoading(false);
    };

    if (id) fetchProperty();
  }, [id]);

  const handleChange = (name, value) =>
    setForm((prev) => ({ ...prev, [name]: value }));

  const handleSubmit = async () => {
    setSubmitError("");

    if (!form.propertyTitle.trim()) return setSubmitError("Property title is required.");
    if (!form.type)                 return setSubmitError("Please select a property type.");
    if (!form.state)                return setSubmitError("Please select a state.");
    if (!form.city)                 return setSubmitError("Please select a city.");
    if (!form.price)                return setSubmitError("Price is required.");

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");

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

      if (form.description)           fd.append("description",   form.description);
      if (form.area)                  fd.append("area",          form.area);
      if (form.purpose)               fd.append("purpose",       form.purpose);
      if (form.label)                 fd.append("label",         form.label);
      if (form.duration)              fd.append("duration",      form.duration);
      if (form.currency)              fd.append("currency",      form.currency);
      if (form.otherFeatures?.trim()) fd.append("otherFeatures", form.otherFeatures.trim());

      // Details — use backend field names
      if (form.bedrooms)     fd.append("bedrooms",   Number(form.bedrooms));
      if (form.bathrooms)    fd.append("bathrooms",  Number(form.bathrooms));
      if (form.toilets)      fd.append("toilets",    Number(form.toilets));
      if (form.propertySize) fd.append("squareFeet", form.propertySize);  // backend expects squareFeet
      if (form.parking)      fd.append("parking",    Number(form.parking));
      if (form.noOfPlots)    fd.append("noOfPlots",  Number(form.noOfPlots));
      if (form.landSize)     fd.append("landSize",   form.landSize);

      if (form.features.length > 0) {
        form.features.forEach((f) => fd.append("features", f));
      }

      // Images
      form.images.filter(img => img.existing).forEach(img => fd.append("existingImages", img.url));
      form.images.filter(img => img.file).forEach(img => fd.append("images", img.file));

      // Video
      const newVideo = form.videos.find(v => v.file);
      if (newVideo) {
        fd.append("video", newVideo.file);
      } else if (form.videos.length > 0 && form.videos[0].existing) {
        fd.append("existingVideo", form.videos[0].url);
      }

      // 30-second timeout so the spinner never hangs forever
      const controller = new AbortController();
      const timeoutId  = setTimeout(() => controller.abort(), 30000);

      await axios.put(
        `${API_BASE}/api/v1/properties/edit/${id}`,
        fd,
        {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        }
      );
      clearTimeout(timeoutId);

      setSubmitSuccess(true);
      setTimeout(() => navigate("/agent-dashboard"), 1500);
    } catch (err) {
      if (err?.name === "CanceledError" || err?.code === "ERR_CANCELED" || err?.name === "AbortError") {
        setSubmitError(
          "Request timed out after 30 seconds.\n" +
          "The server may be waking up (Render free tier sleeps when idle). " +
          "Please wait a moment and try again."
        );
        setIsSubmitting(false);
        return;
      }
      console.error("Update error:", err.response?.data ?? err.message);
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error   ||
        (typeof err.response?.data === "object"
          ? JSON.stringify(err.response.data, null, 2)
          : null) ||
        err.message ||
        "Failed to update listing. Please try again.";
      setSubmitError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ width: "100%", minHeight: "100vh", background: "#f9fafb", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-500">Loading property...</p>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div style={{ width: "100%", minHeight: "100vh", background: "#f9fafb", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
        <div className="bg-white rounded-xl border border-red-200 p-6 max-w-md w-full text-center">
          <div className="text-4xl mb-3">⚠️</div>
          <h2 className="text-base font-bold text-gray-900 mb-2">Could not load property</h2>
          <p className="text-sm text-red-600 mb-4">{fetchError}</p>
          <button
            onClick={() => navigate("/agent-dashboard")}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
    <style>{`
      *, *::before, *::after { box-sizing: border-box; }
      body, html { overflow-x: hidden; }
      /* AgentLayout in App.jsx already applies margin-left:260px — no extra margin here */
      .el-layout-root { min-height: 100vh; background: #f9fafb; width: 100%; }
      .el-inner { max-width: 860px; margin: 0 auto; padding: 72px 14px 80px; width: 100%; }
      @media (min-width: 480px) { .el-inner { padding: 72px 20px 80px; } }
      @media (min-width: 640px) { .el-inner { padding: 72px 28px 80px; } }
      @media (min-width: 768px) { .el-inner { padding: 36px 28px 80px; } }
      @media (min-width: 1024px) { .el-inner { padding: 40px 44px 80px; max-width: 960px; } }
    `}</style>
    <div className="el-layout-root">
      <div className="el-inner">

        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
          <div>
            <button
              onClick={() => navigate("/agent-dashboard")}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium mb-1 flex items-center gap-1"
            >
              ← Back to Dashboard
            </button>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">Edit Listing</h1>
          </div>
        </div>

        {submitSuccess && (
          <div className="mb-5 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm font-medium">
            ✓ Listing updated successfully! Redirecting...
          </div>
        )}

        {submitError && (
          <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm whitespace-pre-wrap">
            ⚠ {submitError}
          </div>
        )}

        <DescriptionSection  data={form} onChange={handleChange} />
        <TypeLocationSection data={form} onChange={handleChange} />
        <PriceSection        data={form} onChange={handleChange} />
        <DetailsSection      data={form} onChange={handleChange} />
        <FeaturesSection     data={form} onChange={handleChange} />
        <MediaUploadSection  data={form} onChange={handleChange} />

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 24, flexWrap: "wrap", gap: 10 }}>
          <button
            type="button"
            onClick={() => navigate("/agent-dashboard")}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
          >
            ‹ Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || submitSuccess}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 rounded-lg text-sm font-semibold text-white hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving…
              </>
            ) : "Save Changes ›"}
          </button>
        </div>
      </div>
    </div>
    </>
  );
}