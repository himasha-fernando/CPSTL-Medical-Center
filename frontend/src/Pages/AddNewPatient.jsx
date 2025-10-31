import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {
  UserCircleIcon,
  ScaleIcon,
  HeartIcon,
  EyeIcon,
  SunIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  ClipboardDocumentListIcon,
  BeakerIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { CheckIcon } from "@heroicons/react/24/solid";
import AppSidebar from "../Components/AppSidebar";
import AppHeader from "../Components/AppHeader";
import AppFooter from "../Components/AppFooter";

// Step configuration
const STEPS = [
  { label: "Demographics", icon: UserCircleIcon },
  { label: "Health Metrics", icon: HeartIcon },
  { label: "Medical History", icon: ClipboardDocumentListIcon },
  { label: "Lifestyle", icon: SunIcon },
  { label: "Problems", icon: ExclamationCircleIcon },
  { label: "Screening Tests", icon: BeakerIcon },
  { label: "Treatment", icon: CheckCircleIcon },
];

// Common current problem options (checkboxes)
const CURRENT_PROBLEM_OPTIONS = [
  "Increased body weight",
  "Blood sugar issues",
  "Blood pressure issues",
  "Poor vision",
];

// CoreUI-style Stepper Component with Red Theme
const CStepper = ({
  steps,
  activeStep,
  orientation = "horizontal",
  onStepClick,
}) => {
  const isVertical = orientation === "vertical";

  return (
    <div
      className={`stepper-wrapper ${
        isVertical ? "stepper-vertical" : "stepper-horizontal"
      }`}
    >
      <div
        className={`${
          isVertical
            ? "flex flex-col"
            : "flex items-center justify-between w-full relative"
        }`}
      >
        {!isVertical && (
          <div className="absolute left-0 right-0 top-6 h-0.5 bg-gray-200 -z-10">
            <div
              className="h-full bg-gradient-to-r from-red-500 to-red-600 transition-all duration-500"
              style={{
                width: `${((activeStep - 1) / (steps.length - 1)) * 100}%`,
              }}
            />
          </div>
        )}

        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === activeStep;
          const isCompleted = stepNumber < activeStep;
          const isClickable = isCompleted;
          const Icon = step.icon;

          return (
            <div
              key={index}
              className={`${
                isVertical
                  ? "flex items-start mb-8 last:mb-0"
                  : "flex flex-col items-center"
              } ${isClickable ? "cursor-pointer" : ""}`}
              onClick={() =>
                isClickable && onStepClick && onStepClick(stepNumber)
              }
            >
              {isVertical && (
                <div className="flex flex-col items-center mr-4">
                  <div
                    className={`
                    w-12 h-12 rounded-full flex items-center justify-center font-semibold
                    transition-all duration-300 relative
                    ${
                      isActive
                        ? "bg-red-500 text-white shadow-lg ring-4 ring-red-100"
                        : ""
                    }
                    ${
                      isCompleted
                        ? "bg-green-500 text-white hover:bg-green-600"
                        : ""
                    }
                    ${
                      !isActive && !isCompleted
                        ? "bg-gray-200 text-gray-500"
                        : ""
                    }
                  `}
                  >
                    {isCompleted ? (
                      <CheckIcon className="w-6 h-6" />
                    ) : (
                      <>
                        <Icon className="w-6 h-6" />
                        {isActive && (
                          <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                          </span>
                        )}
                      </>
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-0.5 h-16 mt-2 transition-all duration-300 ${
                        isCompleted
                          ? "bg-green-500"
                          : isActive
                          ? "bg-red-500"
                          : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              )}

              {!isVertical && (
                <div
                  className={`
                  w-12 h-12 rounded-full flex items-center justify-center font-semibold
                  transition-all duration-300 relative z-10
                  ${
                    isActive
                      ? "bg-red-500 text-white shadow-lg ring-4 ring-red-100"
                      : ""
                  }
                  ${
                    isCompleted
                      ? "bg-green-500 text-white hover:bg-green-600"
                      : ""
                  }
                  ${
                    !isActive && !isCompleted ? "bg-gray-200 text-gray-500" : ""
                  }
                `}
                >
                  {isCompleted ? (
                    <CheckIcon className="w-6 h-6" />
                  ) : (
                    <>
                      <Icon className="w-6 h-6" />
                      {isActive && (
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                        </span>
                      )}
                    </>
                  )}
                </div>
              )}

              <div className={`${isVertical ? "flex-1" : "mt-3 text-center"}`}>
                <div
                  className={`
                  ${isVertical ? "text-left" : "text-xs"}
                  ${isActive ? "font-semibold text-red-600" : ""}
                  ${isCompleted ? "text-green-600" : ""}
                  ${!isActive && !isCompleted ? "text-gray-500" : ""}
                `}
                >
                  <div
                    className={`${
                      isVertical ? "text-sm font-medium" : "hidden sm:block"
                    }`}
                  >
                    Step {stepNumber}
                  </div>
                  <div
                    className={`${
                      isVertical ? "text-base mt-1" : "text-xs mt-1"
                    } ${!isVertical ? "w-20" : ""}`}
                  >
                    {step.label}
                  </div>
                  {isVertical && isActive && (
                    <div className="text-xs text-red-500 mt-1">
                      Currently in progress
                    </div>
                  )}
                  {isVertical && isCompleted && (
                    <div className="text-xs text-green-500 mt-1">Completed</div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Alternative Card-based Stepper with Red Theme
const CardStepper = ({ steps, activeStep, onStepClick }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === activeStep;
        const isCompleted = stepNumber < activeStep;
        const isClickable = isCompleted;
        const Icon = step.icon;

        return (
          <div
            key={index}
            onClick={() =>
              isClickable && onStepClick && onStepClick(stepNumber)
            }
            className={`
              relative p-3 rounded-lg border-2 transition-all duration-300
              ${isClickable ? "cursor-pointer" : ""}
              ${
                isActive
                  ? "border-red-500 bg-red-50 shadow-md transform scale-105"
                  : ""
              }
              ${
                isCompleted
                  ? "border-green-500 bg-green-50 hover:bg-green-100"
                  : ""
              }
              ${!isActive && !isCompleted ? "border-gray-200 bg-white" : ""}
            `}
          >
            <div className="flex flex-col items-center">
              <div
                className={`
                w-10 h-10 rounded-full flex items-center justify-center mb-2
                ${isActive ? "bg-red-500 text-white" : ""}
                ${isCompleted ? "bg-green-500 text-white" : ""}
                ${!isActive && !isCompleted ? "bg-gray-200 text-gray-500" : ""}
              `}
              >
                {isCompleted ? (
                  <CheckIcon className="w-5 h-5" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </div>
              <span
                className={`text-xs font-medium text-center ${
                  isActive
                    ? "text-red-700"
                    : isCompleted
                    ? "text-green-700"
                    : "text-gray-600"
                }`}
              >
                {step.label}
              </span>
              {isActive && (
                <span className="absolute top-1 right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Section header component with red icon
const SectionHeader = ({ icon, title }) => {
  const IconComponent = icon;
  return (
    <div className="flex items-center mb-3 pb-2 border-b border-red-200">
      <IconComponent className="w-5 h-5 mr-2 text-red-500" />
      <h2 className="text-base font-semibold text-gray-800">{title}</h2>
    </div>
  );
};

// Progress Indicator Component with Red Theme
const ProgressIndicator = ({ currentStep, totalSteps }) => {
  const percentage = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">
          Overall Progress
        </span>
        <span className="text-sm font-medium text-red-600">
          {Math.round(percentage)}% Complete
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-gradient-to-r from-red-500 to-red-600 h-2 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

// Helper to build currentProblems string from entries
const makeCurrentProblemsString = (entries = []) => {
  const parts = entries
    .map((e) => {
      const items =
        Array.isArray(e.selected) && e.selected.length
          ? e.selected.join(", ")
          : "";
      const details = e.details && e.details.trim() ? e.details.trim() : "";
      if (!items && !details) return "";
      return `• ${[items, details ? `— ${details}` : ""].join(" ").trim()}`;
    })
    .filter(Boolean);
  return parts.join("\n");
};

// The main page component for adding a new patient
function AddNewPatient() {
  const location = useLocation();
  const passedPatient = location.state?.patient || {};
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [stepperLayout] = useState("horizontal");
  const [formData, setFormData] = useState({
    registrationNo: passedPatient.registrationNo || "",
    name: passedPatient.name || "",
    epfNo: passedPatient.epfNo || "",
    contactNo: passedPatient.contactNo || "",
    gender: passedPatient.gender || "",
    dateOfBirth: passedPatient.dateOfBirth || "",
    age: "",
    height: "",
    weight: "",
    bmi: "",
    waist: "",
    rbs: "",
    fbs: "",
    bp: "",
    visionLeft: "",
    visionRight: "",
    patientHistory: [],
    otherPatientConditions: "",
    familyHistoryFather: [],
    otherFatherConditions: "",
    familyHistoryMother: [],
    otherMotherConditions: "",
    familyHistorySiblings: [],
    otherSiblingsConditions: "",
    alcoholConsumption: "",
    smokingHabits: "",
    currentProblems: "",
    currentProblemsEntries: [
      {
        selected: [],
        details: "",
        customOptions: [],
        addingCustom: false,
        newCustomLabel: "",
      },
    ],
    breastExamination: "Not Done",
    papSmear: "Not Done",
    treatmentPlan: "",
    smokingCessationAdvice: "",
    alcoholAbuseAdvice: "",
  });
  const [errors, setErrors] = useState({});


  const handleCancel = () => {
    setFormData(initialFormData); // Reset to defaults
    setErrors({});
    setCurrentStep(1); // return to step 1
  };
  //calculate age
  const calculateAge = (dob) => {
    if (!dob) return 0;
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age >= 0 ? age : 0;
  };

  // Auto-calculate BMI when height or weight changes
  useEffect(() => {
    if (formData.height && formData.weight) {
      const heightInMeters = parseFloat(formData.height) / 100;
      const weight = parseFloat(formData.weight);
      if (heightInMeters > 0 && weight > 0) {
        const calculatedBMI = (
          weight /
          (heightInMeters * heightInMeters)
        ).toFixed(1);
        setFormData((prev) => ({ ...prev, bmi: calculatedBMI }));
      }
    } else {
      setFormData((prev) => ({ ...prev, bmi: "" }));
    }
  }, [formData.height, formData.weight]);

  //handle checkbox change

  const handleChange = (e, key = null) => {
    const { name, value, checked, type } = e.target;

    setFormData((prevData) => {
      let updatedData = { ...prevData };

      if (type === "checkbox") {
        const targetKey = key || name;
        const currentValues = prevData[targetKey] || [];
        updatedData[targetKey] = checked
          ? [...currentValues, value]
          : currentValues.filter((item) => item !== value);
      } else if (name === "dateOfBirth") {
        // Automatically calculate age when user selects a date
        updatedData.dateOfBirth = value;
        updatedData.age = calculateAge(value);
      } else {
        updatedData[name] = value;
      }

      return updatedData;
    });

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Automatically calculate age when DOB is fetched from database
  useEffect(() => {
    if (formData.dateOfBirth) {
      setFormData((prev) => ({
        ...prev,
        age: calculateAge(prev.dateOfBirth),
      }));
    }
  }, [formData.dateOfBirth]);

<<<<<<< HEAD
=======
  // Handle field changes and auto-update dependent fields
  const handleChange = (e, key = null) => {
    const { name, value, checked, type } = e.target;
  
    setFormData((prevData) => {
      let updatedData = { ...prevData };
  
      // Checkbox handler
      if (type === "checkbox") {
        const targetKey = key || name;
        const currentValues = prevData[targetKey] || [];
        updatedData[targetKey] = checked
          ? [...currentValues, value]
          : currentValues.filter((item) => item !== value);
      } 
      // Date of Birth → Auto-calculate age
      else if (name === "dateOfBirth") {
        updatedData.dateOfBirth = value;
        updatedData.age = calculateAge(value);
      } 
      // Weight or Height → Auto-calculate BMI + BMI Category
      else if (name === "weight" || name === "height") {
        updatedData[name] = value;
      
        const height = parseFloat(
          name === "height" ? value : prevData.height
        );
        const weight = parseFloat(
          name === "weight" ? value : prevData.weight
        );
      
        if (height > 0 && weight > 0) {
          const heightInMeters = height / 100;
          const bmiValue = weight / (heightInMeters * heightInMeters);
          const bmi = bmiValue.toFixed(1);
      
          let bmiCategory = "";
          if (bmiValue < 18.5) bmiCategory = "Underweight";
          else if (bmiValue < 25) bmiCategory = "Normal";
          else if (bmiValue < 30) bmiCategory = "Overweight";
          else if (bmiValue < 35) bmiCategory = "Obesity Class I";
          else if (bmiValue < 40) bmiCategory = "Obesity Class II";
          else bmiCategory = "Obesity Class III";
      
          updatedData.bmi = bmi;
          updatedData.bmiCategory = bmiCategory;
        } else {
          updatedData.bmi = "";
          updatedData.bmiCategory = "";
        }
      }

        // Vision Fields 
    else if (name === "visionLeft" || name === "visionRight") {
      updatedData[name] = value;
      updatedData.visionCategory = getVisionCategory(
        name === "visionRight" ? value : updatedData.visionRight,
        name === "visionLeft" ? value : updatedData.visionLeft
      );
    }


       
      // Default field update
      else {
        updatedData[name] = value;
      }
  
      return updatedData;
    });
  
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };



  const CURRENT_PROBLEM_OPTIONS = [
    "Underweight",
    "Normal BMI",
    "Overweight",
    "Obesity Class 1",
    "Obesity Class 2",
    "Obesity Class 3",
    
  ];
  


>>>>>>> eeb9958 (Implement Definitions)
  //Reusable checkbox handler
  const handleCheckboxChange = (e, key) => handleChange(e, key);

  // Step 5 helpers
  const syncCurrentProblemsString = (entries) => {
    return makeCurrentProblemsString(entries);
  };

  const handleRemoveProblemSection = (index) => {
    setFormData((prev) => {
      const entries = [...(prev.currentProblemsEntries || [])];
      if (entries.length > 1) {
        entries.splice(index, 1);
      } else {
        entries[0] = {
          selected: [],
          details: "",
          customOptions: [],
          addingCustom: false,
          newCustomLabel: "",
        };
      }
      return {
        ...prev,
        currentProblemsEntries: entries,
        currentProblems: syncCurrentProblemsString(entries),
      };
    });
  };

  const handleToggleProblem = (index, option) => {
    setFormData((prev) => {
      const entries = [...(prev.currentProblemsEntries || [])];
      const entry = {
        ...(entries[index] || { selected: [], details: "", customOptions: [] }),
      };
      const selected = new Set(entry.selected || []);
      if (selected.has(option)) selected.delete(option);
      else selected.add(option);
      entry.selected = Array.from(selected);
      entries[index] = entry;
      return {
        ...prev,
        currentProblemsEntries: entries,
        currentProblems: syncCurrentProblemsString(entries),
      };
    });
    if (errors.currentProblems)
      setErrors((prev) => ({ ...prev, currentProblems: "" }));
  };

  const handleEntryDetailsChange = (index, value) => {
    setFormData((prev) => {
      const entries = [...(prev.currentProblemsEntries || [])];
      const entry = { ...(entries[index] || {}) };
      entry.details = value;
      entries[index] = entry;
      return {
        ...prev,
        currentProblemsEntries: entries,
        currentProblems: syncCurrentProblemsString(entries),
      };
    });
    if (errors.currentProblems)
      setErrors((prev) => ({ ...prev, currentProblems: "" }));
  };

  const handleStartAddCustomOption = (index) => {
    setFormData((prev) => {
      const entries = [...prev.currentProblemsEntries];
      const entry = { ...entries[index] };
      entry.addingCustom = true;
      entry.newCustomLabel = "";
      entries[index] = entry;
      return { ...prev, currentProblemsEntries: entries };
    });
  };

  const handleCancelAddCustomOption = (index) => {
    setFormData((prev) => {
      const entries = [...prev.currentProblemsEntries];
      const entry = { ...entries[index] };
      entry.addingCustom = false;
      entry.newCustomLabel = "";
      entries[index] = entry;
      return { ...prev, currentProblemsEntries: entries };
    });
  };

  const handleCustomOptionInputChange = (index, value) => {
    setFormData((prev) => {
      const entries = [...prev.currentProblemsEntries];
      const entry = { ...entries[index] };
      entry.newCustomLabel = value;
      entries[index] = entry;
      return { ...prev, currentProblemsEntries: entries };
    });
  };

  const handleConfirmAddCustomOption = (index) => {
    setFormData((prev) => {
      const entries = [...prev.currentProblemsEntries];
      const entry = { ...entries[index] };
      const label = (entry.newCustomLabel || "").trim();
      if (!label) return prev;
      const customOptions = Array.isArray(entry.customOptions)
        ? [...entry.customOptions]
        : [];
      if (
        !customOptions.includes(label) &&
        !CURRENT_PROBLEM_OPTIONS.includes(label)
      ) {
        customOptions.push(label);
      }
      entry.customOptions = customOptions;
      entry.addingCustom = false;
      entry.newCustomLabel = "";
      entries[index] = entry;
      return { ...prev, currentProblemsEntries: entries };
    });
  };

  // Step validation
  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.name) newErrors.name = "Patient Name is required.";
      if (!formData.registrationNo)
        newErrors.registrationNo = "Registration No. is required.";
      if (!formData.epfNo) newErrors.epfNo = "EPF No. is required.";
      if (!formData.contactNo) newErrors.contactNo = "Contact No. is required.";
      if (!formData.gender) newErrors.gender = "Gender is required.";
      if (!formData.dateOfBirth)
        newErrors.dateOfBirth = "Date of Birth is required.";
      if (!formData.age) newErrors.age = "Age is required.";
    }

    if (step === 2) {
      if (!formData.height) newErrors.height = "Height is required.";
      if (!formData.weight) newErrors.weight = "Weight is required.";
      if (!formData.bmi) newErrors.bmi = "BMI is required.";
      if (!formData.waist) newErrors.waist = "Waist measurement is required.";
    }

    if (step === 5) {
      const entries = formData.currentProblemsEntries || [];
      const anyInfo = entries.some(
        (e) =>
          (Array.isArray(e.selected) && e.selected.length > 0) ||
          (e.details && e.details.trim())
      );
      if (!anyInfo) {
        newErrors.currentProblems =
          "Please select at least one problem or enter additional details.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < STEPS.length) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors({});
    }
  };

  const handleStepClick = (stepNumber) => {
    if (stepNumber < currentStep) {
      setCurrentStep(stepNumber);
      setErrors({});
    }
  };

  //Handle both database submission with proper ID extraction
  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    try {
      // Extract basic info for patients table
      const basicInfo = {
        registrationNo: formData.registrationNo,
        name: formData.name,
        epfNo: formData.epfNo,
        contactNo: formData.contactNo,
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth,
      };

      console.log("Checking if patient exists:", basicInfo);

      let patientId;
      let isNewPatient = false;
      // Check if patient already exists
      const checkResponse = await axios.get(
        `http://localhost:5000/patients/check?registrationNo=${formData.registrationNo}`
      );

      if (checkResponse.data.exists) {
        // Patient exists → use existing ID
        patientId = checkResponse.data.patientId;
        console.log("Patient already exists. Using ID:", patientId);
      } else {
        // Patient does not exist → add new patient
        const patientResponse = await axios.post(
          "http://localhost:5000/patients/add",
          basicInfo
        );
        patientId = patientResponse.data.patientId;
        isNewPatient = true;
        console.log("New patient added. ID:", patientId);
      }

      // Prepare medical info
      const medicalInfo = {
        patient_id: patientId,
        visitDate: new Date().toISOString().slice(0, 19).replace("T", " "),
        age: formData.age,
        height: formData.height,
        weight: formData.weight,
        bmi: formData.bmi,
        waist: formData.waist,
        rbs: formData.rbs || null,
        fbs: formData.fbs || null,
        bp: formData.bp || null,
        visionLeft: formData.visionLeft || null,
        visionRight: formData.visionRight || null,
        breastExamination: formData.breastExamination,
        papSmear: formData.papSmear,
        alcoholConsumption: formData.alcoholConsumption || null,
        smokingHabits: formData.smokingHabits || null,
        treatmentPlan: formData.treatmentPlan || null,
        smokingCessationAdvice: formData.smokingCessationAdvice || null,
        alcoholAbuseAdvice: formData.alcoholAbuseAdvice || null,
        patientHistory: formData.patientHistory || [],
        familyHistoryFather: formData.familyHistoryFather || [],
        familyHistoryMother: formData.familyHistoryMother || [],
        familyHistorySiblings: formData.familyHistorySiblings || [],
        otherPatientConditions: formData.otherPatientConditions || null,
        otherFatherConditions: formData.otherFatherConditions || null,
        otherMotherConditions: formData.otherMotherConditions || null,
        otherSiblingsConditions: formData.otherSiblingsConditions || null,
        currentProblems: formData.currentProblems || null,
      };

      console.log("Sending medical info:", medicalInfo);

      // POST medical info
      await axios.post(
        `http://localhost:5000/patientmedicalrecords/${patientId}/records`,
        medicalInfo
      );

      // Prepare patient object for ManagePatients
      const newPatientObj = {
        ...basicInfo,
        id: patientId,
        isNew: isNewPatient,
      };
      // Success navigation
      navigate("/ManagePatients", {
        state: {
          message: `Patient ${formData.name} and medical records saved successfully!`,
          type: "success",
          patient: newPatientObj,
        },
      });

      // Clear form
      setFormData({
        registrationNo: "",
        name: "",
        epfNo: "",
        contactNo: "",
        gender: "",
        dateOfBirth: "",
        age: "",
        height: "",
        weight: "",
        bmi: "",
        waist: "",
        rbs: "",
        fbs: "",
        bp: "",
        visionLeft: "",
        visionRight: "",
        patientHistory: [],
        familyHistoryFather: [],
        familyHistoryMother: [],
        familyHistorySiblings: [],
        otherPatientConditions: "",
        otherFatherConditions: "",
        otherMotherConditions: "",
        otherSiblingsConditions: "",
        alcoholConsumption: "",
        smokingHabits: "",
        currentProblems: "",
        currentProblemsEntries: [
          {
            selected: [],
            details: "",
            customOptions: [],
            addingCustom: false,
            newCustomLabel: "",
          },
        ],
        breastExamination: "Not Done",
        papSmear: "Not Done",
        treatmentPlan: "",
        smokingCessationAdvice: "",
        alcoholAbuseAdvice: "",
      });
    } catch (error) {
      console.error("Error saving patient data:", error);
      console.error("Error details:", error.response?.data);

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to save patient and medical data. Please try again.";

      navigate("/ManagePatients", {
        state: {
          message: errorMessage,
          type: "error",
        },
      });
    }
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const handleView = async (patient) => {
    try {
      // If this patient is just added, don't fetch latest medical record
      if (patient.isNew) {
        console.log("New patient, skipping latest medical record fetch.");
        setMedicalRecord(null); // or empty object
        return;
      }

      // Otherwise, fetch latest medical record
      const { data } = await axios.get(
        `http://localhost:5000/patientmedicalrecords/${patient.id}/latest`
      );
      setMedicalRecord(data);
    } catch (error) {
      console.error("No medical record or failed to fetch:", error);
      setMedicalRecord(null);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

<<<<<<< HEAD
=======
  const getWaistCategory = (waist, gender) => {
    if (!waist || !gender) return "";
  
    if (gender === "Male") {
      return waist >= 90 ? "Abdominal Obesity" : "Normal";
    } else if (gender === "Female") {
      return waist >= 80 ? "Abdominal Obesity" : "Normal";
    }
    return "";
  };

  //Determine Vision Category based on both eyes
const getVisionCategory = (rightEye, leftEye) => {
  if (!rightEye || !leftEye) return "";

  const normalCombinations = [
    ["6/6", "6/6"],
    ["6/12", "6/12"],
    ["6/6", "6/18"],
    ["6/18", "6/6"],
  ];

  const isNormal = normalCombinations.some(
    ([r, l]) =>
      r.trim().toLowerCase() === rightEye.trim().toLowerCase() &&
      l.trim().toLowerCase() === leftEye.trim().toLowerCase()
  );

  return isNormal ? "Normal" : "Poor Vision";
};


const getDiabetesCategory = (rbsValue) => {
  const value = parseFloat(rbsValue);
  if (isNaN(value)) return "";

  if (value < 140) return "Normal";
  if (value >= 141 && value <= 199) return "Prediabetes";
  if (value >= 200) return "Diabetes";

  return "";
};



const getHypertensionCategory = (systolic, diastolic) => {
  if (!systolic || !diastolic) return "";

  const s = parseFloat(systolic);
  const d = parseFloat(diastolic);

  if (s < 130 && d < 85) return "Normal";
  if ((s >= 130 && s <= 139) || (d >= 85 && d <= 89)) return "High Normal BP";
  if ((s >= 140 && s <= 159) || (d >= 90 && d <= 99)) return "Grade 1 Hypertension";
  if (s >= 160 || d >= 100) return "Grade 2 Hypertension";
  if (s >= 140 && d < 90) return "Isolated Systolic Hypertension";

  return "";
};



>>>>>>> eeb9958 (Implement Definitions)
  const commonMedicalConditions = ["DM", "HTN", "CHOL", "IHD", "CA"];

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <AppSidebar
        isSidebarOpen={isSidebarOpen}
        onCloseSidebar={closeSidebar}
        currentPage="Add New Patient"
      />

      <main className="flex-1 flex flex-col overflow-hidden">
        <AppHeader onMenuToggle={toggleSidebar} isSidebarOpen={isSidebarOpen} />

        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="bg-white rounded-lg shadow-md p-4 lg:p-6 border-l-4 border-red-500">
            <ProgressIndicator
              currentStep={currentStep}
              totalSteps={STEPS.length}
            />

            <div className="mb-8">
              {stepperLayout === "horizontal" && (
                <div className="hidden md:block">
                  <CStepper
                    steps={STEPS}
                    activeStep={currentStep}
                    orientation="horizontal"
                    onStepClick={handleStepClick}
                  />
                </div>
              )}
              {stepperLayout === "vertical" && (
                <CStepper
                  steps={STEPS}
                  activeStep={currentStep}
                  orientation="vertical"
                  onStepClick={handleStepClick}
                />
              )}
              {stepperLayout === "cards" && (
                <CardStepper
                  steps={STEPS}
                  activeStep={currentStep}
                  onStepClick={handleStepClick}
                />
              )}

              {stepperLayout === "horizontal" && (
                <div className="md:hidden">
                  <CStepper
                    steps={STEPS}
                    activeStep={currentStep}
                    orientation="vertical"
                    onStepClick={handleStepClick}
                  />
                </div>
              )}
            </div>

            {/* Form Steps Content  */}
            <form
              onSubmit={(e) => {
                e.preventDefault(); // Always prevent default first
                if (currentStep === STEPS.length) {
                  handleSubmit(e); // only submit on final step
                }
              }}
            >
              <div className="mt-8">
                {/* Step 1: Patient Demographics */}
                {currentStep === 1 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    <h1 className="text-xl font-semibold text-gray-800 md:col-span-2 flex items-center bg-red-50 p-3 rounded-lg border border-red-200">
                      <UserCircleIcon className="w-6 h-6 mr-2 text-red-500" />
                      Patient Demographics
                    </h1>
                    <div>
                      <label
                        htmlFor="registrationNo"
                        className="block text-xs font-medium text-gray-700"
                      >
                        Registration No. <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="registrationNo"
                        name="registrationNo"
                        value={formData.registrationNo}
                        onChange={handleChange}
                        className={`mt-1 block w-full border rounded-md shadow-sm p-1 focus:ring-2 focus:ring-red-500 ${
                          errors.registrationNo
                            ? "border-red-500 bg-red-50"
                            : "border-gray-300"
                        }`}
                      />
                      {errors.registrationNo && (
                        <p className="mt-1 text-xs text-red-500 flex items-center">
                          <ExclamationCircleIcon className="w-3 h-3 mr-1" />
                          {errors.registrationNo}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-xs font-medium text-gray-700"
                      >
                        Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className={`mt-1 block w-full border rounded-md shadow-sm p-1 focus:ring-2 focus:ring-red-500 ${
                          errors.name
                            ? "border-red-500 bg-red-50"
                            : "border-gray-300"
                        }`}
                      />
                      {errors.name && (
                        <p className="mt-1 text-xs text-red-500 flex items-center">
                          <ExclamationCircleIcon className="w-3 h-3 mr-1" />
                          {errors.name}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="epfNo"
                        className="block text-xs font-medium text-gray-700"
                      >
                        EPF No. <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="epfNo"
                        name="epfNo"
                        value={formData.epfNo}
                        onChange={(e) =>
                          setFormData({ ...formData, epfNo: e.target.value })
                        }
                        className={`mt-1 block w-full border rounded-md shadow-sm p-1 focus:ring-2 focus:ring-red-500 ${
                          errors.epfNo
                            ? "border-red-500 bg-red-50"
                            : "border-gray-300"
                        }`}
                      />
                      {errors.epfNo && (
                        <p className="mt-1 text-xs text-red-500 flex items-center">
                          <ExclamationCircleIcon className="w-3 h-3 mr-1" />
                          {errors.epfNo}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="contactNo"
                        className="block text-xs font-medium text-gray-700"
                      >
                        Contact No. <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        id="contactNo"
                        name="contactNo"
                        value={formData.contactNo}
                        onChange={handleChange}
                        className={`mt-1 block w-full border rounded-md shadow-sm p-1 focus:ring-2 focus:ring-red-500 ${
                          errors.contactNo
                            ? "border-red-500 bg-red-50"
                            : "border-gray-300"
                        }`}
                      />
                      {errors.contactNo && (
                        <p className="mt-1 text-xs text-red-500 flex items-center">
                          <ExclamationCircleIcon className="w-3 h-3 mr-1" />
                          {errors.contactNo}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="dateOfBirth"
                        className="block text-xs font-medium text-gray-700"
                      >
                        Date of Birth <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        id="dateOfBirth"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        className={`mt-1 block w-full border rounded-md shadow-sm p-1 focus:ring-2 focus:ring-red-500 ${
                          errors.dateOfBirth
                            ? "border-red-500 bg-red-50"
                            : "border-gray-300"
                        }`}
                      />
                      {errors.dateOfBirth && (
                        <p className="mt-1 text-xs text-red-500 flex items-center">
                          <ExclamationCircleIcon className="w-3 h-3 mr-1" />
                          {errors.dateOfBirth}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="age"
                        className="block text-xs font-medium text-gray-700"
                      >
                        Age <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        id="age"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        className={`mt-1 block w-full border rounded-md shadow-sm p-1 focus:ring-2 focus:ring-red-500 ${
                          errors.age
                            ? "border-red-500 bg-red-50"
                            : "border-gray-300"
                        }`}
                      />
                      {errors.age && (
                        <p className="mt-1 text-xs text-red-500 flex items-center">
                          <ExclamationCircleIcon className="w-3 h-3 mr-1" />
                          {errors.age}
                        </p>
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-gray-700">
                        Gender <span className="text-red-500">*</span>
                      </label>
                      <div
                        className={`mt-2 flex items-center space-x-4 p-2 rounded-md ${
                          errors.gender
                            ? "border border-red-500 bg-red-50"
                            : "bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="female"
                            name="gender"
                            value="Female"
                            checked={formData.gender === "Female"}
                            onChange={handleChange}
                            className="h-3 w-3 text-red-600 border-gray-300 focus:ring-red-500"
                          />
                          <label
                            htmlFor="female"
                            className="ml-1 text-xs text-gray-700"
                          >
                            Female
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="male"
                            name="gender"
                            value="Male"
                            checked={formData.gender === "Male"}
                            onChange={handleChange}
                            className="h-3 w-3 text-red-600 border-gray-300 focus:ring-red-500"
                          />
                          <label
                            htmlFor="male"
                            className="ml-1 text-xs text-gray-700"
                          >
                            Male
                          </label>
                        </div>
                      </div>
                      {errors.gender && (
                        <p className="mt-1 text-xs text-red-500 flex items-center">
                          <ExclamationCircleIcon className="w-3 h-3 mr-1" />
                          {errors.gender}
                        </p>
                      )}
                      
                    </div>
                  </div>
                )}

                {/* Step 2: Combined Health Metrics */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <h1 className="text-xl font-semibold text-gray-800 flex items-center bg-red-50 p-3 rounded-lg border border-red-200">
                      <HeartIcon className="w-6 h-6 mr-2 text-red-500" />
                      Health Metrics
                    </h1>

                    {/* Physical Measurements Section */}
                    <div>
                      <SectionHeader
                        icon={ScaleIcon}
                        title="Physical Measurements"
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                        <div>
                          <label
                            htmlFor="height"
                            className="block text-xs font-medium text-gray-700"
                          >
                            Height (cm) <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            id="height"
                            name="height"
                            value={formData.height}
                            onChange={handleChange}
                            className={`mt-1 block w-full border rounded-md shadow-sm p-1 focus:ring-2 focus:ring-red-500 ${
                              errors.height
                                ? "border-red-500 bg-red-50"
                                : "border-gray-300"
                            }`}
                          />
                          {errors.height && (
                            <p className="mt-1 text-xs text-red-500 flex items-center">
                              <ExclamationCircleIcon className="w-3 h-3 mr-1" />
                              {errors.height}
                            </p>
                          )}
                        </div>
                        <div>
                          <label
                            htmlFor="weight"
                            className="block text-xs font-medium text-gray-700"
                          >
                            Weight (kg) <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            id="weight"
                            name="weight"
                            value={formData.weight}
                            onChange={handleChange}
                            className={`mt-1 block w-full border rounded-md shadow-sm p-1 focus:ring-2 focus:ring-red-500 ${
                              errors.weight
                                ? "border-red-500 bg-red-50"
                                : "border-gray-300"
                            }`}
                          />
                          {errors.weight && (
                            <p className="mt-1 text-xs text-red-500 flex items-center">
                              <ExclamationCircleIcon className="w-3 h-3 mr-1" />
                              {errors.weight}
                            </p>
                          )}
                        </div>

                        <div>
                          <label
                            htmlFor="bmi"
                            className="block text-xs font-medium text-gray-700"
                          >
                            BMI <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            id="bmi"
                            name="bmi"
                            value={formData.bmi}
                            onChange={handleChange}
                            className={`mt-1 block w-full border rounded-md shadow-sm p-1 bg-gray-100 
                focus:ring-0 ${
                  errors.bmi ? "border-red-500 bg-red-50" : "border-gray-300"
                }`}
                          />
                          {errors.bmi && (
                            <p className="text-xs text-red-500">{errors.bmi}</p>
                          )}
                        </div>

                        <div>
                          <label
                            htmlFor="waist"
                            className="block text-xs font-medium text-gray-700"
                          >
                            Waist (cm) <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            id="waist"
                            name="waist"
                            value={formData.waist}
                            onChange={handleChange}
                            className={`mt-1 block w-full border rounded-md shadow-sm p-1 focus:ring-2 focus:ring-red-500 ${
                              errors.waist
                                ? "border-red-500 bg-red-50"
                                : "border-gray-300"
                            }`}
                          />
                          {errors.waist && (
                            <p className="mt-1 text-xs text-red-500 flex items-center">
                              <ExclamationCircleIcon className="w-3 h-3 mr-1" />
                              {errors.waist}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Vital Signs & Lab Results Section */}
                    <div>
                      <SectionHeader
                        icon={BeakerIcon}
                        title="Vital Signs & Lab Results"
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                        <div>
                          <label
                            htmlFor="rbs"
                            className="block text-xs font-medium text-gray-700"
                          >
                            RBS (Random Blood Sugar)
                          </label>
                          <input
                            type="text"
                            id="rbs"
                            name="rbs"
                            value={formData.rbs}
                            onChange={handleChange}
                            className={`mt-1 block w-full border rounded-md shadow-sm p-1 focus:ring-2 focus:ring-red-500 ${
                              errors.rbs
                                ? "border-red-500 bg-red-50"
                                : "border-gray-300"
                            }`}
                          />
                          {errors.rbs && (
                            <p className="mt-1 text-xs text-red-500 flex items-center">
                              <ExclamationCircleIcon className="w-3 h-3 mr-1" />
                              {errors.rbs}
                            </p>
                          )}
                        </div>
                        <div>
                          <label
                            htmlFor="fbs"
                            className="block text-xs font-medium text-gray-700"
                          >
                            FBS (Fasting Blood Sugar)
                          </label>
                          <input
                            type="text"
                            id="fbs"
                            name="fbs"
                            value={formData.fbs}
                            onChange={handleChange}
                            className={`mt-1 block w-full border rounded-md shadow-sm p-1 focus:ring-2 focus:ring-red-500 ${
                              errors.fbs
                                ? "border-red-500 bg-red-50"
                                : "border-gray-300"
                            }`}
                          />
                          {errors.fbs && (
                            <p className="mt-1 text-xs text-red-500 flex items-center">
                              <ExclamationCircleIcon className="w-3 h-3 mr-1" />
                              {errors.fbs}
                            </p>
                          )}
                        </div>
                       {/* Blood Pressure */}
<div className="flex items-start space-x-4">
  {/* Systolic BP */}
  <div className="flex-1">
    <label
      htmlFor="systolicBP"
      className="block text-xs font-medium text-gray-700"
    >
      Systolic BP (mmHg)
    </label>
    <input
      type="number"
      id="systolicBP"
      name="systolicBP"
      value={formData.systolicBP}
      onChange={handleChange}
      placeholder="e.g., 120"
      className={`mt-1 block w-full border rounded-md shadow-sm p-1 focus:ring-2 focus:ring-red-500 ${
        errors.systolicBP ? "border-red-500 bg-red-50" : "border-gray-300"
      }`}
    />
    {errors.systolicBP && (
      <p className="mt-1 text-xs text-red-500 flex items-center">
        <ExclamationCircleIcon className="w-3 h-3 mr-1" />
        {errors.systolicBP}
      </p>
    )}
  </div>

  {/* Diastolic BP */}
  <div className="flex-1">
    <label
      htmlFor="diastolicBP"
      className="block text-xs font-medium text-gray-700"
    >
      Diastolic BP (mmHg)
    </label>
    <input
      type="number"
      id="diastolicBP"
      name="diastolicBP"
      value={formData.diastolicBP}
      onChange={handleChange}
      placeholder="e.g., 80"
      className={`mt-1 block w-full border rounded-md shadow-sm p-1 focus:ring-2 focus:ring-red-500 ${
        errors.diastolicBP ? "border-red-500 bg-red-50" : "border-gray-300"
      }`}
    />
    {errors.diastolicBP && (
      <p className="mt-1 text-xs text-red-500 flex items-center">
        <ExclamationCircleIcon className="w-3 h-3 mr-1" />
        {errors.diastolicBP}
      </p>
    )}
  </div>
</div>


                      </div>
                    </div>

                    {/* Vision Assessment Section */}
                    <div>
                      <SectionHeader icon={EyeIcon} title="Vision Assessment" />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                        <div>
                          <label
                            htmlFor="visionLeft"
                            className="block text-xs font-medium text-gray-700"
                          >
                            Vision: Left Eye
                          </label>
                          <input
                            type="text"
                            id="visionLeft"
                            name="visionLeft"
                            value={formData.visionLeft}
                            onChange={handleChange}
                            className={`mt-1 block w-full border rounded-md shadow-sm p-1 focus:ring-2 focus:ring-red-500 ${
                              errors.visionLeft
                                ? "border-red-500 bg-red-50"
                                : "border-gray-300"
                            }`}
                          />
                          {errors.visionLeft && (
                            <p className="mt-1 text-xs text-red-500 flex items-center">
                              <ExclamationCircleIcon className="w-3 h-3 mr-1" />
                              {errors.visionLeft}
                            </p>
                          )}
                        </div>
                        <div>
                          <label
                            htmlFor="visionRight"
                            className="block text-xs font-medium text-gray-700"
                          >
                            Vision: Right Eye
                          </label>
                          <input
                            type="text"
                            id="visionRight"
                            name="visionRight"
                            value={formData.visionRight}
                            onChange={handleChange}
                            className={`mt-1 block w-full border rounded-md shadow-sm p-1 focus:ring-2 focus:ring-red-500 ${
                              errors.visionRight
                                ? "border-red-500 bg-red-50"
                                : "border-gray-300"
                            }`}
                          />
                          {errors.visionRight && (
                            <p className="mt-1 text-xs text-red-500 flex items-center">
                              <ExclamationCircleIcon className="w-3 h-3 mr-1" />
                              {errors.visionRight}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Medical History*/}
                {currentStep === 3 && (
                  <div className="flex flex-col gap-6">
                    <h1 className="text-2xl font-semibold text-gray-800 flex items-center bg-red-50 p-4 rounded-lg border border-red-200 shadow-sm">
                      <ClipboardDocumentListIcon className="w-7 h-7 mr-3 text-red-500" />
                      Medical History
                    </h1>

                    {/* Table for Patient and Family History */}
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        {/* Table Header */}
                        <thead className="bg-red-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                              <h3 className="flex items-center">
                                <UserCircleIcon className="w-4 h-4 mr-1 text-red-500" />
                                Relation
                              </h3>
                            </th>
                            {commonMedicalConditions.map((condition) => (
                              <th
                                key={condition}
                                className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap"
                              >
                                {condition}
                              </th>
                            ))}
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              <h3 className="flex items-center">Other</h3>
                            </th>
                          </tr>
                        </thead>
                        {/* Table Body */}
                        <tbody className="bg-white divide-y divide-gray-200">
                          {/* Patient's History Row*/}
                          <tr className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              Patient
                            </td>
                            {commonMedicalConditions.map((condition) => (
                              <td
                                key={`patient-${condition}-cell`}
                                className="px-6 py-4 whitespace-nowrap text-center"
                              >
                                <input
                                  id={`patient-${condition}`}
                                  name="patientHistory"
                                  value={condition}
                                  type="checkbox"
                                  checked={formData.patientHistory.includes(
                                    condition
                                  )}
                                  onChange={handleChange}
                                  className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500 cursor-pointer"
                                />
                              </td>
                            ))}
                            <td className="px-6 py-4">
                              <textarea
                                id="otherPatientConditions"
                                name="otherPatientConditions"
                                rows="1"
                                value={formData.otherPatientConditions}
                                onChange={handleChange}
                                className="w-full border rounded-md shadow-sm p-1 text-sm border-gray-300 focus:ring-2 focus:ring-red-500"
                                placeholder="e.g., Asthma, Allergies"
                              ></textarea>
                            </td>
                          </tr>

                          {/* Family History Rows */}
                          {["Father", "Mother", "Siblings"].map((relation) => (
                            <tr
                              key={relation}
                              className="hover:bg-gray-50 transition-colors"
                            >
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {relation}
                              </td>
                              {commonMedicalConditions.map((condition) => (
                                <td
                                  key={`${relation}-${condition}-cell`}
                                  className="px-6 py-4 whitespace-nowrap text-center"
                                >
                                  <input
                                    id={`${relation}-${condition}`}
                                    name={`familyHistory${relation}`}
                                    value={condition}
                                    type="checkbox"
                                    checked={formData[
                                      `familyHistory${relation}`
                                    ].includes(condition)}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        `familyHistory${relation}`
                                      )
                                    }
                                    className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500 cursor-pointer"
                                  />
                                </td>
                              ))}
                              <td className="px-6 py-4">
                                <textarea
                                  id={`other${relation}Conditions`}
                                  name={`other${relation}Conditions`}
                                  rows="1"
                                  value={formData[`other${relation}Conditions`]}
                                  onChange={handleChange}
                                  className="w-full border rounded-md shadow-sm p-1 text-sm border-gray-300 focus:ring-2 focus:ring-red-500"
                                  placeholder="e.g., Heart Disease"
                                ></textarea>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Step 4: Lifestyle & Habits */}
                {currentStep === 4 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    <h1 className="text-xl font-semibold text-gray-800 md:col-span-2 flex items-center bg-red-50 p-3 rounded-lg border border-red-200">
                      <SunIcon className="w-6 h-6 mr-2 text-red-500" />
                      Lifestyle & Habits
                    </h1>
                    <div>
                      <label
                        htmlFor="alcoholConsumption"
                        className="block text-xs font-medium text-gray-700"
                      >
                        Alcohol Consumption
                      </label>
                      <textarea
                        id="alcoholConsumption"
                        name="alcoholConsumption"
                        rows="3"
                        value={formData.alcoholConsumption}
                        onChange={handleChange}
                        placeholder="Describe frequency and amount..."
                        className={`mt-1 block w-full border rounded-md shadow-sm p-1 focus:ring-2 focus:ring-red-500 ${
                          errors.alcoholConsumption
                            ? "border-red-500 bg-red-50"
                            : "border-gray-300"
                        }`}
                      ></textarea>
                      {errors.alcoholConsumption && (
                        <p className="mt-1 text-xs text-red-500 flex items-center">
                          <ExclamationCircleIcon className="w-3 h-3 mr-1" />
                          {errors.alcoholConsumption}
                        </p>
                      )}
                    </div>
                    <div>
  <label
    htmlFor="smokingHabits"
    className="block text-xs font-medium text-gray-700"
  >
    Smoking Habits
  </label>

  <div
    className={`mt-2 flex flex-col space-y-2 p-2 rounded-md ${
      errors.smokingHabits
        ? "border border-red-500 bg-red-50"
        : "bg-gray-50"
    }`}
  >
    <div className="flex items-center">
      <input
        type="radio"
        id="occasionalSmoker"
        name="smokingHabits"
        value="Occasional Smoker"
        checked={formData.smokingHabits === "Occasional Smoker"}
        onChange={handleChange}
        className="h-3 w-3 text-red-600 border-gray-300 focus:ring-red-500"
      />
      <label
        htmlFor="occasionalSmoker"
        className="ml-2 text-xs text-gray-700"
      >
        Occasional Smoker
      </label>
    </div>

    <div className="flex items-center">
      <input
        type="radio"
        id="regularSmoker"
        name="smokingHabits"
        value="Regular Smoker"
        checked={formData.smokingHabits === "Regular Smoker"}
        onChange={handleChange}
        className="h-3 w-3 text-red-600 border-gray-300 focus:ring-red-500"
      />
      <label
        htmlFor="regularSmoker"
        className="ml-2 text-xs text-gray-700"
      >
        Regular Smoker
      </label>
    </div>
  </div>

  {errors.smokingHabits && (
    <p className="mt-1 text-xs text-red-500 flex items-center">
      <ExclamationCircleIcon className="w-3 h-3 mr-1" />
      {errors.smokingHabits}
    </p>
  )}
</div>


                  </div>
                )}

                {/* Step 5: Current Problems (UPDATED with inline + on Issues) */}
                {currentStep === 5 && (
                  <div>
                    <h1 className="text-xl font-semibold text-gray-800 mb-4 flex items-center bg-red-50 p-3 rounded-lg border border-red-200">
                      <ExclamationCircleIcon className="w-6 h-6 mr-2 text-red-500" />
                      Current Problems
                    </h1>

                    <div className="space-y-4">
                      {formData.currentProblemsEntries.map((entry, idx) => {
                        const options = [
                          ...CURRENT_PROBLEM_OPTIONS,
                          ...(entry.customOptions || []),
                        ];
                        return (
                          <div
                            key={idx}
                            className="relative border border-red-200 bg-red-50 rounded-lg p-4"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-700">
                                Issues
                              </span>
                              <div className="flex items-center gap-1">
                                {/* Inline add custom issue */}
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleStartAddCustomOption(idx)
                                  }
                                  className="inline-flex items-center text-red-600 hover:text-red-700 px-2 py-1 rounded"
                                  title="Add custom issue"
                                >
                                  <PlusIcon className="w-5 h-5" />
                                </button>
                                {formData.currentProblemsEntries.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleRemoveProblemSection(idx)
                                    }
                                    className="inline-flex items-center text-red-600 hover:text-red-700 px-2 py-1 rounded"
                                    title="Remove this set"
                                  >
                                    <TrashIcon className="w-5 h-5" />
                                  </button>
                                )}
                              </div>
                            </div>

                            {entry.addingCustom && (
                              <div className="mt-1 mb-2 flex items-center gap-2">
                                <input
                                  type="text"
                                  value={entry.newCustomLabel || ""}
                                  onChange={(e) =>
                                    handleCustomOptionInputChange(
                                      idx,
                                      e.target.value
                                    )
                                  }
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      e.preventDefault();
                                      handleConfirmAddCustomOption(idx);
                                    }
                                  }}
                                  className="flex-1 border rounded-md p-1 text-sm focus:ring-2 focus:ring-red-500 border-gray-300 bg-white"
                                  placeholder="Enter custom issue label"
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleConfirmAddCustomOption(idx)
                                  }
                                  className="inline-flex items-center justify-center px-2 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                                  title="Add"
                                >
                                  <CheckIcon className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleCancelAddCustomOption(idx)
                                  }
                                  className="inline-flex items-center justify-center px-2 py-2 text-gray-600 hover:text-gray-800"
                                  title="Cancel"
                                >
                                  <XMarkIcon className="w-4 h-4" />
                                </button>
                              </div>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                              {options.map((opt) => (
                                <label
                                  key={opt}
                                  className="flex items-center bg-white rounded-md border border-red-200 px-3 py-2 shadow-sm"
                                >
                                  <input
                                    type="checkbox"
                                    checked={entry.selected.includes(opt)}
                                    onChange={() =>
                                      handleToggleProblem(idx, opt)
                                    }
                                    className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                                  />
                                  <span className="ml-2 text-xs text-gray-800">
                                    {opt}
                                  </span>
                                </label>
                              ))}
                            </div>

<<<<<<< HEAD
                            <div className="mt-3">
                              <label className="block text-xs font-medium text-gray-700">
                                Additional details
                              </label>
                              <textarea
                                rows={3}
                                value={entry.details}
                                onChange={(e) =>
                                  handleEntryDetailsChange(idx, e.target.value)
                                }
                                className="mt-1 block w-full border rounded-md shadow-sm p-1 text-sm border-gray-300 focus:ring-2 focus:ring-red-500 bg-white"
                                placeholder="Describe current symptoms and issues..."
                              />
                            </div>
                          </div>
                        );
                      })}

                      {/* Validation message */}
                      {errors.currentProblems && (
                        <p className="text-xs text-red-600 flex items-center">
                          <ExclamationCircleIcon className="w-3 h-3 mr-1" />
                          {errors.currentProblems}
                        </p>
                      )}
                    </div>
                  </div>
                )}
=======
        //Compute diabetes category
          const diabetesCategory = getDiabetesCategory(formData.rbs);


        return (
          <div
            key={idx}
            className="relative border border-red-200 bg-red-50 rounded-lg p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Issues
              </span>
              <div className="flex items-center gap-1">
                {formData.currentProblemsEntries.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveProblemSection(idx)}
                    className="inline-flex items-center text-red-600 hover:text-red-700 px-2 py-1 rounded"
                    title="Remove this set"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
            <div className="flex flex-wrap items-start gap-4 w-full">

{/* BMI Section */}
{bmiCategory && (
  <div className="flex flex-col items-start bg-white border border-red-200 rounded-xl shadow-sm p-3 w-48">
    <div className="text-xs font-medium text-gray-600 mb-1">
      {formData.step2Titles?.bmi || "BMI"}
    </div>
    <label className="flex items-center">
      <input
        type="checkbox"
        checked={true}
        readOnly
        className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
      />
      <span className="ml-2 text-xs text-gray-800">{bmiCategory}</span>
    </label>
  </div>
)}

{/* Waist Section */}
{waistCategory && (
  <div className="flex flex-col items-start bg-white border border-red-200 rounded-xl shadow-sm p-3 w-48">
    <div className="text-xs font-medium text-gray-600 mb-1">
      {formData.step2Titles?.waist || "Waist"}
    </div>
    <label className="flex items-center">
      <input
        type="checkbox"
        checked={true}
        readOnly
        className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
      />
      <span className="ml-2 text-xs text-gray-800">{waistCategory}</span>
    </label>
  </div>
)}

{/* Vision Section */}
{formData.visionCategory && (
  <div className="flex flex-col items-start bg-white border border-red-200 rounded-xl shadow-sm p-3 w-48">
    <div className="text-xs font-medium text-gray-600 mb-1">
      {formData.step2Titles?.vision || "Vision"}
    </div>
    <label className="flex items-center">
      <input
        type="checkbox"
        checked={true}
        readOnly
        className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
      />
      <span className="ml-2 text-xs text-gray-800">
        {formData.visionCategory}
      </span>
    </label>
  </div>
)}

{/* Diabetes Section */}
{diabetesCategory && (
  <div className="flex flex-col items-start bg-white border border-red-200 rounded-xl shadow-sm p-3 w-48">
    <div className="text-xs font-medium text-gray-600 mb-1">
      {formData.step2Titles?.diabetes || "Diabetes Diagnosis"}
    </div>
    <label className="flex items-center">
      <input
        type="checkbox"
        checked={true}
        readOnly
        className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
      />
      <span className="ml-2 text-xs text-gray-800">
        {diabetesCategory}
      </span>
    </label>
  </div>
)}


{/* Blood Pressure Section */}
{getHypertensionCategory(formData.systolicBP, formData.diastolicBP) && (
  <div className="flex flex-col items-start bg-white border border-red-200 rounded-xl shadow-sm p-3 w-56">
    <div className="text-xs font-medium text-gray-600 mb-1">
      {formData.step2Titles?.bp || "Blood Pressure"}
    </div>
    <label className="flex items-center">
      <input
        type="checkbox"
        checked={true}
        readOnly
        className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
      />
      <span className="ml-2 text-xs text-gray-800">
        {getHypertensionCategory(formData.systolicBP, formData.diastolicBP)}
      </span>
    </label>
  </div>
)}




</div>


            <div className="mt-3">
              <label className="block text-xs font-medium text-gray-700">
                Additional details
              </label>
              <textarea
                rows={3}
                value={entry.details}
                onChange={(e) =>
                  handleEntryDetailsChange(idx, e.target.value)
                }
                className="mt-1 block w-full border rounded-md shadow-sm p-1 text-sm border-gray-300 focus:ring-2 focus:ring-red-500 bg-white"
                placeholder="Describe current symptoms and issues..."
              />
            </div>
          </div>
        );
      })}

      {/* Validation message */}
      {errors.currentProblems && (
        <p className="text-xs text-red-600 flex items-center">
          <ExclamationCircleIcon className="w-3 h-3 mr-1" />
          {errors.currentProblems}
        </p>
      )}
    </div>
  </div>
)}
>>>>>>> eeb9958 (Implement Definitions)

                {/* Step 6: Screening Tests*/}
                {currentStep === 6 && (
                  <div className="space-y-4">
                    <h1 className="text-xl font-semibold text-gray-800 flex items-center bg-red-50 p-3 rounded-lg border border-red-200">
                      <BeakerIcon className="w-6 h-6 mr-2 text-red-500" />
                      Screening Tests
                    </h1>
                    {/* Breast Examination */}
                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                      <label className="block text-xs font-medium text-gray-700">
                        Breast Examination
                      </label>
                      <div className="mt-2 flex items-center space-x-4">
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="breastExamDone"
                            name="breastExamination"
                            value="Done"
                            checked={formData.breastExamination === "Done"}
                            onChange={handleChange}
                            className="h-3 w-3 text-red-600 border-gray-300 focus:ring-red-500"
                          />
                          <label
                            htmlFor="breastExamDone"
                            className="ml-1 text-xs text-gray-700"
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
                            checked={formData.breastExamination === "Not Done"}
                            onChange={handleChange}
                            className="h-3 w-3 text-red-600 border-gray-300 focus:ring-red-500"
                          />
                          <label
                            htmlFor="breastExamNotDone"
                            className="ml-1 text-xs text-gray-700"
                          >
                            Not Done
                          </label>
                        </div>
                      </div>
                    </div>
                    {/* Pap Smear */}
                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                      <label className="block text-xs font-medium text-gray-700">
                        Pap Smear
                      </label>
                      <div className="mt-2 flex items-center space-x-4">
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="papSmearDone"
                            name="papSmear"
                            value="Done"
                            checked={formData.papSmear === "Done"}
                            onChange={handleChange}
                            className="h-3 w-3 text-red-600 border-gray-300 focus:ring-red-500"
                          />
                          <label
                            htmlFor="papSmearDone"
                            className="ml-1 text-xs text-gray-700"
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
                            checked={formData.papSmear === "Not Done"}
                            onChange={handleChange}
                            className="h-3 w-3 text-red-600 border-gray-300 focus:ring-red-500"
                          />
                          <label
                            htmlFor="papSmearNotDone"
                            className="ml-1 text-xs text-gray-700"
                          >
                            Not Done
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 7: Treatment Plan */}
                {currentStep === 7 && (
                  <div className="space-y-4">
                    <h1 className="text-xl font-semibold text-gray-800 flex items-center bg-red-50 p-3 rounded-lg border border-red-200">
                      <CheckCircleIcon className="w-6 h-6 mr-2 text-red-500" />
                      Treatment Plan / Recommendations
                    </h1>
                    <div>
                      <label
                        htmlFor="treatmentPlan"
                        className="block text-xs font-medium text-gray-700"
                      >
                        Specific plans or recommendations (e.g., Sponge Family,
                        Away of Medical Centre - CPSTL)
                      </label>
                      <textarea
                        id="treatmentPlan"
                        name="treatmentPlan"
                        rows="3"
                        value={formData.treatmentPlan}
                        onChange={handleChange}
                        placeholder="Enter treatment details..."
                        className={`mt-1 block w-full border rounded-md shadow-sm p-1 focus:ring-2 focus:ring-red-500 ${
                          errors.treatmentPlan
                            ? "border-red-500 bg-red-50"
                            : "border-gray-300"
                        }`}
                      ></textarea>
                      {errors.treatmentPlan && (
                        <p className="mt-1 text-xs text-red-500 flex items-center">
                          <ExclamationCircleIcon className="w-3 h-3 mr-1" />
                          {errors.treatmentPlan}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="smokingCessationAdvice"
                        className="block text-xs font-medium text-gray-700"
                      >
                        Smoking cessation advice
                      </label>
                      <textarea
                        id="smokingCessationAdvice"
                        name="smokingCessationAdvice"
                        rows="3"
                        value={formData.smokingCessationAdvice}
                        onChange={handleChange}
                        placeholder="Enter advice for smoking cessation..."
                        className={`mt-1 block w-full border rounded-md shadow-sm p-1 focus:ring-2 focus:ring-red-500 ${
                          errors.smokingCessationAdvice
                            ? "border-red-500 bg-red-50"
                            : "border-gray-300"
                        }`}
                      ></textarea>
                      {errors.smokingCessationAdvice && (
                        <p className="mt-1 text-xs text-red-500 flex items-center">
                          <ExclamationCircleIcon className="w-3 h-3 mr-1" />
                          {errors.smokingCessationAdvice}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="alcoholAbuseAdvice"
                        className="block text-xs font-medium text-gray-700"
                      >
                        Alcohol abuse advice
                      </label>
                      <textarea
                        id="alcoholAbuseAdvice"
                        name="alcoholAbuseAdvice"
                        rows="3"
                        value={formData.alcoholAbuseAdvice}
                        onChange={handleChange}
                        placeholder="Enter advice for alcohol abuse..."
                        className={`mt-1 block w-full border rounded-md shadow-sm p-1 focus:ring-2 focus:ring-red-500 ${
                          errors.alcoholAbuseAdvice
                            ? "border-red-500 bg-red-50"
                            : "border-gray-300"
                        }`}
                      ></textarea>
                      {errors.alcoholAbuseAdvice && (
                        <p className="mt-1 text-xs text-red-500 flex items-center">
                          <ExclamationCircleIcon className="w-3 h-3 mr-1" />
                          {errors.alcoholAbuseAdvice}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="mt-8 flex justify-between items-center w-full relative">
  {/* Previous Button (Left) */}
  <button
    type="button"
    onClick={handlePrevStep}
    disabled={currentStep === 1}
    className={`px-6 py-2 rounded-md font-medium transition-all duration-200 flex items-center ${
      currentStep === 1
        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
        : "bg-white border border-red-500 text-red-500 hover:bg-red-50"
    }`}
  >
    <svg
      className="w-4 h-4 mr-2"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 19l-7-7 7-7"
      />
    </svg>
    Previous
  </button>

  {/* Step Indicator (Centered) */}
  <span className="absolute left-1/2 transform -translate-x-1/2 text-sm text-gray-600">
    Step {currentStep} of {STEPS.length}
  </span>

  {/* Right-side Buttons (Cancel + Next) */}
  <div className="flex items-center space-x-10">
    {/* Cancel Button */}
    <button
      type="button"
      onClick={handleCancel}
      className="px-6 py-2 bg-red-400 text-white rounded-md font-medium hover:bg-red-500 transition-colors duration-200 flex items-center shadow-lg"
    >
      <svg
        className="w-4 h-4 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
      Cancel
    </button>

    {/* Next / Submit Button */}
    <button
      type="button"
      onClick={() => {
        if (currentStep === STEPS.length) {
          handleSubmit();
        } else {
          handleNextStep();
        }
      }}
      className="px-6 py-2 bg-red-500 text-white rounded-md font-medium hover:bg-red-600 transition-colors duration-200 flex items-center shadow-lg"
    >
      {currentStep === STEPS.length ? "Submit" : "Next"}
      {currentStep !== STEPS.length && (
        <svg
          className="w-4 h-4 ml-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      )}
    </button>
  </div>
</div>
            </form>
          </div>
        </div>

        <AppFooter />
      </main>
    </div>
  );
}

export default AddNewPatient;
