import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Home() {
  const navigate = useNavigate();
  return (
    <div className="app-shell">
      <Navbar />
      <main className="content-wrap">
        <div className="page-heading">
          <div><p className="eyebrow">OVERVIEW</p><h1>Dashboard</h1><p className="muted">Welcome back. Manage your inventory operations from here.</p></div>
          <span className="date-chip">Inventory workspace</span>
        </div>
        <section className="welcome-banner">
          <div><p className="eyebrow light">YOUR INVENTORY, AT A GLANCE</p><h2>Keep every purchase organized.</h2><p>Record material purchases, manage vendor information and review purchase activity.</p></div>
          <div className="banner-symbol">▦</div>
        </section>
        <section className="section-block">
          <div className="section-title"><div><h2>Quick actions</h2><p className="muted">Choose what you'd like to do next.</p></div></div>
          <div className="action-grid">
            <button className="action-card" onClick={() => navigate("/purchase-entry")}><span className="action-icon blue">＋</span><span><strong>Create purchase entry</strong><small>Record a new material purchase</small></span><b>→</b></button>
            <button className="action-card" onClick={() => navigate("/report")}><span className="action-icon violet">▤</span><span><strong>View purchase reports</strong><small>Filter purchases by vendor and date</small></span><b>→</b></button>
          </div>
        </section>
        <section className="section-block">
          <div className="section-title"><div><h2>System Architecture</h2><p className="muted">Independent services working together to manage your inventory workflow.</p></div></div>
          <div className="module-grid">
            <article className="module-card"><span className="module-icon">♧</span><h3>Vendor Service</h3><p>Retrieve and work with vendor details through the vendor microservice.</p><span className="module-tag">Backend service</span></article>
            <article className="module-card"><span className="module-icon">▦</span><h3>Material Service</h3><p>Access material categories, material types and units.</p><span className="module-tag">Backend service</span></article>
            <article className="module-card"><span className="module-icon">▤</span><h3>Inventory Service</h3><p>Save purchase transactions and generate vendor-wise reports.</p><span className="module-tag">Core service</span></article>
          </div>
        </section>
      </main>
    </div>
  );
}
