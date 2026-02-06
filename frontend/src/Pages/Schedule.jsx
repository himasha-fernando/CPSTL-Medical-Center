import React, { useEffect, useState } from "react";
import api from "../utils/api";
import {
  Calendar,
  Building,
  Search,
  X,
  Edit2,
  Trash2,
  Plus,
  CheckCircle,
  AlertCircle,
  Sparkles,
  TrendingUp,
  Clock,
} from "lucide-react";
import AppSidebar from "../Components/AppSidebar";
import AppHeader from "../Components/AppHeader";
import AppFooter from "../Components/AppFooter";

const DEPARTMENTS = [
  "ANURADHAPURA HOLIDAY",
  "AUTO MOBILE",
  "BULK MOVE. & BULK PR",
  "DGM(ENG & SS)",
  "DGM(FINANCE)",
  "DGM(HR & ADMIN)",
  "DGM(O)",
  "DISTRIBUTION",
  "ENGINEERING - DEVE.",
  "FIRE & SAFETY",
  "FINANCE",
  "INFORMATION SYSTEMS",
  "INTERNAL AUDIT",
  "INVESTIGATION",
  "IRD VAUNIYA",
  "KANDY HOLIDAY HOME",
  "KATARAGAMA HOLIDAY",
  "KKS",
  "LEGAL",
  "LBD ANURADHAPURA",
  "LBD BADULLA",
  "LBD BATTICALOA",
  "LBD GALLE",
  "LBD HAPUTALE",
  "LBD KOTAGALA",
  "LBD KURUNEGELA",
  "LBD MATARA",
  "LBD PERADENIYA",
  "LBD SARASAVI UYANA",
  "MAIN LABORATORY",
  "MEDICAL CENTER",
  "MUTHURAJWELA TERM",
  "NUWARAELIYA HOLIDAY",
  "OIL FACILITIES - OFF",
  "PERSONNEL",
  "PREMISES & ENGG. SER",
  "PROCUREMENT",
  "SECRETARIAT",
  "SECURITY",
  "STORES",
  "TRAINING",
];

const Schedule = () => {
  const [department, setDepartment] = useState("");
  const [dates, setDates] = useState(["", "", ""]);
  const [lastScheduleDate, setLastScheduleDate] = useState(null);
  const [nextAllowedDate, setNextAllowedDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [latestDates, setLatestDates] = useState([]);
  const [allSchedules, setAllSchedules] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [filteredSchedules, setFilteredSchedules] = useState([]);
  const [dateNotes, setDateNotes] = useState(["", "", ""]);
  const [searchType, setSearchType] = useState("department");
  const [searchValue, setSearchValue] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSearch = () => {
    if (searchType === "department") {
      const results = allSchedules.filter(
        (dep) => dep.department.toLowerCase() === searchValue.toLowerCase(),
      );
      setSearchResults(results);
    } else if (searchType === "date") {
      const results = allSchedules.filter((dep) =>
        dep.dates.some(
          (d) =>
            new Date(d).toDateString() === new Date(searchDate).toDateString(),
        ),
      );
      setSearchResults(results);
    }
  };

  const handleResetSearch = () => {
    setSearchValue("");
    setSearchDate("");
    setSearchResults([]);
  };

  const handleEdit = (schedule) => {
    setEditingId(schedule.id);
    setDepartment(schedule.department);
    setDates(schedule.dates.map((d) => d.slice(0, 10)));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this schedule?"))
      return;

    await api.delete(`/api/schedules/${id}`);
    fetchAllSchedules();
  };

  const fetchAllSchedules = async () => {
    try {
      const res = await api.get("/api/schedules/latest-all");
      setAllSchedules(res.data || []);
    } catch (err) {
      console.error("Error fetching all schedules:", err);
      setAllSchedules([]);
    }
  };

  useEffect(() => {
    if (!department) {
      setFilteredSchedules(sortedSchedules);
      const filtered = sortedSchedules.filter(
        (dep) => dep.department === department,
      );
      setFilteredSchedules(filtered);
    }
  }, [department, allSchedules]);

  useEffect(() => {
    fetchAllSchedules();
  }, []);

  useEffect(() => {
    if (!department) {
      setLastScheduleDate(null);
      setNextAllowedDate(null);
      setLatestDates([]);
      return;
    }

    api
      .get(`/api/schedules/last/${department}`, {
        params: { excludeId: editingId },
      })
      .then((res) => {
        if (res.data?.lastDate) {
          const last = new Date(res.data.lastDate);
          setLastScheduleDate(last);

          const next = new Date(last);
          next.setMonth(next.getMonth() + 6);
          setNextAllowedDate(next);
        } else {
          setLastScheduleDate(null);
          setNextAllowedDate(null);
        }
      });

    api
      .get(`/api/schedules/latest/${department}`)
      .then((res) => setLatestDates(res.data || []))
      .catch(() => setLatestDates([]));
  }, [department, editingId]);

  const handleDateChange = (index, value) => {
    const updatedDates = [...dates];
    updatedDates[index] = value;
    setDates(updatedDates);

    const note = value
      ? allSchedules.some((dep) =>
          dep.dates.some(
            (d) =>
              new Date(d).toDateString() === new Date(value).toDateString(),
          ),
        )
        ? "Date already scheduled"
        : ""
      : "";

    const updatedNotes = [...dateNotes];
    updatedNotes[index] = note;
    setDateNotes(updatedNotes);
  };

  const handleSave = async () => {
    if (!department || dates.some((d) => !d)) {
      alert("Please select department and all three dates");
      return;
    }

    if (!editingId && nextAllowedDate) {
      const earliest = new Date(Math.min(...dates.map((d) => new Date(d))));
      if (earliest < nextAllowedDate) {
        alert(
          `Next schedule can be added only after ${nextAllowedDate.toDateString()}`,
        );
        return;
      }
    }

    setLoading(true);

    try {
      if (editingId) {
        await api.put(`/api/schedules/${editingId}`, {
          dates,
        });
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        setEditingId(null);
      } else {
        await api.post("/api/schedules", {
          department,
          dates,
        });
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }

      fetchAllSchedules();

      const latestRes = await api.get(`/api/schedules/latest/${department}`);
      setLatestDates(latestRes.data || []);

      setDepartment("");
      setDates(["", "", ""]);
    } catch (err) {
      console.error(err);
      alert("Error saving schedule");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setDepartment("");
    setDates(["", "", ""]);
  };

  const sortedSchedules = [...allSchedules]
    .map((dep) => ({
      ...dep,
      earliestDate: dep.dates.length
        ? new Date(Math.min(...dep.dates.map((d) => new Date(d))))
        : null,
    }))
    .sort((a, b) => {
      if (!a.earliestDate) return 1;
      if (!b.earliestDate) return -1;
      return a.earliestDate - b.earliestDate;
    });

  useEffect(() => {
    const init = async () => {
      await api.post("/api/schedules/auto-update");
      await fetchAllSchedules();
    };

    init();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setDepartment("");
    setDates(["", "", ""]);
    setDateNotes(["", "", ""]);
    setLastScheduleDate(null);
    setNextAllowedDate(null);
    setLatestDates([]);
    setFilteredSchedules(sortedSchedules);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AppSidebar />

      <div className="flex-1 flex flex-col">
        <AppHeader />

        <main className="flex-1 p-3 md:p-6">
          <div className="max-w-7xl mx-auto space-y-5">
            {/* Success Toast */}
            {showSuccess && (
              <div className="fixed top-20 right-4 z-50 animate-[slideIn_0.3s_ease-out]">
                <div className="bg-white border-l-4 border-green-500 px-4 py-3 rounded-lg shadow-xl flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="font-medium text-gray-800">
                    Schedule saved successfully!
                  </span>
                </div>
              </div>
            )}

            {/* Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-red-50 rounded-xl">
                    <Calendar className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      Doctor Schedule Management
                    </h1>
                    <p className="text-gray-500 text-sm mt-0.5">
                      Manage department schedules efficiently
                    </p>
                  </div>
                </div>

                {editingId && (
                  <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 font-medium text-sm">
                    <Edit2 className="w-3.5 h-3.5" />
                    Editing Mode
                  </div>
                )}
              </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Left Column - Form */}
              <div className="lg:col-span-5 space-y-5">
                {/* Main Form Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="px-5 py-4 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-red-600" />
                      Schedule Details
                    </h2>
                  </div>

                  <div className="p-5 space-y-4">
                    {/* Department Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1.5">
                        <Building className="w-4 h-4 text-gray-400" />
                        Department
                      </label>
                      <select
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        disabled={!!editingId}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-white
                                 disabled:bg-gray-50 disabled:cursor-not-allowed
                                 focus:border-red-500 focus:ring-2 focus:ring-red-100 
                                 transition-all duration-200 outline-none
                                 hover:border-gray-400"
                      >
                        <option value="">Select Department</option>
                        {DEPARTMENTS.map((dep) => (
                          <option key={dep} value={dep}>
                            {dep}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Date Rule Info */}
                    {lastScheduleDate && !editingId && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <div className="text-sm text-blue-800 space-y-1">
                            <p>
                              Last schedule:{" "}
                              <span className="font-semibold">
                                {lastScheduleDate.toLocaleDateString()}
                              </span>
                            </p>
                            <p>
                              Next allowed after:{" "}
                              <span className="font-semibold">
                                {nextAllowedDate.toLocaleDateString()}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Date Inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {dates.map((date, index) => (
                        <div key={index}>
                          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-xs font-bold">
                              {index + 1}
                            </div>
                            Day {index + 1}
                          </label>

                          <input
                            type="date"
                            value={date}
                            onChange={(e) =>
                              handleDateChange(index, e.target.value)
                            }
                            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm
                   focus:border-red-500 focus:ring-2 focus:ring-red-100
                   transition-all duration-200 outline-none
                   hover:border-gray-400"
                          />

                          {dateNotes[index] && (
                            <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1 font-medium">
                              <AlertCircle className="w-3 h-3" />
                              {dateNotes[index]}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-3">
                      {/* Save,Update */}
                      <button
                        onClick={handleSave}
                        disabled={loading}
                        className="px-5 py-2 rounded-full bg-red-600 text-white text-sm font-semibold
               hover:bg-red-700 transition-all duration-200 shadow-sm hover:shadow-md
               flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {loading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            {editingId ? (
                              <Edit2 className="w-4 h-4" />
                            ) : (
                              <Plus className="w-4 h-4" />
                            )}
                            {editingId ? "Update Schedule" : "Save Schedule"}
                          </>
                        )}
                      </button>

                      {/* Cancel  */}
                      <button
                        onClick={resetForm}
                        className="px-5 py-2 rounded-full border border-gray-300 bg-white text-gray-700 text-sm font-semibold
               hover:bg-gray-50 hover:border-gray-400 transition-all duration-200
               flex items-center justify-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>

                {/* Search Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="px-5 py-4 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <Search className="w-5 h-5 text-red-600" />
                      Search Schedules
                    </h3>
                  </div>

                  <div className="p-5 space-y-4">
                    {/* Toggle Buttons - Small */}
                    <div className="flex justify-center">
                      <div className="relative flex bg-red-600 rounded-full p-1 w-[260px]">
                        {/* Sliding pill */}
                        <div
                          className={`absolute top-1 bottom-1 w-1/2 bg-white rounded-full transition-all duration-300 ease-out
        ${searchType === "department" ? "left-1" : "left-[50%]"}`}
                        />

                        {/* Department */}
                        <button
                          onClick={() => setSearchType("department")}
                          className={`relative z-10 w-1/2 py-2 text-sm font-semibold rounded-full transition-colors
        ${searchType === "department" ? "text-gray-600" : "text-white"}`}
                        >
                          Department
                        </button>

                        {/* Date */}
                        <button
                          onClick={() => setSearchType("date")}
                          className={`relative z-10 w-1/2 py-2 text-sm font-semibold rounded-full transition-colors
        ${searchType === "date" ? "text-gray-600" : "text-white"}`}
                        >
                          Date
                        </button>
                      </div>
                    </div>

                    {/* Search Input */}
                    {searchType === "department" ? (
                      <select
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm
                                 focus:border-red-500 focus:ring-2 focus:ring-red-100 
                                 transition-all duration-200 outline-none hover:border-gray-400"
                      >
                        <option value="">Select Department</option>
                        {DEPARTMENTS.map((dep) => (
                          <option key={dep} value={dep}>
                            {dep}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="date"
                        value={searchDate}
                        onChange={(e) => setSearchDate(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm
                                 focus:border-red-500 focus:ring-2 focus:ring-red-100 
                                 transition-all duration-200 outline-none hover:border-gray-400"
                      />
                    )}

                    <div className="flex gap-3">
                      <button
                        onClick={handleSearch}
                        className="px-5 py-2 rounded-full bg-red-600 text-white text-sm font-semibold
             hover:bg-red-700 transition-all duration-200 shadow-sm hover:shadow-md
             flex items-center justify-center gap-2"
                      >
                        <Search className="w-4 h-4" />
                        Search
                      </button>

                      <button
                        onClick={handleResetSearch}
                        className="px-5 py-2 rounded-full border border-gray-300 bg-white text-gray-700 text-sm font-semibold
             hover:bg-gray-50 transition-all duration-200 shadow-sm
             flex items-center justify-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        Reset
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Schedule Grid */}
              <div className="lg:col-span-7">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-full flex flex-col">
                  <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-red-600" />
                      Department Schedules
                    </h3>
                    <span className="text-sm text-gray-500 font-medium bg-gray-100 px-3 py-1 rounded-full">
                      {
                        (searchResults.length ? searchResults : sortedSchedules)
                          .length
                      }{" "}
                      schedules
                    </span>
                  </div>

                  <div className="p-5 flex-1 overflow-auto max-h-[calc(100vh-220px)]">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                      {(searchResults.length
                        ? searchResults
                        : sortedSchedules
                      ).map((dep) => {
                        const depDates = dep.dates || [];
                        const currentMonth = new Date().getMonth();
                        const currentYear = new Date().getFullYear();

                        const isCurrentMonth = depDates.some((date) => {
                          const d = new Date(date);
                          return (
                            d.getMonth() === currentMonth &&
                            d.getFullYear() === currentYear
                          );
                        });

                        const isEditingThis = editingId && dep.id === editingId;

                        return (
                          <div
                            key={dep.id}
                            className={`group relative overflow-hidden rounded-xl border transition-all duration-300
          hover:-translate-y-0.5 hover:shadow-lg
          ${
            isEditingThis
              ? "border-amber-400 bg-amber-50"
              : isCurrentMonth
                ? "border-red-300 bg-red-50"
                : "border-gray-200 bg-white"
          }`}
                          >
                            {/* Status Badge */}
                            {isCurrentMonth && (
                              <div className="absolute top-3 right-3">
                                <span
                                  className="inline-flex items-center gap-1 px-2 py-1 rounded-full
                             bg-red-600 text-white text-[10px] font-semibold shadow"
                                >
                                  <Clock className="w-3 h-3" />
                                  ACTIVE
                                </span>
                              </div>
                            )}

                            <div className="p-5 flex flex-col h-full">
                              {/* Header */}
                              <div className="mb-4">
                                <div className="flex items-start gap-3">
                                  <div className="p-2 bg-red-100 rounded-lg">
                                    <Building className="w-4 h-4 text-red-600" />
                                  </div>
                                  <h4 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2">
                                    {dep.department}
                                  </h4>
                                </div>
                              </div>

                              {/* Dates */}
                              <div className="flex-1 mb-4">
                                {depDates.length > 0 ? (
                                  <div className="flex flex-wrap gap-2">
                                    {depDates.map((d, i) => (
                                      <div
                                        key={i}
                                        className="inline-flex items-center gap-1.5
                               bg-white border border-gray-200 rounded-full
                               px-3 py-1.5 text-xs font-medium text-gray-700
                               shadow-sm"
                                      >
                                        <Calendar className="w-3.5 h-3.5 text-red-600" />
                                        {new Date(d).toLocaleDateString(
                                          "en-US",
                                          {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                          },
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="flex items-center justify-center h-20 text-gray-400 text-sm">
                                    No schedules available
                                  </div>
                                )}
                              </div>

                              {/* Actions */}
                              <div className="flex gap-2 pt-3 border-t border-gray-100">
                                <button
                                  onClick={() => handleEdit(dep)}
                                  className="flex-1 inline-flex items-center justify-center gap-1.5
                       px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700
                       text-white text-xs font-semibold transition shadow-sm"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                  Edit
                                </button>

                                <button
                                  onClick={() => handleDelete(dep.id)}
                                  className="flex-1 inline-flex items-center justify-center gap-1.5
                       px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700
                       text-white text-xs font-semibold transition shadow-sm"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Empty State */}
                    {(searchResults.length === 0 && searchValue) ||
                    (searchResults.length === 0 && searchDate) ? (
                      <div className="text-center py-16">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                          <Search className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          No schedules found
                        </h3>
                        <p className="text-gray-500 text-sm">
                          Try adjusting your search criteria
                        </p>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <AppFooter />
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default Schedule;
