import { useState } from "react";
import { useNavigate } from "react-router";
import axios from "../src/config/axios";
import Swal from "sweetalert2";

export default function AddApplication() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    no_aplikasi: "",
    nama: "",
    tanggal_lahir: "",
    tempat_lahir: "",
    jenis_kelamin: "Laki-laki",
    alamat: "",
    kode_pos: "",
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
      await axios.post("/applications", formData);
      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Aplikasi berhasil ditambahkan",
      });
      navigate("/");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: error.response?.data?.message || "Terjadi kesalahan",
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Tambah Aplikasi Baru</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div>
            <label className="label font-semibold">Nomor Aplikasi</label>
            <input
              type="text"
              name="no_aplikasi"
              className="input w-full border border-gray-300 p-2 rounded"
              value={formData.no_aplikasi}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="label font-semibold">Nama</label>
            <input
              type="text"
              name="nama"
              className="input w-full border border-gray-300 p-2 rounded"
              value={formData.nama}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="label font-semibold">Tanggal Lahir</label>
            <input
              type="date"
              name="tanggal_lahir"
              className="input w-full border border-gray-300 p-2 rounded"
              value={formData.tanggal_lahir}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="label font-semibold">Tempat Lahir</label>
            <input
              type="text"
              name="tempat_lahir"
              className="input w-full border border-gray-300 p-2 rounded"
              value={formData.tempat_lahir}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="label font-semibold">Jenis Kelamin</label>
            <select
              name="jenis_kelamin"
              className="input w-full border border-gray-300 p-2 rounded"
              value={formData.jenis_kelamin}
              onChange={handleChange}
            >
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>
          </div>
          <div>
            <label className="label font-semibold">Kode Pos</label>
            <input
              type="text"
              name="kode_pos"
              className="input w-full border border-gray-300 p-2 rounded"
              value={formData.kode_pos}
              onChange={handleChange}
            />
          </div>
          <div className="col-span-2">
            <label className="label font-semibold">Alamat</label>
            <textarea
              name="alamat"
              className="input w-full border border-gray-300 p-2 rounded h-24"
              value={formData.alamat}
              onChange={handleChange}
            />
          </div>
          <div className="col-span-2 flex gap-2">
            <button
              type="submit"
              className="btn bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex-1"
            >
              Tambah Aplikasi
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="btn bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 flex-1"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
