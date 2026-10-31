
import Navbar from "../components/Navbar";

function Home() {
  return (
    <div className="home-page">
      <Navbar />

      <div className="home-content">
        <h2>Welcome!</h2>

        <p>
          Manage your purchases and vendor reports.
        </p>
      </div>
    </div>
  );
}

export default Home;