import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Truck,
  Users,
  Sparkles,
  Settings,
  Bell,
  Search,
  Plus,
  X,
  TrendingUp,
  TrendingDown,
  Edit2,
  Trash2,
  Send,
  ChevronRight,
  ArrowUpRight,
  MoreVertical,
  Upload,
  Link2,
  ImageIcon,
  AlertTriangle,
  CheckCircle,
  Save,
} from "lucide-react";
import { ORDERS, REVENUE_DATA, AI_RESPONSES } from "../data";
import { Link } from "react-router-dom";
import { useShop } from "../context/ShopContext";
import { getImageUrl } from "../utils/helpers";

/* ── helpers ── */
const API = import.meta.env.VITE_API_URL || "";

const StatusBadge = ({ status }) => {
  const map = {
    delivered: { label: "Delivered", cls: "badge-delivered" },
    shipped: { label: "Shipped", cls: "badge-shipped" },
    processing: { label: "Processing", cls: "badge-processing" },
    pending: { label: "Pending", cls: "badge-pending" },
  };
  const { label, cls } = map[status] || map.pending;
  return <span className={`status-badge ${cls}`}>{label}</span>;
};

const KpiCard = ({ label, value, change, positive, iconEl, gold }) => (
  <div className={`kpi-card ${gold ? "gold" : ""}`}>
    <div className="kpi-card-header">
      <span className="kpi-card-label">{label}</span>
      <div className={`kpi-icon ${gold ? "gold" : positive ? "green" : "red"}`}>
        {iconEl}
      </div>
    </div>
    <div className="kpi-value">{value}</div>
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <span className={`kpi-change ${positive ? "up" : "down"}`}>
        {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
        {change}
      </span>
      <span className="kpi-change-label">vs last week</span>
    </div>
  </div>
);

const getNavItems = (pendingCount) => [
  { key: "overview", label: "Overview", icon: LayoutDashboard },
  { key: "analytics", label: "Analytics", icon: TrendingUp },
  { key: "inventory", label: "Inventory", icon: Package, badge: 24 },
  { key: "orders", label: "All Orders", icon: ShoppingBag, badge: pendingCount > 0 ? pendingCount : null },
  { key: "tracking", label: "Shipment Tracking", icon: Truck },
  { key: "tailoring", label: "Custom Tailoring", icon: Edit2 },
  { key: "customers", label: "Customers", icon: Users },
  { key: "ai", label: "AI Assistant", icon: Sparkles },
  { key: "settings", label: "Settings", icon: Settings },
];

const DONUT_DATA = [
  { name: "Women's", value: 42, color: "#C9A84C" },
  { name: "Men's", value: 28, color: "#9B7B2E" },
  { name: "Bridal", value: 18, color: "#1A2B4A" },
  { name: "Children's", value: 12, color: "#D4C5A9" },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "var(--charcoal)",
        color: "white",
        padding: "10px 16px",
        borderRadius: 8,
        fontSize: 13,
      }}
    >
      <div style={{ color: "rgba(255,255,255,.5)", marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ fontWeight: 700, color: "var(--gold-light)" }}>
        ${payload[0].value.toLocaleString()}
      </div>
      {payload[1] && (
        <div style={{ color: "rgba(255,255,255,.4)", fontSize: 12 }}>
          Last week: ${payload[1].value.toLocaleString()}
        </div>
      )}
    </div>
  );
};

/* ────────────────────────────────────────────────
   PRODUCT FORM MODAL (shared for Add & Edit)
──────────────────────────────────────────────── */
const CATEGORIES = [
  "Women's Kemis",
  "Men's Traditional",
  "Bridal Collection",
  "Children's Wear",
  "Accessories",
];
const GENDER_OPTIONS = [
  { value: "women", label: "Women" },
  { value: "men", label: "Men" },
  { value: "children", label: "Children" },
  { value: "unisex", label: "Unisex" },
];
const BADGE_OPTIONS = [
  { value: "", label: "None" },
  { value: "bestseller", label: "Bestseller" },
  { value: "new", label: "New" },
  { value: "sale", label: "Sale" },
];
const SIZE_OPTIONS = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "Custom",
  "3-4Y",
  "5-6Y",
  "7-8Y",
  "9-10Y",
  "One Size",
];

const emptyForm = () => ({
  name: "",
  sku: "",
  price: "",
  oldPrice: "",
  category: "Women's Kemis",
  gender: "women",
  badge: "",
  description: "",
  origin: "Addis Ababa, Ethiopia",
  material: "100% Handwoven Cotton",
  stock: "0",
  image: "",
  sizes: [],
  colors: [],
});

const ProductFormModal = ({ product, onClose, onSaved }) => {
  const isEdit = Boolean(product);
  const [form, setForm] = useState(() => {
    if (product) {
      return {
        name: product.name || "",
        sku: product.sku || "",
        price: String(product.price || ""),
        oldPrice: String(product.oldPrice || ""),
        category: product.category || "Women's Kemis",
        gender: product.gender || "women",
        badge: product.badge || "",
        description: product.description || "",
        origin: product.origin || "Addis Ababa, Ethiopia",
        material: product.material || "100% Handwoven Cotton",
        stock: String(product.stock || "0"),
        image: product.image || "",
        sizes: product.sizes || [],
        colors: product.colors || [],
      };
    }
    return emptyForm();
  });

  const [imgTab, setImgTab] = useState("url"); // 'url' | 'upload'
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const toggleSize = (s) => {
    setForm((f) => ({
      ...f,
      sizes: f.sizes.includes(s)
        ? f.sizes.filter((x) => x !== s)
        : [...f.sizes, s],
    }));
  };

  const uploadFile = async (file) => {
    if (!file) return;
    setUploading(true);
    setError("");
    const data = new FormData();
    data.append("image", file);
    try {
      const res = await fetch(`${API}/api/upload`, { method: "POST", body: data });
      if (!res.ok) throw new Error("Upload failed");
      const json = await res.json();
      set("image", json.url);
    } catch (e) {
      setError("Image upload failed: " + e.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim()) return setError("Product name is required");
    if (!form.sku.trim()) return setError("SKU is required");
    if (!form.price || isNaN(Number(form.price)))
      return setError("Valid price is required");
    setSaving(true);
    const body = {
      ...form,
      price: Number(form.price),
      oldPrice: form.oldPrice ? Number(form.oldPrice) : undefined,
      stock: Number(form.stock),
    };
    try {
      const url = isEdit ? `${API}/products/${product._id}` : `${API}/products`;
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Save failed");
      }
      const saved = await res.json();
      onSaved(saved, isEdit);
      onClose();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="pf-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="pf-modal"
        role="dialog"
        aria-modal="true"
        aria-label={isEdit ? "Edit Product" : "Add New Product"}
      >
        {/* Header */}
        <div className="pf-header">
          <div>
            <div className="pf-title">
              {isEdit ? "Edit Product" : "Add New Product"}
            </div>
            <div className="pf-sub">Fill in the product details below</div>
          </div>
          <button className="pf-close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="pf-body">
          {error && (
            <div className="pf-error">
              <AlertTriangle size={15} /> {error}
            </div>
          )}

          {/* ── Image Section ── */}
          <div className="pf-section-label">Product Image</div>
          <div className="pf-img-tabs">
            <button
              type="button"
              className={`pf-img-tab ${imgTab === "url" ? "active" : ""}`}
              onClick={() => setImgTab("url")}
            >
              <Link2 size={13} /> Paste URL
            </button>
            <button
              type="button"
              className={`pf-img-tab ${imgTab === "upload" ? "active" : ""}`}
              onClick={() => setImgTab("upload")}
            >
              <Upload size={13} /> Upload File
            </button>
          </div>

          {imgTab === "url" ? (
            <input
              type="text"
              className="pf-input"
              placeholder="https://example.com/image.jpg"
              value={form.image}
              onChange={(e) => set("image", e.target.value)}
            />
          ) : (
            <div
              className={`pf-dropzone ${dragOver ? "drag-over" : ""} ${uploading ? "uploading" : ""}`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => uploadFile(e.target.files[0])}
              />
              {uploading ? (
                <div className="pf-upload-state">
                  <div className="pf-spinner" />
                  <span>Uploading…</span>
                </div>
              ) : (
                <div className="pf-upload-state">
                  <ImageIcon size={28} color="var(--muted)" />
                  <span>
                    Drag & drop or <em>click to browse</em>
                  </span>
                  <span style={{ fontSize: 11, color: "var(--muted)" }}>
                    JPG, PNG, WebP up to 10 MB
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Preview */}
          {form.image && (
            <div className="pf-img-preview">
              <img src={getImageUrl(form.image)} alt="Preview" />
              <button
                type="button"
                className="pf-img-clear"
                onClick={() => set("image", "")}
              >
                <X size={12} />
              </button>
            </div>
          )}

          {/* ── Basic Info ── */}
          <div className="pf-section-label">Basic Information</div>
          <div className="pf-grid-2">
            <div className="pf-field">
              <label className="pf-label">Product Name *</label>
              <input
                className="pf-input"
                type="text"
                placeholder="Gold Tilet Classic Kemis"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
              />
            </div>
            <div className="pf-field">
              <label className="pf-label">SKU *</label>
              <input
                className="pf-input"
                type="text"
                placeholder="HH-W-001"
                value={form.sku}
                onChange={(e) => set("sku", e.target.value)}
              />
            </div>
          </div>
          <div className="pf-grid-2">
            <div className="pf-field">
              <label className="pf-label">Price (USD) *</label>
              <input
                className="pf-input"
                type="number"
                min="0"
                step="0.01"
                placeholder="189"
                value={form.price}
                onChange={(e) => set("price", e.target.value)}
              />
            </div>
            <div className="pf-field">
              <label className="pf-label">Original Price (optional)</label>
              <input
                className="pf-input"
                type="number"
                min="0"
                step="0.01"
                placeholder="230"
                value={form.oldPrice}
                onChange={(e) => set("oldPrice", e.target.value)}
              />
            </div>
          </div>
          <div className="pf-grid-2">
            <div className="pf-field">
              <label className="pf-label">Stock Quantity</label>
              <input
                className="pf-input"
                type="number"
                min="0"
                placeholder="0"
                value={form.stock}
                onChange={(e) => set("stock", e.target.value)}
              />
            </div>
            <div className="pf-field">
              <label className="pf-label">Badge</label>
              <select
                className="pf-select"
                value={form.badge}
                onChange={(e) => set("badge", e.target.value)}
              >
                {BADGE_OPTIONS.map((b) => (
                  <option key={b.value} value={b.value}>
                    {b.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* ── Category & Gender ── */}
          <div className="pf-section-label">Category & Gender</div>
          <div className="pf-grid-2">
            <div className="pf-field">
              <label className="pf-label">Category *</label>
              <select
                className="pf-select"
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="pf-field">
              <label className="pf-label">Gender</label>
              <div className="pf-gender-row">
                {GENDER_OPTIONS.map((g) => (
                  <button
                    key={g.value}
                    type="button"
                    className={`pf-gender-btn ${form.gender === g.value ? "active" : ""}`}
                    onClick={() => set("gender", g.value)}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Description & Details ── */}
          <div className="pf-section-label">Description & Details</div>
          <div className="pf-field">
            <label className="pf-label">Description</label>
            <textarea
              className="pf-textarea"
              rows={3}
              placeholder="Describe the product…"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </div>
          <div className="pf-grid-2">
            <div className="pf-field">
              <label className="pf-label">Origin</label>
              <input
                className="pf-input"
                type="text"
                placeholder="Addis Ababa, Ethiopia"
                value={form.origin}
                onChange={(e) => set("origin", e.target.value)}
              />
            </div>
            <div className="pf-field">
              <label className="pf-label">Material</label>
              <input
                className="pf-input"
                type="text"
                placeholder="100% Handwoven Cotton"
                value={form.material}
                onChange={(e) => set("material", e.target.value)}
              />
            </div>
          </div>

          {/* ── Sizes ── */}
          <div className="pf-section-label">Available Sizes</div>
          <div className="pf-chip-row">
            {SIZE_OPTIONS.map((s) => (
              <button
                key={s}
                type="button"
                className={`pf-chip ${form.sizes.includes(s) ? "active" : ""}`}
                onClick={() => toggleSize(s)}
              >
                {s}
              </button>
            ))}
          </div>

          {/* ── Colors ── */}
          <div className="pf-section-label">
            Color Variants{" "}
            <span style={{ fontWeight: 400, fontSize: 12 }}>
              (comma-separated hex or names)
            </span>
          </div>
          <input
            className="pf-input"
            type="text"
            placeholder="#FFFDF9, #E8D5B0, #1C1810"
            value={form.colors.join(", ")}
            onChange={(e) =>
              set(
                "colors",
                e.target.value
                  .split(",")
                  .map((c) => c.trim())
                  .filter(Boolean),
              )
            }
          />
          {form.colors.length > 0 && (
            <div className="pf-color-preview">
              {form.colors.map((c, i) => (
                <div
                  key={i}
                  className="pf-color-swatch"
                  style={{ background: c }}
                  title={c}
                />
              ))}
            </div>
          )}

          {/* ── Footer ── */}
          <div className="pf-footer">
            <button type="button" className="pf-btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="pf-btn-save" disabled={saving}>
              {saving ? (
                <>
                  <div className="pf-spinner-sm" /> Saving…
                </>
              ) : (
                <>
                  <Save size={14} /> {isEdit ? "Save Changes" : "Add Product"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ────────────────────────────────────────────────
   DELETE CONFIRM DIALOG
──────────────────────────────────────────────── */
const DeleteConfirm = ({ product, onClose, onDeleted }) => {
  const [deleting, setDeleting] = useState(false);
  const doDelete = async () => {
    setDeleting(true);
    try {
      await fetch(`${API}/products/${product._id}`, { method: "DELETE" });
      onDeleted(product._id);
      onClose();
    } catch {
      setDeleting(false);
    }
  };
  return (
    <div
      className="pf-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="pf-confirm" role="alertdialog" aria-modal="true">
        <div className="pf-confirm-icon">
          <Trash2 size={28} color="var(--red-dark)" />
        </div>
        <div className="pf-confirm-title">Delete Product?</div>
        <div className="pf-confirm-text">
          <strong>{product.name}</strong> will be permanently removed from your
          store and the website.
        </div>
        <div className="pf-confirm-actions">
          <button className="pf-btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            className="pf-btn-delete"
            onClick={doDelete}
            disabled={deleting}
          >
            {deleting ? "Deleting…" : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ────────────────────────────────────────────────
   MAIN DASHBOARD
──────────────────────────────────────────────── */
const Dashboard = () => {
  const { products: ctxProducts, refreshProducts, showToast } = useShop();

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/orders`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoadingOrders(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, [fetchOrders]);

  const pendingOrdersCount = orders.filter(o => o.status === "pending").length;
  const NAV = getNavItems(pendingOrdersCount);

  const [page, setPage] = useState("overview");
  const [searchOrder, setSearchOrder] = useState("");
  const [invSearch, setInvSearch] = useState("");
  const [invStatus, setInvStatus] = useState("all");
  const [invGender, setInvGender] = useState("all");
  const [notifOpen, setNotifOpen] = useState(false);
  const [period, setPeriod] = useState("week");

  // CRUD modal state
  const [addOpen, setAddOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [deleteProduct, setDeleteProduct] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState("");

  // Live inventory from backend (via ShopContext)
  const inventory = ctxProducts;

  // AI
  const [aiMsgs, setAiMsgs] = useState([
    {
      role: "bot",
      text: "Welcome, Tigist! I've analyzed your store data. Your Gold Tilet Kemis is your top performer this week — up 42% vs. last week. How can I help you today?",
    },
  ]);
  const [aiInput, setAiInput] = useState("");
  const [aiTyping, setAiTyping] = useState(false);
  const aiChatRef = useRef(null);
  const aiIdx = useRef(0);

  const sendAi = (text) => {
    const msg = text || aiInput.trim();
    if (!msg) return;
    setAiInput("");
    setAiMsgs((prev) => [...prev, { role: "user", text: msg }]);
    setAiTyping(true);
    setTimeout(
      () => {
        setAiTyping(false);
        setAiMsgs((prev) => [
          ...prev,
          {
            role: "bot",
            text: AI_RESPONSES[aiIdx.current % AI_RESPONSES.length],
          },
        ]);
        aiIdx.current++;
        if (aiChatRef.current)
          aiChatRef.current.scrollTop = aiChatRef.current.scrollHeight;
      },
      1200 + Math.random() * 500,
    );
  };

  const filteredOrders = orders.filter(
    (o) =>
      o.customerName?.toLowerCase().includes(searchOrder.toLowerCase()) ||
      o.orderId?.toLowerCase().includes(searchOrder.toLowerCase())
  );

  const filteredInv = inventory.filter((p) => {
    const matchName = (p.name || "")
      .toLowerCase()
      .includes(invSearch.toLowerCase());
    const matchStatus = invStatus === "all" || (p.status || "in") === invStatus;
    const matchGender = invGender === "all" || p.gender === invGender;
    return matchName && matchStatus && matchGender;
  });

  const showSuccess = (msg) => {
    setSaveSuccess(msg);
    setTimeout(() => setSaveSuccess(""), 3000);
  };

  const handleSaved = (saved, isEdit) => {
    refreshProducts();
    showSuccess(
      isEdit
        ? `"${saved.name}" updated successfully!`
        : `"${saved.name}" added to your store!`,
    );
  };

  const handleDeleted = (id) => {
    refreshProducts();
    showSuccess("Product deleted.");
  };

  const pageTitle = NAV.find((n) => n.key === page)?.label || "Overview";

  const lowCount = inventory.filter((p) => p.status === "low").length;
  const outCount = inventory.filter((p) => p.status === "out").length;

  return (
    <div className="dash-layout" style={{ fontFamily: "var(--font-sans)" }}>
      {/* ── MODALS ── */}
      {addOpen && (
        <ProductFormModal
          product={null}
          onClose={() => setAddOpen(false)}
          onSaved={handleSaved}
        />
      )}
      {editProduct && (
        <ProductFormModal
          product={editProduct}
          onClose={() => setEditProduct(null)}
          onSaved={handleSaved}
        />
      )}
      {deleteProduct && (
        <DeleteConfirm
          product={deleteProduct}
          onClose={() => setDeleteProduct(null)}
          onDeleted={handleDeleted}
        />
      )}

      {/* ── Global Success Toast ── */}
      {saveSuccess && (
        <div className="dash-success-toast">
          <CheckCircle size={15} /> {saveSuccess}
        </div>
      )}

      {/* ── SIDEBAR ── */}
      <aside className="dash-sidebar" aria-label="Sidebar navigation">
        <div className="sidebar-brand">
          <Link to="/" className="sidebar-brand-logo">
            Habesha <em>Heritage</em>
          </Link>
          <div className="sidebar-brand-badge">
            <span
              style={{
                width: 6,
                height: 6,
                background: "#4CAF50",
                borderRadius: "50%",
                display: "inline-block",
              }}
            />
            Seller Portal
          </div>
        </div>

        <nav aria-label="Dashboard navigation">
          <div className="nav-group-label">Main</div>
          {NAV.slice(0, 2).map(({ key, label, icon: Icon, badge }) => (
            <button
              key={key}
              className={`dash-nav-btn ${page === key ? "active" : ""}`}
              onClick={() => setPage(key)}
              aria-current={page === key ? "page" : undefined}
            >
              <Icon size={16} />
              {label}
              {badge && <span className="nav-pill">{badge}</span>}
            </button>
          ))}

          <div className="nav-group-label">Products</div>
          {NAV.slice(2, 4).map(({ key, label, icon: Icon, badge }) => (
            <button
              key={key}
              className={`dash-nav-btn ${page === key ? "active" : ""}`}
              onClick={() => setPage(key)}
            >
              <Icon size={16} />
              {label}
              {badge && <span className="nav-pill">{badge}</span>}
            </button>
          ))}

          <div className="nav-group-label">Fulfillment</div>
          {NAV.slice(4, 6).map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              className={`dash-nav-btn ${page === key ? "active" : ""}`}
              onClick={() => setPage(key)}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}

          <div className="nav-group-label">Growth</div>
          {NAV.slice(6).map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              className={`dash-nav-btn ${page === key ? "active" : ""}`}
              onClick={() => setPage(key)}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">TH</div>
            <div>
              <div className="sidebar-user-name">Tigist Haile</div>
              <div className="sidebar-user-role">Verified Artisan Seller</div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div className="dash-main">
        {/* Topbar */}
        <div className="dash-topbar">
          <span className="topbar-title">{pageTitle}</span>
          <div className="topbar-right">
            <button className="topbar-btn" aria-label="Search">
              <Search size={17} />
            </button>
            <button
              className="topbar-btn"
              onClick={() => setNotifOpen((v) => !v)}
              aria-label="Notifications"
              aria-expanded={notifOpen}
              style={{ position: "relative" }}
            >
              <Bell size={17} />
              <span className="topbar-notif-dot" />
            </button>
            <Link to="/" style={{ display: "flex" }}>
              <button className="topbar-btn" aria-label="View store">
                <ArrowUpRight size={17} />
              </button>
            </Link>
            <button
              className="topbar-add-btn"
              onClick={() => {
                setPage("inventory");
                setAddOpen(true);
              }}
            >
              <Plus size={14} /> Add Product
            </button>
          </div>
        </div>

        {/* Notifications panel */}
        <div
          className={`notif-panel ${notifOpen ? "open" : ""}`}
          aria-label="Notifications"
        >
          <div className="notif-panel-head">
            <span className="notif-panel-title">Notifications</span>
            <button
              className="notif-mark-all"
              onClick={() => setNotifOpen(false)}
            >
              Mark all read
            </button>
          </div>
          <div className="notif-list">
            {[
              {
                icon: "✓",
                bg: "rgba(45,90,39,.1)",
                color: "var(--green)",
                text: "Order #HH-8821 delivered to Meron Tadesse",
                time: "2 min ago",
                unread: true,
              },
              {
                icon: "⭐",
                bg: "rgba(201,168,76,.1)",
                color: "var(--gold)",
                text: "New 5-star review from Sara Kifle on Bridal Kemis",
                time: "15 min ago",
                unread: true,
              },
              {
                icon: "⚠",
                bg: "rgba(139,26,26,.1)",
                color: "var(--red-dark)",
                text: "Low stock alert: Royal Ceremonial Suit (5 remaining)",
                time: "1 hr ago",
                unread: true,
              },
              {
                icon: "📦",
                bg: "rgba(26,43,74,.1)",
                color: "var(--navy)",
                text: "New custom tailoring order from Abebe M.",
                time: "3 hr ago",
                unread: false,
              },
              {
                icon: "💰",
                bg: "rgba(201,168,76,.1)",
                color: "var(--gold)",
                text: "Payout of $1,240 scheduled for Friday",
                time: "5 hr ago",
                unread: false,
              },
            ].map((n, i) => (
              <div
                key={i}
                className={`notif-item ${n.unread ? "unread" : ""}`}
                onClick={() => setNotifOpen(false)}
              >
                <div
                  className="notif-item-icon"
                  style={{ background: n.bg, color: n.color }}
                >
                  {n.icon}
                </div>
                <div>
                  <div className="notif-item-text">{n.text}</div>
                  <div className="notif-item-time">{n.time}</div>
                </div>
                {n.unread && <div className="notif-unread-dot" />}
              </div>
            ))}
          </div>
        </div>

        {/* ─ OVERVIEW ─ */}
        {page === "overview" && (
          <div className="dash-content">
            <div className="dash-page-head">
              <div className="dash-page-title">Good afternoon, Tigist ✨</div>
              <div className="dash-page-sub">
                Here's a snapshot of your store performance today
              </div>
            </div>
            <div className="kpi-grid">
              <KpiCard
                label="Total Revenue"
                value="$24,880"
                change="↑ 18.5%"
                positive
                gold
                iconEl={<TrendingUp size={16} />}
              />
              <KpiCard
                label="Orders"
                value="142"
                change="↑ 12.3%"
                positive
                iconEl={<ShoppingBag size={16} />}
              />
              <KpiCard
                label="Avg. Order Value"
                value="$175"
                change="↑ 5.1%"
                positive
                iconEl={<TrendingUp size={16} />}
              />
              <KpiCard
                label="Conversion"
                value="3.8%"
                change="↓ 0.4%"
                positive={false}
                iconEl={<Users size={16} />}
              />
            </div>

            <div className="chart-row">
              <div className="chart-card">
                <div className="chart-card-header">
                  <div>
                    <div className="chart-title">Revenue Overview</div>
                    <div className="chart-subtitle">
                      This week vs. last week
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                      alignItems: "flex-end",
                    }}
                  >
                    <div className="chart-period-tabs">
                      {["week", "month", "year"].map((p) => (
                        <button
                          key={p}
                          className={`period-btn ${period === p ? "active" : ""}`}
                          onClick={() => setPeriod(p)}
                        >
                          {p.charAt(0).toUpperCase() + p.slice(1)}
                        </button>
                      ))}
                    </div>
                    <div className="chart-legend">
                      <div className="legend-item">
                        <div
                          className="legend-dot"
                          style={{ background: "#C9A84C" }}
                        />
                        This week
                      </div>
                      <div className="legend-item">
                        <div
                          className="legend-dot"
                          style={{
                            background: "#E0D5C0",
                            border: "1px dashed var(--muted)",
                          }}
                        />
                        Last week
                      </div>
                    </div>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart
                    data={REVENUE_DATA}
                    margin={{ top: 4, right: 4, left: -10, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="thisWeekGrad"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#C9A84C"
                          stopOpacity={0.25}
                        />
                        <stop
                          offset="95%"
                          stopColor="#C9A84C"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#F0EAE0"
                    />
                    <XAxis
                      dataKey="day"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#A89B8A" }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: "#A89B8A" }}
                      tickFormatter={(v) => `$${v / 1000}k`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="thisWeek"
                      stroke="#C9A84C"
                      strokeWidth={2.5}
                      fill="url(#thisWeekGrad)"
                      dot={false}
                      activeDot={{
                        r: 5,
                        fill: "#C9A84C",
                        strokeWidth: 2,
                        stroke: "#fff",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="lastWeek"
                      stroke="#D4C5A9"
                      strokeWidth={1.5}
                      strokeDasharray="5 5"
                      fill="none"
                      dot={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-card">
                <div className="chart-card-header">
                  <div>
                    <div className="chart-title">Sales by Category</div>
                    <div className="chart-subtitle">This month</div>
                  </div>
                </div>
                <div className="donut-wrap">
                  <div className="donut-svg-wrap">
                    <PieChart width={160} height={160}>
                      <Pie
                        data={DONUT_DATA}
                        cx={75}
                        cy={75}
                        innerRadius={50}
                        outerRadius={72}
                        paddingAngle={3}
                        dataKey="value"
                        startAngle={90}
                        endAngle={-270}
                      >
                        {DONUT_DATA.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                    <div className="donut-center">
                      <div className="donut-center-val">$24.8K</div>
                      <div className="donut-center-label">Total</div>
                    </div>
                  </div>
                  <div className="donut-legend">
                    {DONUT_DATA.map((d) => (
                      <div key={d.name} className="donut-legend-item">
                        <div className="donut-legend-left">
                          <div
                            className="donut-legend-dot"
                            style={{ background: d.color }}
                          />
                          {d.name}
                        </div>
                        <span className="donut-legend-pct">{d.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="data-table-card">
              <div className="data-table-head">
                <span className="data-table-title">Recent Orders</span>
                <div className="data-table-actions">
                  <button
                    className="topbar-add-btn"
                    style={{
                      background: "transparent",
                      color: "var(--charcoal)",
                      border: "1.5px solid var(--cream-3)",
                      marginLeft: 0,
                    }}
                    onClick={() => setPage("orders")}
                  >
                    View All
                  </button>
                  <button className="topbar-add-btn">Export CSV</button>
                </div>
              </div>
              <table aria-label="Recent Orders">
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Product</th>
                    <th>Customer</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 5).map((o) => (
                    <tr key={o.orderId || o._id}>
                      <td>
                        <span className="order-id">{o.orderId}</span>
                      </td>
                      <td>
                        <div className="product-cell">
                          {o.items && o.items[0] && (
                            <img
                              src={getImageUrl(o.items[0].image)}
                              alt=""
                              className="product-cell-thumb"
                              onError={(e) => { e.target.style.display = "none"; }}
                            />
                          )}
                          <div>
                            <div className="product-cell-name">{o.customerName}</div>
                            <div className="product-cell-sub">{o.items?.length || 1} item{o.items?.length !== 1 ? 's' : ''}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ fontSize: 13.5 }}>{o.customerEmail}</td>
                      <td>
                        <StatusBadge status={o.status} />
                      </td>
                      <td style={{ fontSize: 12.5, color: "var(--muted)" }}>
                        {new Date(o.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <span className="amount-cell">${o.amount?.toFixed(2) || o.amount}</span>
                      </td>
                      <td>
                        <button
                          className="row-action-btn"
                          aria-label="More options"
                        >
                          <MoreVertical size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ─ ORDERS ─ */}
        {page === "orders" && (
          <div className="dash-content">
            <div className="dash-page-head">
              <div className="dash-page-title">Order Management</div>
              <div className="dash-page-sub">
                142 total orders · 7 pending action
              </div>
            </div>
            <div className="data-table-card">
              <div className="data-table-head">
                <span className="data-table-title">All Orders</span>
                <div className="data-table-actions">
                  <div className="dt-filter-input">
                    <Search size={14} color="var(--muted)" />
                    <input
                      type="text"
                      placeholder="Search orders..."
                      value={searchOrder}
                      onChange={(e) => setSearchOrder(e.target.value)}
                      aria-label="Search orders"
                    />
                  </div>
                  <button className="topbar-add-btn">Export CSV</button>
                </div>
              </div>
              <table aria-label="All Orders">
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Product</th>
                    <th>Customer</th>
                    <th>Country</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((o) => (
                    <tr key={o.orderId || o._id}>
                      <td>
                        <span className="order-id">{o.orderId}</span>
                      </td>
                      <td>
                        <div className="product-cell">
                          {o.items && o.items[0] && (
                            <img
                              src={getImageUrl(o.items[0].image)}
                              alt=""
                              className="product-cell-thumb"
                              onError={(e) => { e.target.style.display = "none"; }}
                            />
                          )}
                          <div>
                            <div className="product-cell-name">{o.customerName}</div>
                            <div className="product-cell-sub">{o.items?.length || 1} item{o.items?.length !== 1 ? 's' : ''}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ fontSize: 13.5 }}>{o.customerEmail}</td>
                      <td style={{ fontSize: 13 }}>{o.phone}</td>
                      <td>
                        <select
                          className="pf-select"
                          style={{
                            padding: "2px 8px",
                            fontSize: 12,
                            height: "auto",
                            borderRadius: "var(--radius-sm)",
                          }}
                          value={o.status}
                          onChange={async (e) => {
                            const newStatus = e.target.value;
                            try {
                              const res = await fetch(`${API}/api/orders/${o._id}/status`, {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ status: newStatus })
                              });
                              if (res.ok) {
                                showToast("Order status updated");
                                setOrders(prev => prev.map(order => 
                                  order._id === o._id ? { ...order, status: newStatus } : order
                                ));
                              }
                            } catch (err) {
                              console.error(err);
                              showToast("Failed to update status");
                            }
                          }}
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                        </select>
                      </td>
                      <td style={{ fontSize: 12.5, color: "var(--muted)" }}>
                        {new Date(o.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <span className="amount-cell">${o.amount?.toFixed(2) || o.amount}</span>
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: 4 }}>
                          <button className="row-action-btn" aria-label="Edit">
                            <Edit2 size={13} />
                          </button>
                          <button className="row-action-btn" aria-label="More">
                            <MoreVertical size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredOrders.length === 0 && (
                    <tr>
                      <td
                        colSpan={8}
                        style={{
                          textAlign: "center",
                          padding: 48,
                          color: "var(--muted)",
                        }}
                      >
                        No orders match your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ─ INVENTORY ─ */}
        {page === "inventory" && (
          <div className="dash-content">
            <div
              className="dash-page-head"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
              }}
            >
              <div>
                <div className="dash-page-title">Inventory Management</div>
                <div className="dash-page-sub">
                  {inventory.length} products
                  {lowCount > 0 && (
                    <>
                      {" "}
                      ·{" "}
                      <span style={{ color: "var(--gold)" }}>
                        {lowCount} low stock
                      </span>
                    </>
                  )}
                  {outCount > 0 && (
                    <>
                      {" "}
                      ·{" "}
                      <span style={{ color: "var(--red-dark)" }}>
                        {outCount} out of stock
                      </span>
                    </>
                  )}
                </div>
              </div>
              <button
                className="topbar-add-btn"
                onClick={() => setAddOpen(true)}
              >
                <Plus size={14} /> Add Product
              </button>
            </div>

            {/* Filters */}
            <div className="inv-filters">
              <div className="inv-filter-input" style={{ flex: 2 }}>
                <Search size={15} color="var(--muted)" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={invSearch}
                  onChange={(e) => setInvSearch(e.target.value)}
                  aria-label="Search inventory"
                />
              </div>
              <select
                className="inv-filter-select"
                value={invGender}
                onChange={(e) => setInvGender(e.target.value)}
                aria-label="Filter by gender"
              >
                <option value="all">All Genders</option>
                <option value="women">Women</option>
                <option value="men">Men</option>
                <option value="children">Children</option>
                <option value="unisex">Unisex</option>
              </select>
              <select
                className="inv-filter-select"
                value={invStatus}
                onChange={(e) => setInvStatus(e.target.value)}
                aria-label="Filter by status"
              >
                <option value="all">All Stock</option>
                <option value="in">In Stock</option>
                <option value="low">Low Stock</option>
                <option value="out">Out of Stock</option>
              </select>
            </div>

            {/* Gender quick-filter pills */}
            <div className="inv-gender-pills">
              {[
                { value: "all", label: "✦ All" },
                { value: "women", label: "♀ Women" },
                { value: "men", label: "♂ Men" },
                { value: "children", label: "★ Children" },
                { value: "unisex", label: "◉ Unisex" },
              ].map((g) => (
                <button
                  key={g.value}
                  className={`inv-gender-pill ${invGender === g.value ? "active" : ""}`}
                  onClick={() => setInvGender(g.value)}
                >
                  {g.label}
                </button>
              ))}
            </div>

            {/* Product Grid */}
            <div className="inv-grid">
              {filteredInv.map((p) => {
                const pid = p._id || p.id;
                const stockStatus = p.status || "in";
                return (
                  <div key={pid} className="inv-card">
                    <div className="inv-img-wrap">
                      <img
                        src={getImageUrl(p.image || "/assets/hero_model.png")}
                        alt={p.name}
                        loading="lazy"
                        onError={(e) => {
                          e.target.src = "/assets/hero_model.png";
                        }}
                      />
                      <span
                        className={`inv-stock-badge inv-stock-${stockStatus}`}
                      >
                        {stockStatus === "in"
                          ? `In Stock · ${p.stock}`
                          : stockStatus === "low"
                            ? `Low · ${p.stock}`
                            : "Out of Stock"}
                      </span>
                      {p.gender && (
                        <span className="inv-gender-badge">
                          {p.gender === "women"
                            ? "♀ Women"
                            : p.gender === "men"
                              ? "♂ Men"
                              : p.gender === "children"
                                ? "★ Kids"
                                : "◉ Unisex"}
                        </span>
                      )}
                      {p.badge && (
                        <span
                          className={`inv-badge-label inv-badge-${p.badge}`}
                        >
                          {p.badge}
                        </span>
                      )}
                    </div>
                    <div className="inv-card-body">
                      <div className="inv-name">{p.name}</div>
                      <div className="inv-sku">SKU: {p.sku}</div>
                      {p.category && (
                        <div className="inv-category">{p.category}</div>
                      )}
                      <div className="inv-footer">
                        <div>
                          <span className="inv-price">${p.price}</span>
                          {p.oldPrice && (
                            <span className="inv-old-price">${p.oldPrice}</span>
                          )}
                        </div>
                        <div className="inv-actions">
                          <button
                            className="inv-btn edit"
                            aria-label="Edit product"
                            onClick={() => setEditProduct(p)}
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            className="inv-btn del"
                            aria-label="Delete product"
                            onClick={() => setDeleteProduct(p)}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Add Product placeholder card */}
              <div
                className="inv-card inv-card-add"
                onClick={() => setAddOpen(true)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && setAddOpen(true)}
              >
                <div className="inv-card-add-inner">
                  <div className="inv-card-add-icon">
                    <Plus size={28} />
                  </div>
                  <div className="inv-card-add-text">Add New Product</div>
                  <div className="inv-card-add-sub">
                    Women, Men, Children & more
                  </div>
                </div>
              </div>

              {filteredInv.length === 0 && (
                <div
                  style={{
                    gridColumn: "1/-1",
                    textAlign: "center",
                    padding: 48,
                    color: "var(--muted)",
                  }}
                >
                  No products match your search.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─ TRACKING ─ */}
        {page === "tracking" && (
          <div className="dash-content">
            <div className="dash-page-head">
              <div className="dash-page-title">Shipment Tracking</div>
              <div className="dash-page-sub">
                Live tracking for all active orders
              </div>
            </div>
            <div className="tracking-cards">
              {[
                {
                  id: "#HH-8820",
                  customer: "Sara Kifle · Stockholm, Sweden",
                  eta: "Jul 16, 2025",
                  steps: [
                    {
                      title: "Order Confirmed",
                      detail: "Payment processed · Addis Ababa",
                      time: "Jul 7 · 09:14 AM",
                      status: "done",
                    },
                    {
                      title: "Tailoring in Progress",
                      detail: "Custom embroidery started · Artisan Workshop",
                      time: "Jul 7 · 2:30 PM",
                      status: "done",
                    },
                    {
                      title: "Shipped — In Transit",
                      detail: "Ethiopian Airlines Cargo · ET8842",
                      time: "Jul 8 · 06:00 AM",
                      status: "active",
                    },
                    {
                      title: "Customs Clearance",
                      detail: "Stockholm Arlanda Airport, Sweden",
                      status: "pending",
                    },
                    {
                      title: "Out for Delivery",
                      detail: "Expected Jul 15–16",
                      status: "pending",
                    },
                    {
                      title: "Delivered",
                      detail: "Estimated Jul 16, 2025",
                      status: "pending",
                    },
                  ],
                },
                {
                  id: "#HH-8819",
                  customer: "Yonas Abebe · Toronto, Canada",
                  eta: "Jul 18, 2025",
                  steps: [
                    {
                      title: "Order Confirmed",
                      detail: "Payment processed · Addis Ababa",
                      time: "Jul 7 · 4:22 PM",
                      status: "done",
                    },
                    {
                      title: "Tailoring in Progress",
                      detail: "Master craftsman Solomon Tesfaye working",
                      time: "Jul 8 · 8:00 AM",
                      status: "active",
                    },
                    {
                      title: "Ready for Shipment",
                      detail: "Expected Jul 9, 2025",
                      status: "pending",
                    },
                    {
                      title: "International Shipping",
                      detail: "To Toronto, Canada · 7–10 days",
                      status: "pending",
                    },
                    {
                      title: "Delivered",
                      detail: "Estimated Jul 18, 2025",
                      status: "pending",
                    },
                  ],
                },
              ].map((order) => (
                <div key={order.id} className="tracking-card">
                  <div className="tracking-card-header">
                    <div>
                      <div className="tracking-order-num">{order.id}</div>
                      <div className="tracking-customer">{order.customer}</div>
                    </div>
                    <div className="tracking-eta">
                      <div className="tracking-eta-label">Est. Delivery</div>
                      <div className="tracking-eta-date">{order.eta}</div>
                    </div>
                  </div>
                  <div className="timeline">
                    {order.steps.map((step, i) => (
                      <div key={i} className="timeline-step">
                        <div className="timeline-line-wrap">
                          <div className={`timeline-dot-circle ${step.status}`}>
                            {step.status === "done"
                              ? "✓"
                              : step.status === "active"
                                ? "●"
                                : "○"}
                          </div>
                          {i < order.steps.length - 1 && (
                            <div
                              className={`timeline-connector ${step.status === "done" ? "done" : ""}`}
                            />
                          )}
                        </div>
                        <div className="timeline-step-body">
                          <div
                            className={`timeline-step-title ${step.status === "pending" ? "pending" : ""}`}
                          >
                            {step.title}
                          </div>
                          <div className="timeline-step-detail">
                            {step.detail}
                          </div>
                          {step.time && (
                            <div className="timeline-step-time">
                              {step.time}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─ TAILORING ─ */}
        {page === "tailoring" && (
          <div className="dash-content">
            <div className="dash-page-head">
              <div className="dash-page-title">Custom Tailoring</div>
              <div className="dash-page-sub">
                Manage bespoke measurement orders and body profiles
              </div>
            </div>
            <div className="tailoring-grid">
              <div className="form-card">
                <div className="form-card-title">Body Measurements Profile</div>
                <div className="form-card-sub">
                  Record customer measurements for a custom-tailored garment
                </div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    alert("Measurement profile saved! ✓");
                  }}
                >
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Full Name</label>
                      <input
                        type="text"
                        className="form-input"
                        defaultValue="Sara Kifle"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Gender</label>
                      <select className="form-select">
                        <option>Female</option>
                        <option>Male</option>
                        <option>Child</option>
                      </select>
                    </div>
                  </div>
                  {[
                    { label: "Bust / Chest", defaultVal: "88", unit: "cm" },
                    { label: "Waist", defaultVal: "72", unit: "cm" },
                    { label: "Hips", defaultVal: "96", unit: "cm" },
                    { label: "Height", defaultVal: "165", unit: "cm" },
                    { label: "Shoulder Width", defaultVal: "38", unit: "cm" },
                    { label: "Dress Length", defaultVal: "140", unit: "cm" },
                  ]
                    .reduce((rows, item, i) => {
                      if (i % 2 === 0) rows.push([]);
                      rows[rows.length - 1].push(item);
                      return rows;
                    }, [])
                    .map((pair, ri) => (
                      <div className="form-row" key={ri}>
                        {pair.map((field) => (
                          <div
                            className="form-group form-input-suffix"
                            key={field.label}
                          >
                            <label className="form-label">{field.label}</label>
                            <input
                              type="number"
                              className="form-input"
                              defaultValue={field.defaultVal}
                            />
                            <span>{field.unit}</span>
                          </div>
                        ))}
                      </div>
                    ))}
                  <div className="form-row full">
                    <div className="form-group">
                      <label className="form-label">Special Instructions</label>
                      <textarea
                        className="form-textarea"
                        defaultValue="Bridal order — please use heavy gold thread for Tilet. Ensure extra flare from knee down. Rush needed by July 15th."
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="btn-primary btn-gold"
                    style={{
                      marginTop: 8,
                      width: "100%",
                      justifyContent: "center",
                    }}
                  >
                    Save Measurement Profile
                  </button>
                </form>
              </div>

              <div className="form-card">
                <div className="form-card-title">Design Customization</div>
                <div className="form-card-sub">
                  Select pattern, fabric, and embroidery options for this order
                </div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    alert("Custom order created! 🎉");
                  }}
                >
                  {[
                    {
                      label: "Base Garment",
                      opts: [
                        "Habesha Kemis (Women's)",
                        "Traditional Suit (Men's)",
                        "Bridal Kemis",
                        "Children's Kemis",
                      ],
                    },
                    {
                      label: "Fabric Color",
                      opts: ["Pure White", "Ivory Cream", "Off-White"],
                    },
                    {
                      label: "Tilet Pattern",
                      opts: [
                        "Classic Ethiopian",
                        "Royal Lalibela",
                        "Gondar Palace",
                        "Modern Fusion",
                      ],
                    },
                    {
                      label: "Embroidery Thread",
                      opts: [
                        "Gold Thread",
                        "Silver Thread",
                        "Red & Gold Mix",
                        "Tricolor (R/G/B)",
                      ],
                    },
                    {
                      label: "Embroidery Density",
                      opts: ["Standard", "Heavy (Bridal)", "Minimal"],
                    },
                    {
                      label: "Rush Order",
                      opts: [
                        "Standard (14–21 days)",
                        "Rush (7–10 days) +$40",
                        "Express (3–5 days) +$80",
                      ],
                    },
                  ].map((field) => (
                    <div className="form-row full" key={field.label}>
                      <div className="form-group">
                        <label className="form-label">{field.label}</label>
                        <select className="form-select">
                          {field.opts.map((o) => (
                            <option key={o}>{o}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}
                  <div className="form-row full">
                    <div className="form-group">
                      <label className="form-label">Additional Requests</label>
                      <textarea
                        className="form-textarea"
                        placeholder="Any additional customization requests..."
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="btn-primary"
                    style={{
                      marginTop: 8,
                      width: "100%",
                      justifyContent: "center",
                    }}
                  >
                    Create Custom Order
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* ─ AI ASSISTANT ─ */}
        {page === "ai" && (
          <div className="dash-content">
            <div className="dash-page-head">
              <div className="dash-page-title">AI Styling Assistant</div>
              <div className="dash-page-sub">
                Your personal store analytics and fashion advisor
              </div>
            </div>
            <div className="dash-ai-wrap">
              <div className="dash-ai-card">
                <div className="ai-header">
                  <div className="ai-header-icon">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <div className="ai-header-title">Habesha Style AI</div>
                    <div className="ai-header-sub">
                      Powered by store analytics · Always available
                    </div>
                  </div>
                  <div className="ai-online-dot" />
                </div>
                <div
                  className="ai-chat"
                  ref={aiChatRef}
                  style={{ height: 360 }}
                >
                  {aiMsgs.map((msg, i) => (
                    <div
                      key={i}
                      className={`ai-msg ${msg.role === "user" ? "user" : ""}`}
                    >
                      {msg.role === "bot" && (
                        <div className="ai-avatar">
                          <Sparkles size={14} />
                        </div>
                      )}
                      <div
                        className={`ai-bubble ${msg.role === "bot" ? "ai-bubble-bot" : "ai-bubble-user"}`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  {aiTyping && (
                    <div className="ai-msg">
                      <div className="ai-avatar">
                        <Sparkles size={14} />
                      </div>
                      <div className="ai-bubble ai-bubble-bot">
                        <div className="ai-typing-dot">
                          <span />
                          <span />
                          <span />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="ai-quick-chips">
                  {[
                    "📈 Top performing products",
                    "🎉 Timkat season tips",
                    "📏 Sizing recommendations",
                    "📊 Conversion advice",
                  ].map((chip) => (
                    <button
                      key={chip}
                      className="ai-chip"
                      onClick={() => sendAi(chip)}
                    >
                      {chip}
                    </button>
                  ))}
                </div>
                <div className="ai-input-bar">
                  <input
                    type="text"
                    placeholder="Ask anything about your store, styling, or product strategy..."
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") sendAi();
                    }}
                    aria-label="AI chat input"
                  />
                  <button
                    className="ai-send-btn"
                    onClick={() => sendAi()}
                    aria-label="Send"
                  >
                    <Send size={15} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Other pages fallback */}
        {["analytics", "customers", "settings"].includes(page) && (
          <div className="dash-content">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 400,
                gap: 16,
                color: "var(--muted)",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 64 }}>🚧</div>
              <div
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: 22,
                  color: "var(--charcoal)",
                }}
              >
                Coming Soon
              </div>
              <p style={{ maxWidth: 320, fontSize: 14 }}>
                The {pageTitle} page is under development. It will be available
                in the next release.
              </p>
              <button
                className="btn-primary btn-sm btn-gold"
                onClick={() => setPage("overview")}
              >
                Back to Overview
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
