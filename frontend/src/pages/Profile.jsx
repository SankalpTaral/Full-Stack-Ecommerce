

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../services/authService";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("Fetching Profile");
    const fetchProfile = async () => {
      try {
      const data = await getProfile();  
        setUser(data.user);
      } catch (error) {
        if (error.response?.status === 401) {
          navigate("/login", { replace: true });
          return;
        }

        setError(
          error.response?.data?.message ||
          "Something went wrong. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  if (loading) {
    return <div className="min-h-screen bg-[#111] p-8 text-white">Loading profile...</div>;
  }

  if (error) {
    return <div className="min-h-screen bg-[#111] p-8 text-red-400">{error}</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#111] p-8 text-white">
      <h1 className="mb-6 text-3xl font-bold">My Profile</h1>

      <div className="max-w-md space-y-3 rounded-xl border border-white/10 bg-white/5 p-6">
        <p>Name: {user.name || user.firstName || "N/A"}</p>
        <p>Email: {user.email || user.emailId || "N/A"}</p>
      </div>
    </div>
  );
}

export default Profile;
