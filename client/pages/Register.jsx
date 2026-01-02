import { useState } from "react";
import { useNavigate, Link } from "react-router";
import axios from "../src/config/axios";
import Swal from "sweetalert2";

export default function Register() {
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
      await axios.post("/register", formData);
      Swal.fire({
        icon: "success",
        title: "Registrasi Berhasil!",
        text: "Silakan login dengan akun Anda",
      });
      navigate("/login");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Registrasi Gagal",
        text: error.response?.data?.message || "Terjadi kesalahan",
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-96 border p-6">
        <legend className="fieldset-legend text-2xl font-bold">Register</legend>
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
            Register
          </button>
        </form>
        <p className="text-center mt-4">
          Sudah punya akun?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </fieldset>
    </div>
  );
}
