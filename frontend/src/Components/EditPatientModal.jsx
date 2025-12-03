import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  UserCircleIcon,
  XMarkIcon,
  HeartIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import PatientComparisonModal from "./PatientComparisonModal";

const commonMedicalConditions = ["DM", "HTN", "CHOL", "IHD", "CA"];
const familyKeyMap = {
  Father: "familyHistoryFather",
  Mother: "familyHistoryMother",
  Siblings: "familyHistorySibling",
};
const familyRelations = ["Father", "Mother", "Siblings"];

const EditPatientModal = ({ patient, isOpen, onClose, onSave }) => {
  const [editedPatient, setEditedPatient] = useState({});

  //calculate BMI
  const calculateBMI = (height, weight) => {
    if (!height || !weight) return "";
    const heightInMeters = height / 100; // Convert cm to meters
    const bmi = weight / (heightInMeters * heightInMeters);
    return bmi ? bmi.toFixed(2) : "";
  };

  useEffect(() => {
    if (editedPatient.height && editedPatient.weight) {
      const newBMI = calculateBMI(editedPatient.height, editedPatient.weight);
      setEditedPatient((prev) => ({ ...prev, bmi: newBMI }));
    }
  }, [editedPatient.height, editedPatient.weight]);

  // Initialize patient info
  useEffect(() => {
    if (patient) {
      setEditedPatient({
        registrationNo: patient.registrationNo || "",
        name: patient.name || "",
        epfNo: patient.epfNo || "",
        contactNo: patient.contactNo || "",
        gender: patient.gender || "",
        dateOfBirth: patient.dateOfBirth || "",
        age: patient.age || "",
        height: patient.height || "",
        weight: patient.weight || "",
        bmi: patient.bmi || "",
        waist: patient.waist || "",
        bp: patient.bp || "",
        rbs: patient.rbs || "",
        fbs: patient.fbs || "",
        visionLeft: patient.visionLeft || "",
        visionRight: patient.visionRight || "",
        breastExamination: patient.breastExamination || "",
        papSmear: patient.papSmear || "",
        alcoholConsumption: patient.alcoholConsumption || "",
        smokingHabits: patient.smokingHabits || "",
        treatmentPlan: patient.treatmentPlan || "",
        smokingCessationAdvice: patient.smokingCessationAdvice || "",
        alcoholAbuseAdvice: patient.alcoholAbuseAdvice || "",

        // Always normalize to arrays
        patientHistory: Array.isArray(patient.patientHistory)
          ? patient.patientHistory
          : patient.patientHistory
          ? [patient.patientHistory]
          : [],

        patientHistoryOther: patient.otherPatientConditions || "",

        familyHistoryFather: Array.isArray(patient.familyHistoryFather)
          ? patient.familyHistoryFather
          : patient.familyHistoryFather
          ? [patient.familyHistoryFather]
          : [],

        familyHistoryFatherOther: patient.otherFatherConditions || "",

        familyHistoryMother: Array.isArray(patient.familyHistoryMother)
          ? patient.familyHistoryMother
          : patient.familyHistoryMother
          ? [patient.familyHistoryMother]
          : [],

        familyHistoryMotherOther: patient.otherMotherConditions || "",

        familyHistorySibling: Array.isArray(patient.familyHistorySibling)
          ? patient.familyHistorySibling
          : patient.familyHistorySibling
          ? [patient.familyHistorySibling]
          : [],

        familyHistorySiblingOther: patient.otherSiblingsConditions || "",
      });
    }
  }, [patient]);

  const [latestRecord, setLatestRecord] = useState({});

  // Fetch latest medical record
  useEffect(() => {
    if (isOpen && (patient?.patient_id || patient?.id)) {
      const patientId = patient.patient_id ?? patient.id;
      console.log("Fetching patientId in modal:", patientId);

      axios
        .get(`http://localhost:5000/patientmedicalrecords/${patientId}/latest`)
        .then((res) => {
          const recordData = res.data?.latestRecord || {};
          setLatestRecord(recordData);
          setEditedPatient((prev) => ({
            ...prev,
            ...recordData,
            patientHistory: Array.isArray(recordData.patientHistory)
              ? recordData.patientHistory
              : recordData.patientHistory
              ? [recordData.patientHistory]
              : [],

            patientHistoryOther: recordData.otherPatientConditions || "",

            familyHistoryFather: Array.isArray(recordData.familyHistoryFather)
              ? recordData.familyHistoryFather
              : recordData.familyHistoryFather
              ? [recordData.familyHistoryFather]
              : [],

            familyHistoryFatherOther: recordData.otherFatherConditions || "",

            familyHistoryMother: Array.isArray(recordData.familyHistoryMother)
              ? recordData.familyHistoryMother
              : recordData.familyHistoryMother
              ? [recordData.familyHistoryMother]
              : [],

            familyHistoryMotherOther: recordData.otherMotherConditions || "",

            familyHistorySibling: Array.isArray(
              recordData.familyHistorySiblings
            )
              ? recordData.familyHistorySiblings
              : recordData.familyHistorySiblings
              ? [recordData.familyHistorySiblings]
              : [],

            familyHistorySiblingOther: recordData.otherSiblingsConditions || "",
          }));
        })
        .catch((err) => {
          console.error(err);
          // Default empty values
          setEditedPatient((prev) => ({
            ...prev,
            patientHistory: "",
            familyHistoryFather: "",
            familyHistoryMother: "",
            familyHistorySibling: "",
          }));
        });
    }
  }, [isOpen, patient]);

  useEffect(() => {
    console.log("Edited Patient:", editedPatient);
    console.log("Patient History:", editedPatient.patientHistory);
    console.log("Father History:", editedPatient.familyHistoryFather);
    console.log("Mother History:", editedPatient.familyHistoryMother);
    console.log("Sibling History:", editedPatient.familyHistorySibling);
  }, [editedPatient]);

  if (!isOpen) return null;

  const handleInputChange = (field, value) => {
    setEditedPatient((prev) => ({ ...prev, [field]: value }));
  };

  // Checkbox Handler
  const handleCheckboxChange = (field, condition) => {
    setEditedPatient((prev) => {
      const current = Array.isArray(prev[field]) ? prev[field] : [];
      const exists = current.includes(condition);
      return {
        ...prev,
        [field]: exists
          ? current.filter((c) => c !== condition)
          : [...current, condition],
      };
    });
  };

  // Save medical record and pass editedPatient to parent

  const handleSave = async () => {
    try {
      const patientId = patient?.patient_id || patient?.id;
      if (!patientId) {
        alert("Patient not found.");
        return;
      }

      // Merge old + new
      const mergedRecord = {
        age: editedPatient.age || null,
        height: editedPatient.height || null,
        weight: editedPatient.weight || null,
        bmi: editedPatient.bmi || null,
        waist: editedPatient.waist || null,
        rbs: editedPatient.rbs || null,
        fbs: editedPatient.fbs || null,
        bp: editedPatient.bp || null,
        visionLeft: editedPatient.visionLeft || null,
        visionRight: editedPatient.visionRight || null,
        breastExamination: editedPatient.breastExamination || "",
        papSmear: editedPatient.papSmear || "",
        alcoholConsumption: editedPatient.alcoholConsumption || "",
        smokingHabits: editedPatient.smokingHabits || "",
        treatmentPlan: editedPatient.treatmentPlan || "",
        smokingCessationAdvice: editedPatient.smokingCessationAdvice || "",
        alcoholAbuseAdvice: editedPatient.alcoholAbuseAdvice || "",
        patientHistory: editedPatient.patientHistory || [],
        familyHistoryFather: editedPatient.familyHistoryFather || [],
        familyHistoryMother: editedPatient.familyHistoryMother || [],
        familyHistorySiblings: editedPatient.familyHistorySibling || [],
        otherPatientConditions: editedPatient.patientHistoryOther || "",
        otherFatherConditions: editedPatient.familyHistoryFatherOther || "",
        otherMotherConditions: editedPatient.familyHistoryMotherOther || "",
        otherSiblingsConditions: editedPatient.familyHistorySiblingOther || "",
        currentProblems: editedPatient.currentProblems || "",
        visitDate: new Date().toISOString().slice(0, 19).replace("T", " "),
      };

      const res = await axios.post(
        `http://localhost:5000/patientmedicalrecords/${patientId}/records`,
        mergedRecord
      );

      if (res.status === 200 || res.status === 201) {
        alert("New medical record appended successfully!");
        onSave && onSave({ ...patient, lastRecord: mergedRecord });
        onClose();
      } else {
        alert("Failed to append medical record.");
      }
    } catch (err) {
      console.error(
        "Error appending medical record:",
        err.response?.data || err.message
      );
      alert("Error appending medical record");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-red-500 text-white p-6 flex justify-between items-center">
          <div className="flex items-center">
            <UserCircleIcon className="w-8 h-8 mr-3" />
            <div>
              <h2 className="text-2xl font-bold">Edit Patient Details</h2>
              <p className="text-red-100 text-sm">
                Editing: {patient?.name || "N/A"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-red-600 rounded-full transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto max-h-[calc(90vh-180px)] p-6 space-y-6">
          {/* Demographics */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h3 className="text-lg font-bold mb-4 flex items-center">
              Edit Demographics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["registrationNo", "name", "epfNo", "contactNo"].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.replace(/([A-Z])/g, " $1").toUpperCase()}
                  </label>
                  <input
                    type="text"
                    value={editedPatient[field] || ""}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <select
                  value={editedPatient.gender || ""}
                  onChange={(e) => handleInputChange("gender", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={
                    editedPatient.dateOfBirth
                      ? editedPatient.dateOfBirth.split("T")[0]
                      : ""
                  }
                  onChange={(e) =>
                    handleInputChange("dateOfBirth", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Age
                </label>
                <input
                  type="text"
                  value={editedPatient.age || ""}
                  onChange={(e) => handleInputChange("age", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>

          {/* Health Metrics */}
          <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
            <h3 className="text-lg font-bold mb-4 flex items-center">
              <HeartIcon className="w-5 h-5 mr-2 text-orange-600" /> Health
              Metrics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {["height", "weight", "bmi", "waist"].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.toUpperCase()}
                  </label>
                  {field === "bmi" ? (
                    <input
                      type="number"
                      step="0.1"
                      value={editedPatient.bmi || ""}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                    />
                  ) : (
                    <input
                      type="number"
                      step={field === "bmi" ? "0.1" : "1"}
                      value={editedPatient[field] || ""}
                      onChange={(e) => handleInputChange(field, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Vital Signs */}
          <div className="bg-pink-50 rounded-lg p-4 border border-pink-200">
            <h3 className="text-lg font-bold mb-4">Vital Signs</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { key: "bp", label: "BP" },
                { key: "rbs", label: "RBS" },
                { key: "fbs", label: "FBS" },
                { key: "visionLeft", label: "Vision Left" },
                { key: "visionRight", label: "Vision Right" },
              ].map(({ key, label }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                  </label>
                  <input
                    type="text"
                    value={editedPatient[key] || ""}
                    onChange={(e) => handleInputChange(key, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Lifestyle */}
          <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
            <h3 className="text-lg font-bold mb-4">Lifestyle</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Breast Examination */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Breast Examination
                </label>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="breastExamDone"
                      name="breastExamination"
                      value="Done"
                      checked={editedPatient.breastExamination === "Done"}
                      onChange={(e) =>
                        handleInputChange("breastExamination", e.target.value)
                      }
                      className="h-4 w-4 text-red-600 border-gray-300 focus:ring-red-500"
                    />
                    <label
                      htmlFor="breastExamDone"
                      className="ml-1 text-sm text-gray-700"
                    >
                      Done
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="breastExamNotDone"
                      name="breastExamination"
                      value="Not Done"
                      checked={editedPatient.breastExamination === "Not Done"}
                      onChange={(e) =>
                        handleInputChange("breastExamination", e.target.value)
                      }
                      className="h-4 w-4 text-red-600 border-gray-300 focus:ring-red-500"
                    />
                    <label
                      htmlFor="breastExamNotDone"
                      className="ml-1 text-sm text-gray-700"
                    >
                      Not Done
                    </label>
                  </div>
                </div>
              </div>

              {/* Pap Smear */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pap Smear
                </label>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="papSmearDone"
                      name="papSmear"
                      value="Done"
                      checked={editedPatient.papSmear === "Done"}
                      onChange={(e) =>
                        handleInputChange("papSmear", e.target.value)
                      }
                      className="h-4 w-4 text-red-600 border-gray-300 focus:ring-red-500"
                    />
                    <label
                      htmlFor="papSmearDone"
                      className="ml-1 text-sm text-gray-700"
                    >
                      Done
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="papSmearNotDone"
                      name="papSmear"
                      value="Not Done"
                      checked={editedPatient.papSmear === "Not Done"}
                      onChange={(e) =>
                        handleInputChange("papSmear", e.target.value)
                      }
                      className="h-4 w-4 text-red-600 border-gray-300 focus:ring-red-500"
                    />
                    <label
                      htmlFor="papSmearNotDone"
                      className="ml-1 text-sm text-gray-700"
                    >
                      Not Done
                    </label>
                  </div>
                </div>
              </div>

              {/* Alcohol Consumption */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alcohol Consumption
                </label>
                <input
                  type="text"
                  value={editedPatient.alcoholConsumption || ""}
                  onChange={(e) =>
                    handleInputChange("alcoholConsumption", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              {/* Smoking Habits */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Smoking Habits
                </label>
                <input
                  type="text"
                  value={editedPatient.smokingHabits || ""}
                  onChange={(e) =>
                    handleInputChange("smokingHabits", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>

          {/* Treatment Plan */}
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <h3 className="text-lg font-bold mb-4">Treatment Plan</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { key: "treatmentPlan", label: "Treatment Plan" },
                {
                  key: "smokingCessationAdvice",
                  label: "Smoking Cessation Advice",
                },
                { key: "alcoholAbuseAdvice", label: "Alcohol Abuse Advice" },
              ].map(({ key, label }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                  </label>
                  <input
                    type="text"
                    value={editedPatient[key] || ""}
                    onChange={(e) => handleInputChange(key, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Medical History */}
          <div className="bg-gray-100 rounded-lg p-4 border border-gray-200">
            <h3 className="text-lg font-bold mb-4">Medical & Family History</h3>
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-300 rounded-lg">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 text-left text-gray-700">Condition</th>
                    <th className="p-2 text-center text-gray-700">Patient</th>
                    {familyRelations.map((rel) => (
                      <th key={rel} className="p-2 text-center text-gray-700">
                        {rel}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {commonMedicalConditions.map((cond) => (
                    <tr key={cond} className="border-t">
                      <td className="p-2 text-gray-700">{cond}</td>

                      {/* Patient column */}
                      <td className="p-2 text-center">
                        <input
                          type="checkbox"
                          name="patientHistory"
                          value={cond}
                          checked={editedPatient.patientHistory?.includes(cond)}
                          onChange={() =>
                            handleCheckboxChange("patientHistory", cond)
                          }
                          className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                      </td>

                      {/* Family columns */}
                      {familyRelations.map((rel) => {
                        const key = familyKeyMap[rel];
                        return (
                          <td key={rel} className="p-2 text-center">
                            <input
                              type="checkbox"
                              name={key}
                              value={cond}
                              checked={editedPatient[key]?.includes(cond)}
                              onChange={(e) => handleCheckboxChange(key, cond)}
                              className="h-4 w-4 text-yellow-500 border-gray-300 rounded focus:ring-yellow-400"
                            />
                          </td>
                        );
                      })}
                    </tr>
                  ))}

                  {/* Other Text Field Row */}
                  <tr className="border-t bg-gray-50">
                    <td className="p-2 font-medium text-gray-700">
                      Other (specify)
                    </td>

                    {/* Patient Other */}
                    <td className="p-2">
                      <input
                        type="text"
                        value={editedPatient.patientHistoryOther || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "patientHistoryOther",
                            e.target.value
                          )
                        }
                        placeholder="Other..."
                        className="w-full px-2 py-1 border border-gray-300 rounded-md"
                      />
                    </td>

                    {/* Family Others */}
                    {familyRelations.map((rel) => {
                      const key = familyKeyMap[rel];
                      return (
                        <td key={rel} className="p-2">
                          <input
                            type="text"
                            value={editedPatient[`${key}Other`] || ""}
                            onChange={(e) =>
                              handleInputChange(`${key}Other`, e.target.value)
                            }
                            placeholder="Other..."
                            className="w-full px-2 py-1 border border-gray-300 rounded-md"
                          />
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-t">
          <div className="text-sm text-gray-500">
            * Changes will be saved when you click Save
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-gradient-to-r from-red-500 to-red-500 text-white rounded-lg hover:from-red-600 hover:to-red-600 transition-colors flex items-center font-medium shadow-lg"
            >
              <CheckIcon className="w-4 h-4 mr-2" />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPatientModal;
