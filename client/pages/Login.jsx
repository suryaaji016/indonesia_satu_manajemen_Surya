import { useState } from "react";
import { useNavigate, Link } from "react-router";
import axios from "../src/config/axios";
import Swal from "sweetalert2";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/login", formData);
      localStorage.setItem("access_token", data.access_token);
      Swal.fire({
        icon: "success",
        title: "Login Berhasil!",
        text: "Selamat datang!",
      });
      navigate("/");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Login Gagal",
        text: error.response?.data?.message || "Terjadi kesalahan",
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-96 border p-6">
        <legend className="fieldset-legend text-2xl font-bold">Login</legend>
        <form onSubmit={handleSubmit}>
          <label className="label">Email</label>
          <input
            type="email"
            name="email"
            className="input w-full"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />

          <label className="label mt-2">Password</label>
          <input
            type="password"
            name="password"
            className="input w-full"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />

          <button type="submit" className="btn btn-neutral mt-4 w-full">
            Login
          </button>
        </form>
        <p className="text-center mt-4">
          Belum punya akun?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>
      </fieldset>
    </div>
  );
}
