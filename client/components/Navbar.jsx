import { Link, useNavigate } from "react-router";
export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  return (
    <>
      <nav className="navbar bg-gray-800 text-white shadow-lg">
        <div className="container mx-auto flex justify-between items-center p-4">
          <a className="text-xl font-bold">ISM Application</a>
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="hover:bg-gray-700 px-3 py-2 rounded transition"
            >
              Home
            </Link>
            <Link
              to="/add-application"
              className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded transition font-semibold"
            >
              Add Application
            </Link>
            <button
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded transition font-semibold"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
