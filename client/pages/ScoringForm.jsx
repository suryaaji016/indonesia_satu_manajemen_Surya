import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import axios from "../src/config/axios";
import Swal from "sweetalert2";

export default function ScoringForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [application, setApplication] = useState(null);
  const [groups, setGroups] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});
  const [loading, setLoading] = useState(true);
  const [existingScore, setExistingScore] = useState(null);

  const groupItemsByCategory = (items) => {
    if (!items || items.length === 0) {
      return [];
    }

    const categories = {};
    items.forEach((item) => {
      const parts = item.nama_item.split(" - ");
      const category = parts[0] || item.nama_item;

      if (!categories[category]) {
        categories[category] = {
          name: category,
          bobot_d: item.bobot_d,
          items: [],
        };
      }
      categories[category].items.push(item);
    });

    return Object.values(categories);
  };

  const calculateScores = () => {
    let totalScore = 0;
    const groupScores = {};

    groups.forEach((group) => {
      let groupScore = 0;

      Object.keys(selectedItems).forEach((categoryKey) => {
        const itemId = selectedItems[categoryKey];
        if (group.Items) {
          const selectedItem = group.Items.find((item) => item.id === itemId);
          if (selectedItem) {
            const itemScore = selectedItem.bobot_f * selectedItem.bobot_d;
            groupScore += itemScore;
          }
        }
      });

      const weightedGroupScore = groupScore * group.bobot_b;
      groupScores[group.id] = {
        score: groupScore,
        weightedScore: weightedGroupScore,
      };
      totalScore += weightedGroupScore;
    });

    return { totalScore, groupScores };
  };

  const { totalScore, groupScores } = calculateScores();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appRes, groupsRes, scoreRes] = await Promise.all([
          axios.get(`/applications/${id}`),
          axios.get("/groups"),
          axios.get(`/scoring/${id}`).catch(() => null),
        ]);

        setApplication(appRes.data);
        setGroups(groupsRes.data);

        if (scoreRes && scoreRes.data) {
          setExistingScore(scoreRes.data);

          if (scoreRes.data.details && scoreRes.data.details.length > 0) {
            const preSelectedItems = {};
            scoreRes.data.details.forEach((answer) => {
              if (answer.Item) {
                const groupId = answer.Item.groupId;
                const categoryName = answer.Item.nama_item.split(" - ")[0];
                const categoryKey = `${groupId}-${categoryName}`;
                preSelectedItems[categoryKey] = answer.itemId;
              }
            });
            setSelectedItems(preSelectedItems);
          }
        }

        setLoading(false);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response?.data?.message || "Gagal mengambil data",
        });
        navigate("/");
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleItemSelect = (categoryKey, itemId) => {
    setSelectedItems((prev) => ({
      ...prev,
      [categoryKey]: itemId,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let totalCategories = 0;
    groups.forEach((group) => {
      if (group.Items) {
        const categories = groupItemsByCategory(group.Items);
        totalCategories += categories.length;
      }
    });

    if (Object.keys(selectedItems).length < totalCategories) {
      Swal.fire({
        icon: "warning",
        title: "Perhatian",
        text: "Silakan pilih item untuk semua kategori",
      });
      return;
    }

    try {
      const answers = Object.values(selectedItems).map((itemId) => ({
        itemId,
      }));

      const { data } = await axios.post("/scoring", {
        applicationId: id,
        answers,
      });

      const riskColor =
        data.score.risk_level === "HIGH RISK"
          ? "red"
          : data.score.risk_level === "MEDIUM RISK"
          ? "orange"
          : "green";

      Swal.fire({
        icon: "success",
        title: existingScore
          ? "Scoring Berhasil Diupdate!"
          : "Scoring Berhasil!",
        html: `
          <div class="text-left">
            <p><strong>Total Score:</strong> ${data.score.total_score.toFixed(
              2
            )}</p>
            <p><strong>Status:</strong> ${data.score.status}</p>
            <p><strong>Risk Level:</strong> <span style="color: ${riskColor}; font-weight: bold;">${
          data.score.risk_level
        }</span></p>
          </div>
        `,
      }).then(() => {
        navigate("/");
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: error.response?.data?.message || "Terjadi kesalahan",
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">
          {existingScore ? "Edit Scoring Aplikasi" : "Form Scoring Aplikasi"}
        </h2>

        {existingScore && (
          <div className="mb-4 p-4 bg-blue-100 rounded border border-blue-300">
            <h3 className="font-bold text-lg mb-2">Scoring Sebelumnya</h3>
            <p>
              <strong>Total Score:</strong>{" "}
              {existingScore.score.total_score.toFixed(2)}
            </p>
            <p>
              <strong>Status:</strong> {existingScore.score.status}
            </p>
          </div>
        )}

        <div className="mb-6 p-4 bg-yellow-100 rounded border border-yellow-300">
          <h3 className="font-bold text-lg mb-2">Informasi Aplikasi</h3>
          <p>
            <strong>No Aplikasi:</strong> {application.no_aplikasi}
          </p>
          <p>
            <strong>Nama:</strong> {application.nama}
          </p>
          <p>
            <strong>Tanggal Lahir:</strong>{" "}
            {new Date(application.tanggal_lahir).toLocaleDateString("id-ID")}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {groups.map((group) => (
              <div
                key={group.id}
                className="border border-gray-300 p-4 rounded"
              >
                <div className="mb-3 bg-yellow-400 p-2 rounded flex justify-between items-center">
                  <h3 className="font-bold text-lg">{group.nama_group}</h3>
                  {groupScores[group.id] && (
                    <div className="text-right">
                      <p className="text-sm font-semibold">
                        Score: {groupScores[group.id]?.score.toFixed(2)}
                      </p>
                      <p className="text-sm font-bold text-blue-800">
                        Weighted:{" "}
                        {groupScores[group.id]?.weightedScore.toFixed(2)}
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {group.Items && group.Items.length > 0 ? (
                    groupItemsByCategory(group.Items).map((category) => (
                      <div
                        key={`${group.id}-${category.name}`}
                        className="border border-gray-200 p-3 rounded bg-gray-50"
                      >
                        <h4 className="font-semibold text-md mb-2 text-gray-700">
                          {category.name}
                        </h4>
                        <div className="space-y-2 ml-4">
                          {category.items.map((item) => {
                            const categoryKey = `${group.id}-${category.name}`;
                            const parts = item.nama_item.split(" - ");
                            const optionName = parts[1] || item.nama_item;

                            return (
                              <div
                                key={item.id}
                                className="flex items-center space-x-3 p-2 hover:bg-white rounded"
                              >
                                <input
                                  type="radio"
                                  id={`item-${item.id}`}
                                  name={categoryKey}
                                  value={item.id}
                                  checked={
                                    selectedItems[categoryKey] === item.id
                                  }
                                  onChange={() =>
                                    handleItemSelect(categoryKey, item.id)
                                  }
                                  className="w-4 h-4 cursor-pointer"
                                />
                                <label
                                  htmlFor={`item-${item.id}`}
                                  className="flex-1 cursor-pointer"
                                >
                                  <span className="font-medium">
                                    {optionName}
                                  </span>
                                  {selectedItems[categoryKey] === item.id && (
                                    <span className="ml-2 text-sm font-bold text-green-600">
                                      → Score:{" "}
                                      {(item.bobot_f * item.bobot_d).toFixed(2)}
                                    </span>
                                  )}
                                </label>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-red-500">
                      No items found for this group
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Summary Score Panel */}
          <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-2 border-blue-300 shadow-lg">
            <h3 className="text-2xl font-bold mb-4 text-center text-blue-900">
              SUMMARY SCORE
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg shadow text-center">
                <p className="text-sm text-gray-600 mb-1">
                  Categories Selected
                </p>
                <p className="text-3xl font-bold text-blue-600">
                  {Object.keys(selectedItems).length}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow text-center">
                <p className="text-sm text-gray-600 mb-1">Total Score</p>
                <p className="text-4xl font-bold text-purple-600">
                  {totalScore.toFixed(2)}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow text-center">
                <p className="text-sm text-gray-600 mb-1">Risk Level</p>
                <p
                  className="text-2xl font-bold"
                  style={{
                    color:
                      totalScore <= 55
                        ? "red"
                        : totalScore <= 70
                        ? "orange"
                        : "green",
                  }}
                >
                  {totalScore === 0
                    ? "-"
                    : totalScore <= 55
                    ? "HIGH RISK"
                    : totalScore <= 70
                    ? "MEDIUM RISK"
                    : "LOW RISK"}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="relative w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div
                  className="h-4 transition-all duration-500"
                  style={{
                    width: `${totalScore}%`,
                    backgroundColor:
                      totalScore <= 55
                        ? "#ef4444"
                        : totalScore <= 70
                        ? "#f97316"
                        : "#22c55e",
                  }}
                ></div>
                <div className="absolute top-0 left-0 w-full h-full flex pointer-events-none">
                  <div
                    className="h-full border-r-2 border-gray-400"
                    style={{ width: "55%" }}
                  ></div>
                  <div
                    className="h-full border-r-2 border-gray-400"
                    style={{ width: "15%" }}
                  ></div>
                  <div className="h-full" style={{ width: "30%" }}></div>
                </div>
              </div>
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>0</span>
                <span
                  style={{ marginLeft: "55%", transform: "translateX(-50%)" }}
                >
                  55
                </span>
                <span
                  style={{ marginLeft: "70%", transform: "translateX(-50%)" }}
                >
                  70
                </span>
                <span>100</span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-2">
            <button
              type="submit"
              className="btn bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 flex-1 font-bold"
            >
              {existingScore ? "Update Scoring" : "Submit Scoring"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="btn bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 flex-1"
            >
              Batal
            </button>
          </div>
        </form>

        <div className="mt-6 p-4 bg-blue-100 rounded border border-blue-300">
          <h4 className="font-bold mb-2">Keterangan Risk Level:</h4>
          <ul className="text-sm space-y-1">
            <li>
              <span className="font-bold text-red-600">HIGH RISK:</span> Score
              &lt;= 55
            </li>
            <li>
              <span className="font-bold text-yellow-600">MEDIUM RISK:</span>{" "}
              Score 56-70
            </li>
            <li>
              <span className="font-bold text-green-600">LOW RISK:</span> Score
              &gt; 70
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
