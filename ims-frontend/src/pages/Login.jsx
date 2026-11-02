import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (event) => {
    event.preventDefault();
    if (username === "admin" && password === "admin") {
      setError("");
      navigate("/home");
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <main className="login-screen">
      <section className="login-showcase">
        <div className="showcase-brand"><span className="brand-mark">▦</span> IMS</div>
        <div className="showcase-copy">
          <p className="eyebrow">INVENTORY CONTROL, SIMPLIFIED</p>
          <h1>Inventory<br />Management<br />System</h1>
          <p>Manage vendors, materials, purchases and reports in one organized workspace.</p>
        </div>
        <div className="showcase-points">
          <span>◇ Track inventory</span><span>♧ Manage vendors</span><span>▥ View reports</span>
        </div>
      </section>
      <section className="login-panel">
        <div className="login-card">
          <div className="login-icon">▦</div>
          <p className="eyebrow">WELCOME BACK</p>
          <h2>Sign in to IMS</h2>
          <p className="muted">Enter your account details to continue.</p>
          <form onSubmit={handleLogin}>
            <label htmlFor="username">Username</label>
            <input id="username" type="text" autoComplete="username" placeholder="Enter username" value={username} onChange={(e) => setUsername(e.target.value)} required />
            <label htmlFor="password">Password</label>
            <input id="password" type="password" autoComplete="current-password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            {error && <p className="form-error" role="alert">{error}</p>}
            <button className="primary-button login-submit" type="submit">Sign in <span>→</span></button>
          </form>
          <p className="login-footnote">Inventory Management System · Demo access</p>
        </div>
      </section>
    </main>
  );
}
