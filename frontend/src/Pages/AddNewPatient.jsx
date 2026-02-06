import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import api from "../utils/api";
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
import MedicalHistoryChartModal from "../Components/MedicalHistoryChartModal";

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



 const DECIMAL_MAX = 999.99;

const DECIMAL_FIELDS = [
  "height",
  "weight",
  "bmi",
  "waist",
  "rbs",
  "fbs",
  "systolicBP",
  "diastolicBP",
];


const validateDecimal = (name, value) => {
  // Only validate listed decimal fields
  if (!DECIMAL_FIELDS.includes(name)) return "";

  if (value === "") return "";

  // Allow max 2 decimal places
  if (!/^\d+(\.\d{0,2})?$/.test(value)) {
    return "Only up to 2 decimal places allowed";
  }

  // Max value check
  if (Number(value) > DECIMAL_MAX) {
    return `Maximum allowed value is ${DECIMAL_MAX}`;
  }

  return "";
};


// The main page component for adding a new patient
function AddNewPatient() {
  const { id } = useParams();
  const location = useLocation();
  const passedPatient = location.state?.patient || null;
  const latestRecord = location.state?.latestRecord || null;
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [selectedRecordId, setSelectedRecordId] = useState(null);
  const getRecordKey = (rec) => String(rec.id || rec._id);

  // Determine patientId correctly
  let patientId = id || passedPatient?.id || null;

  const isNewPatientMode = !patientId;
  const isNewPatient = !patientId;

  const isEditMode = Boolean(passedPatient && latestRecord);
  const isAddMedicalRecordMode = Boolean(passedPatient && latestRecord);
  const [isAddNewPatientMode, setIsAddNewPatientMode] = useState(
    Boolean(!passedPatient)
  );

  const [history, setHistory] = useState([]);
  const [chartModalVisible, setChartModalVisible] = useState(false);
  const [chartField, setChartField] = useState("");
  const [chartIndex, setChartIndex] = useState(0);

  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [stepperLayout] = useState("horizontal");
  const [epfCheckMsg, setEpfCheckMsg] = useState("");

  console.log("AddNewPatient received latestRecord:", latestRecord);

  // Fetch ALL previous medical records
  useEffect(() => {
    if (patientId) {
      api
        .get(`/patientmedicalrecords/${patientId}/records`)
        .then((res) => {
          const sorted = [...res.data].sort(
            (a, b) => new Date(b.date) - new Date(a.date)
          );
          setHistory(sorted);
          if (sorted.length > 0) {
            const first = sorted[0];
            setSelectedRecord(first);
            setSelectedRecordId(getRecordKey(first)); 
          }
        })
        .catch(() => setHistory([]));
    }
  }, [patientId]);

  const openChartModal = (field) => {
    setChartField(field);
    setChartIndex(0); // start with comparing latest vs previous
    setChartModalVisible(true);
  };

  const closeChartModal = () => setChartModalVisible(false);

  const goPrev = () => setChartIndex((prev) => prev + 1); // Older
  const goNext = () => setChartIndex((prev) => prev - 1); // Newer

  const mapSmokingSummaryToHabit = (summary) => {
    if (!summary) return "";
    if (summary.includes("Non")) return "Non Smoker";
    if (summary.includes("Occasional")) return "Occasional Smoker";
    if (summary.includes("Regular")) return "Regular Smoker";
    return "";
  };

  const mapAlcoholSummaryToForm = (summary) => {
    if (!summary)
      return {
        consumeAlcohol: false,
        typeOfAlcohol: "",
        drinksPerWeek: "",
        durationOfHabit: "",
        alcoholComments: "",
      };

    let consumeAlcohol = true;
    let typeOfAlcohol = "";
    let drinksPerWeek = "";
    let durationOfHabit = "";
    let alcoholComments = summary;

    const lowerSummary = summary.toLowerCase();

    // Map keywords to internal category
    if (
      lowerSummary.includes("low-risk") ||
      lowerSummary.includes("occasional")
    ) {
      typeOfAlcohol = "Occasional Drinker";
    } else if (
      lowerSummary.includes("regular") ||
      lowerSummary.includes("high risk") ||
      lowerSummary.includes("moderate")
    ) {
      typeOfAlcohol = "Regular Drinker";
    } else if (
      lowerSummary.includes("non-drinker") ||
      lowerSummary.includes("no alcohol")
    ) {
      consumeAlcohol = false;
      typeOfAlcohol = "Non-Drinker";
    }

    return {
      consumeAlcohol,
      typeOfAlcohol,
      drinksPerWeek,
      durationOfHabit,
      alcoholComments,
    };
  };

  const initialFormData = {
    // Basic info
    registrationNo: passedPatient?.registrationNo || "",
    name: passedPatient?.name || "",
    epfNo: passedPatient?.epfNo || "",
    department: passedPatient?.department || "",
    contactNo: passedPatient?.contactNo || "",
    gender: passedPatient?.gender || "",
    dateOfBirth: passedPatient?.dateOfBirth || "",
    patient_id: passedPatient?.id || passedPatient?._id || "",

    // When editing an existing record - Auto-fill full medical data
    age: latestRecord?.age || "",
    height: latestRecord?.height || "",
    weight: latestRecord?.weight || "",
    bmi: latestRecord?.bmi || "",
    waist: latestRecord?.waist || "",

    rbs: latestRecord?.rbs || "",
    fbs: latestRecord?.fbs || "",
    systolicBP: latestRecord?.systolicBP || "",
    diastolicBP: latestRecord?.diastolicBP || "",

    visionLeft: latestRecord?.visionLeft || "",
    visionRight: latestRecord?.visionRight || "",
    breastExamination: latestRecord?.breastExamination || "Not Done",
    papSmear: latestRecord?.papSmear || "Not Done",

    alcoholConsumption: mapAlcoholSummaryToForm(
      latestRecord?.alcoholSummary || passedPatient?.alcoholSummary
    ),
    alcoholSummary:
      latestRecord?.alcoholSummary || passedPatient?.alcoholSummary || "",

    smokingSummary:
      latestRecord?.smokingSummary || passedPatient?.smokingSummary || "",
    smokingHabits: mapSmokingSummaryToHabit(
      latestRecord?.smokingSummary || passedPatient?.smokingSummary
    ),

    patientHistory: latestRecord?.patientHistory || [],
    otherPatientConditions: latestRecord?.otherPatientConditions || "",

    familyHistoryFather: latestRecord?.familyHistoryFather || [],
    otherFatherConditions: latestRecord?.otherFatherConditions || "",
    familyHistoryMother: latestRecord?.familyHistoryMother || [],
    otherMotherConditions: latestRecord?.otherMotherConditions || "",
    familyHistorySiblings: latestRecord?.familyHistorySiblings || [],
    otherSiblingsConditions: latestRecord?.otherSiblingsConditions || "",

    currentProblems: latestRecord?.currentProblems || "",
    currentProblemsList: [],
    currentProblemsEntries: [
      {
        selected: [],
        details: latestRecord?.currentProblems || "",
        customOptions: [],
        addingCustom: false,
        newCustomLabel: "",
      },
    ],

    treatmentPlan: latestRecord?.treatmentPlan || "",
    smokingCessationAdvice: latestRecord?.smokingCessationAdvice || "",
    alcoholAbuseAdvice: latestRecord?.alcoholAbuseAdvice || "",

    visitDate:
      latestRecord?.visitDate ||
      new Date().toISOString().slice(0, 19).replace("T", " "),
  };

  //Use initialFormData as default state
  const [formData, setFormData] = useState(initialFormData);

  // Update formData whenever latestRecord or passedPatient changes
  useEffect(() => {
    if (latestRecord || passedPatient) {
      const updatedForm = {
        ...initialFormData,
        // Fill medical details from latestRecord if exists
        age: latestRecord?.age || "",
        height: latestRecord?.height || "",
        weight: latestRecord?.weight || "",
        bmi: latestRecord?.bmi || "",
        waist: latestRecord?.waist || "",

        rbs: latestRecord?.rbs || "",
        fbs: latestRecord?.fbs || "",
        systolicBP: latestRecord?.systolicBP || "",
        diastolicBP: latestRecord?.diastolicBP || "",

        visionLeft: latestRecord?.visionLeft || "",
        visionRight: latestRecord?.visionRight || "",
        breastExamination: latestRecord?.breastExamination || "Not Done",
        papSmear: latestRecord?.papSmear || "Not Done",

        alcoholConsumption: mapAlcoholSummaryToForm(
          latestRecord?.alcoholSummary || passedPatient?.alcoholSummary
        ),
        alcoholSummary:
          latestRecord?.alcoholSummary || passedPatient?.alcoholSummary || "",

        smokingSummary:
          latestRecord?.smokingSummary || passedPatient?.smokingSummary || "",
        smokingHabits: mapSmokingSummaryToHabit(
          latestRecord?.smokingSummary || passedPatient?.smokingSummary
        ),

        patientHistory: latestRecord?.patientHistory || [],
        otherPatientConditions: latestRecord?.otherPatientConditions || "",

        familyHistoryFather: latestRecord?.familyHistoryFather || [],
        otherFatherConditions: latestRecord?.otherFatherConditions || "",
        familyHistoryMother: latestRecord?.familyHistoryMother || [],
        otherMotherConditions: latestRecord?.otherMotherConditions || "",
        familyHistorySiblings: latestRecord?.familyHistorySiblings || [],
        otherSiblingsConditions: latestRecord?.otherSiblingsConditions || "",

        currentProblems: latestRecord?.currentProblems || "",
        treatmentPlan: latestRecord?.treatmentPlan || "",
        smokingCessationAdvice: latestRecord?.smokingCessationAdvice || "",
        alcoholAbuseAdvice: latestRecord?.alcoholAbuseAdvice || "",

        visitDate:
          latestRecord?.visitDate ||
          new Date().toISOString().slice(0, 19).replace("T", " "),
      };

      setFormData(updatedForm);
    }
  }, [latestRecord, passedPatient]);

  const [errors, setErrors] = useState({});

  //Reset with handleCancel
const handleCancel = () => {
  setFormData({
    // Patient identifiers
    registrationNo: "",
    name: "",
    epfNo: "",
    department: "",
    contactNo: "",
    gender: "",
    dateOfBirth: "",
    patient_id: "",

    // Basic details
    age: "",
    height: "",
    weight: "",
    bmi: "",
    waist: "",

    // Blood sugar / vitals
    rbs: "",
    fbs: "",
    systolicBP: "",
    diastolicBP: "",

    // Vision & exams
    visionLeft: "",
    visionRight: "",
    breastExamination: "Not Done",
    papSmear: "Not Done",

    // Lifestyle habits
    alcoholConsumption: "",
    smokingHabits: "",
    alcoholSummary: "",
    smokingSummary: "",

    // Medical history
    patientHistory: [],
    otherPatientConditions: "",

    // Family history
    familyHistoryFather: [],
    otherFatherConditions: "",
    familyHistoryMother: [],
    otherMotherConditions: "",
    familyHistorySiblings: [],
    otherSiblingsConditions: "",

    // Problems & diagnoses
    currentProblems: "",
    currentProblemsList: [],
    currentProblemsEntries: [
      {
        selected: [],
        details: "",
        customOptions: [],
        addingCustom: false,
        newCustomLabel: "",
      },
    ],

    // Treatment & advice
    treatmentPlan: "",
    smokingCessationAdvice: "",
    alcoholAbuseAdvice: "",

    // Visit details
    visitDate: "",
  });

  setErrors({});
  setCurrentStep(1);
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



 


  // Handle field changes and auto-update dependent fields
  const handleChange = (e, key = null) => {
    const { name, value, checked, type } = e.target;

      //DECIMAL VALIDATION FIRST
  const decimalError = validateDecimal(name, value);
  if (decimalError) {
    setErrors((prev) => ({ ...prev, [name]: decimalError }));
    return;
  }

  // Clear error if valid
  setErrors((prev) => ({ ...prev, [name]: "" }));

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
      //Auto calculate age
      else if (name === "dateOfBirth") {
        updatedData.dateOfBirth = value;
        updatedData.age = calculateAge(value);
      }
      //  BMI
      else if (name === "weight" || name === "height") {
        updatedData[name] = value;

        const height = parseFloat(name === "height" ? value : prevData.height);
        const weight = parseFloat(name === "weight" ? value : prevData.weight);

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

      // Waist
      else if (name === "waist") {
        updatedData.waist = value;
        const gender = updatedData.gender || prevData.gender;
        if (gender && value) {
          updatedData.getwaistCategory = getWaistCategory(
            parseFloat(value),
            gender
          );
        } else {
          updatedData.getwaistCategory = "";
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

    // Alcohol
    else if (
      name === "consumeAlcohol" ||
      name === "typeOfAlcohol" ||
      name === "drinksPerWeek" ||
      name === "durationOfHabit" ||
      name === "alcoholComments"
    ) {
      updatedData[name] = value;

      // Update alcohol summary
      updatedData.alcoholSummary = getAlcoholSummaryStep5({
        ...prevData,
        ...updatedData,
      });
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

  useEffect(() => {
    if (formData.dateOfBirth) {
      setFormData((prev) => ({
        ...prev,
        age: calculateAge(prev.dateOfBirth),
      }));
    }
  }, [formData.dateOfBirth]);

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
      if (!formData.department)
        newErrors.department = "Department is required.";
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

  const checkExistingPatientByEPF = async (epfNo) => {
    if (!epfNo) {
      setEpfCheckMsg("");
      return;
    }

    try {
      const response = await api.get(
        `/patients/check-epf/${epfNo}`
      );

      if (response.data.exists) {
        setEpfCheckMsg("⚠ Patient with this EPF already exists.");
      } else {
        setEpfCheckMsg("✔ No existing record found for this EPF.");
      }
    } catch (error) {
      console.error("EPF check error:", error);
      setEpfCheckMsg("Error checking EPF. Try again.");
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
        department: formData.department,
        contactNo: formData.contactNo,
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth,
      };

      console.log("Checking if patient exists:", basicInfo);

      let patientId = null;

      // New patient
      if (id) {
        patientId = id;
      }
      // Existing patient
      else if (passedPatient && passedPatient.id) {
        patientId = passedPatient.id;
      }

      if (isAddNewPatientMode) {
        const patientResponse = await api.post(
          "/patients/add",
          basicInfo
        );
        patientId = patientResponse.data.patientId;
        console.log("New patient ID:", patientId);
      } else {
        // Existing patient,dont save basic info again
        patientId = formData.patient_id; // Use existing patient ID
        console.log(
          "Existing patient → skip saving basic info, patient ID:",
          patientId
        );
      }

      // Save medical record
      if (!isAddNewPatientMode && patientId) {
        try {
          const { data: latestRecord } = await api.get(
            `/patientmedicalrecords/${patientId}/latest`
          );
          console.log("Latest Record:", latestRecord);
        } catch (err) {
          console.log("No previous medical record (first visit)");
        }
      } else {
        console.log("Skipping latest medical record fetch");
      }

      const currentProblemsList = [];

      if (formData.bmiCategory)
        currentProblemsList.push(`BMI: ${formData.bmiCategory}`);
      if (formData.getwaistCategory)
        currentProblemsList.push(`Waist: ${formData.getwaistCategory}`);
      if (formData.visionCategory)
        currentProblemsList.push(`Vision: ${formData.visionCategory}`);
      if (diabetesCategory)
        currentProblemsList.push(`Diabetes: ${diabetesCategory}`);

      const bpCategory = getHypertensionCategory(
        formData.systolicBP,
        formData.diastolicBP
      );
      if (bpCategory) currentProblemsList.push(`Blood Pressure: ${bpCategory}`);

      if (formData.consumeAlcohol)
        currentProblemsList.push(
          `Alcohol: ${getAlcoholSummaryStep5(formData)}`
        );

      if (formData.smokingHabits)
        currentProblemsList.push(
          `Smoking: ${getSmokingSummaryStep5(formData.smokingHabits)}`
        );

      // Prepare medical info
      const medicalInfo = {
        patient_id: patientId,
        visitDate: new Date().toISOString().slice(0, 19).replace("T", " "),
        age: formData.age ?? null,
        height: formData.height ?? null,
        weight: formData.weight ?? null,
        bmi: formData.bmi ?? null,
        waist: formData.waist ?? null,
        rbs: formData.rbs ?? null,
        fbs: formData.fbs ?? null,
        systolicBP: formData.systolicBP ?? null,
        diastolicBP: formData.diastolicBP ?? null,
        visionLeft: formData.visionLeft ?? null,
        visionRight: formData.visionRight ?? null,
        breastExamination: formData.breastExamination ?? null,
        papSmear: formData.papSmear ?? null,
        alcoholConsumption: getAlcoholMessageStep4(formData) ?? null,
        alcoholSummary: getAlcoholSummaryStep5(formData) ?? null,
        smokingHabits: getSmokingMessageStep4(formData.smokingHabits) ?? null,
        smokingSummary: getSmokingSummaryStep5(formData.smokingHabits) ?? null,
        treatmentPlan: formData.treatmentPlan ?? null,
        smokingCessationAdvice: formData.smokingCessationAdvice ?? null,
        alcoholAbuseAdvice: formData.alcoholAbuseAdvice ?? null,
        patientHistory: formData.patientHistory || [],
        otherPatientConditions: formData.otherPatientConditions ?? null,
        familyHistoryFather: formData.familyHistoryFather || [],
        otherFatherConditions: formData.otherFatherConditions ?? null,
        familyHistoryMother: formData.familyHistoryMother || [],
        otherMotherConditions: formData.otherMotherConditions ?? null,
        familyHistorySiblings: formData.familyHistorySiblings || [],
        otherSiblingsConditions: formData.otherSiblingsConditions ?? null,
        currentProblems:
          currentProblemsList.join("; ") || "No current problems reported.",
      };

      console.log("Sending medical info:", medicalInfo);

      // POST medical info
      await api.post(
        `/patientmedicalrecords/${patientId}/records`,
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
        // Patient identifiers
        registrationNo: "",
        name: "",
        epfNo: "",
        department: "",
        contactNo: "",
        gender: "",
        dateOfBirth: "",
        patient_id: "",

        // Basic details
        age: "",
        height: "",
        weight: "",
        bmi: "",
        waist: "",

        // Blood sugar / vitals
        rbs: "",
        fbs: "",
        systolicBP: "",
        diastolicBP: "",

        // Vision & exams
        visionLeft: "",
        visionRight: "",
        breastExamination: "Not Done",
        papSmear: "Not Done",

        // Lifestyle habits
        alcoholConsumption: "",
        smokingHabits: "",
        alcoholSummary: "",
        smokingSummary: "",

        // Medical history
        patientHistory: [],
        otherPatientConditions: "",

        // Family history
        familyHistoryFather: [],
        otherFatherConditions: "",
        familyHistoryMother: [],
        otherMotherConditions: "",
        familyHistorySiblings: [],
        otherSiblingsConditions: "",

        // Problems & diagnoses
        currentProblems: "",
        currentProblemsList: [],
        currentProblemsEntries: [
          {
            selected: [],
            details: "",
            customOptions: [],
            addingCustom: false,
            newCustomLabel: "",
          },
        ],

        // Treatment & advice
        treatmentPlan: "",
        smokingCessationAdvice: "",
        alcoholAbuseAdvice: "",

        // Visit details
        visitDate: "",
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
      if (patient.isNew) {
        console.log("New patient, skipping latest medical record fetch.");
        setMedicalRecord(null);
        return;
      }

      // Fetch latest medical record
      const { data } = await api.get(
        `/patientmedicalrecords/${patient.id}/latest`
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
    if ((s >= 140 && s <= 159) || (d >= 90 && d <= 99))
      return "Grade 1 Hypertension";
    if (s >= 160 || d >= 100) return "Grade 2 Hypertension";
    if (s >= 140 && d < 90) return "Isolated Systolic Hypertension";

    return "";
  };

  // Detailed Step 4 message for Alcohol
  const getAlcoholMessageStep4 = (formData) => {
    if (formData.consumeAlcohol === "No")
      return "✅ No alcohol consumption reported. Healthy habit maintained.";

    const drinks = parseInt(formData.drinksPerWeek || 0);
    const duration = parseInt(formData.durationOfHabit) || 0;
    const type = formData.typeOfAlcohol;

    let riskLevel = "low";

    if (type && drinks) {
      if (["Beer", "Wine"].includes(type)) {
        if (drinks > 10) riskLevel = "high";
        else if (drinks > 5) riskLevel = "moderate";
      } else if (["Arrack", "Spirits", "Whisky"].includes(type)) {
        if (drinks > 6) riskLevel = "high";
        else if (drinks > 3) riskLevel = "moderate";
      }

      if (duration > 10) riskLevel = "high";
      else if (duration > 5 && riskLevel === "low") riskLevel = "moderate";
    }

    if (riskLevel === "low")
      return "✅ Low-risk alcohol use pattern — monitor health regularly.";
    if (riskLevel === "moderate")
      return "⚠️ Moderate alcohol intake detected — advise reducing frequency and monitoring liver health.";
    if (riskLevel === "high")
      return "🚨 High-risk drinking pattern — recommend medical evaluation, counseling, or cessation support.";
  };

  // Small Step 5 summary for Alcohol
  const getAlcoholSummaryStep5 = (formData) => {
    // If user selects No
    if (formData.consumeAlcohol === "No") {
      return "No alcohol — healthy.";
    }

    // If alcohol values are updated by user, compute real-time
    const drinks = parseInt(formData.drinksPerWeek || 0);
    const type = formData.typeOfAlcohol;

    if (!type || !drinks) {
      return formData.alcoholSummary || "Alcohol consumed";
    }

    if (["Beer", "Wine"].includes(type)) {
      if (drinks > 10) return "High-risk drinking pattern";
      if (drinks > 5) return "Moderate alcohol use";
      return "Low-risk alcohol use";
    }

    if (["Arrack", "Spirits", "Whisky"].includes(type)) {
      if (drinks > 6) return "High-risk drinking pattern";
      if (drinks > 3) return "Moderate alcohol use";
      return "Low-risk alcohol use";
    }

    return formData.alcoholSummary || "Alcohol consumed";
  };

  // Step 4 message for Smoking
  const getSmokingMessageStep4 = (habit) => {
    if (!habit) return "";
    if (habit === "Non Smoker")
      return "✅ Excellent! You maintain a non smoking lifestyle — great for your lungs and heart.";
    if (habit === "Occasional Smoker")
      return "⚠️ Occasional smoking detected — even light smoking can impact health. Consider quitting completely.";
    if (habit === "Regular Smoker")
      return "🚨 Regular smoking is high risk — strongly advise cessation, counseling, and lung health evaluation.";
  };

  // Small Step 5 summary for Smoking
  const getSmokingSummaryStep5 = (habit) => {
    if (!habit) return "";
    if (habit === "Non Smoker") return "Non smoking — healthy";
    if (habit === "Occasional Smoker")
      return "Occasional smoking — moderate risk";
    if (habit === "Regular Smoker") return "Regular smoking — high risk";
  };

  const commonMedicalConditions = ["DM", "HTN", "CHOL", "IHD", "CA"];

  //Compute diabetes category
  const diabetesCategory = getDiabetesCategory(formData.rbs);

  const parseCurrentProblems = (str) => {
    const obj = {};
    if (!str) return obj;

    str.split(";").forEach((item) => {
      const [key, value] = item.split(":").map((s) => s.trim());
      if (key && value) {
        switch (key.toLowerCase()) {
          case "bmi":
            obj.bmiCategory = value;
            break;
          case "waist":
            obj.getwaistCategory = value;
            break;
          case "vision":
            obj.visionCategory = value;
            break;
          case "diabetes":
            obj.diabetesCategory = value;
            break;
          case "blood pressure":
            obj.bpCategory = value;
            break;
          case "smoking":
            obj.smokingSummary = value;
            break;
          case "alcohol":
            const alcoholData = mapAlcoholSummaryToForm(value);
            obj.consumeAlcohol = alcoholData.consumeAlcohol; // boolean
            obj.alcoholSummary = alcoholData.alcoholComments; // DB text
            break;
          default:
            obj.otherIssues = (obj.otherIssues || "") + `${key}: ${value}; `;
        }
      }
    });

    return obj;
  };

  // load record by id
  const loadRecordById = (recordId) => {
    if (!recordId) return;

    const idStr = String(recordId);

    const record = history.find((rec) => getRecordKey(rec) === idStr);

    if (!record) return;

    setSelectedRecord(record);
    setSelectedRecordId(idStr);

    setFormData((prev) => ({
      ...prev,
      age: record.age,
      height: record.height,
      weight: record.weight,
      bmi: record.bmi,
      waist: record.waist,
      rbs: record.rbs,
      fbs: record.fbs,
      systolicBP: record.systolicBP,
      diastolicBP: record.diastolicBP,
      visionLeft: record.visionLeft,
      visionRight: record.visionRight,
      breastExamination: record.breastExamination,
      papSmear: record.papSmear,
      alcoholConsumption: mapAlcoholSummaryToForm(record.alcoholSummary),
      alcoholSummary: record.alcoholSummary,
      smokingHabits: mapSmokingSummaryToHabit(record.smokingSummary),
      smokingSummary: record.smokingSummary,
      ...parseCurrentProblems(record.currentProblems || ""),
      patientHistory: record.patientHistory,
      familyHistoryFather: record.familyHistoryFather,
      familyHistoryMother: record.familyHistoryMother,
      familyHistorySiblings: record.familyHistorySiblings,
      otherPatientConditions: record.otherPatientConditions,
      otherFatherConditions: record.otherFatherConditions,
      otherMotherConditions: record.otherMotherConditions,
      otherSiblingsConditions: record.otherSiblingsConditions,
      treatmentPlan: record.treatmentPlan,
      smokingCessationAdvice: record.smokingCessationAdvice,
      alcoholAbuseAdvice: record.alcoholAbuseAdvice,
    }));
  };

  // Function to handle patient lookup entering epf
  const handlePatientLookup = async (field, value) => {
    if (!value) return;

    try {
      const res = await api.get("/patients/search", {
        params: { [field]: value },
      });

      const patient = res.data;

      if (!patient) {
        console.log("Patient not found → NEW patient mode");
        setIsAddNewPatientMode(true);
        return;
      }

      console.log("Existing patient found:", patient);
      setIsAddNewPatientMode(false);

      // Patient basic data
      setFormData((prev) => ({
        ...prev,
        registrationNo: patient.registrationNo,
        epfNo: patient.epfNo,
        name: patient.name,
        department: patient.department,
        contactNo: patient.contactNo,
        gender: patient.gender,
        dateOfBirth: patient.dateOfBirth,
        patient_id: patient.id,
      }));

      // Fetch latest medical record
      const latestRes = await api.get(
        `/patientmedicalrecords/${patient.id}/latest`
      );

      if (latestRes.data?.latestRecord) {
        const latest = latestRes.data.latestRecord;

        const parsedProblems = parseCurrentProblems(
          latest.currentProblems || ""
        );

        // Update form fields
        setFormData((prev) => ({
          ...prev,
          age: latest.age,
          height: latest.height,
          weight: latest.weight,
          bmi: latest.bmi,
          waist: latest.waist,
          rbs: latest.rbs,
          fbs: latest.fbs,
          systolicBP: latest.systolicBP,
          diastolicBP: latest.diastolicBP,
          visionLeft: latest.visionLeft,
          visionRight: latest.visionRight,
          breastExamination: latest.breastExamination,
          papSmear: latest.papSmear,
          alcoholConsumption: mapAlcoholSummaryToForm(latest.alcoholSummary),
          alcoholSummary: latest.alcoholSummary,
          smokingHabits: mapSmokingSummaryToHabit(latest.smokingSummary),
          smokingSummary: latest.smokingSummary,
          ...parsedProblems,
          patientHistory: latest.patientHistory,
          familyHistoryFather: latest.familyHistoryFather,
          familyHistoryMother: latest.familyHistoryMother,
          familyHistorySiblings: latest.familyHistorySiblings,
          otherPatientConditions: latest.otherPatientConditions,
          otherFatherConditions: latest.otherFatherConditions,
          otherMotherConditions: latest.otherMotherConditions,
          otherSiblingsConditions: latest.otherSiblingsConditions,
          treatmentPlan: latest.treatmentPlan,
          smokingCessationAdvice: latest.smokingCessationAdvice,
          alcoholAbuseAdvice: latest.alcoholAbuseAdvice,
        }));

        setSelectedRecord(latest);
      }

      // Fetch full history
      api
        .get(
          `/patientmedicalrecords/${patient.id}/records`
        )
        .then((res) => {
          const sorted = [...res.data].sort(
            (a, b) =>
              new Date(b.visitDate || b.date) - new Date(a.visitDate || a.date)
          );
          setHistory(sorted);
        })
        .catch(() => setHistory([]));
    } catch (err) {
      console.error("Lookup failed:", err);
    }
  };

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
                        onBlur={(e) =>
                          handlePatientLookup("registrationNo", e.target.value)
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handlePatientLookup(
                              "registrationNo",
                              e.target.value
                            );
                          }
                        }}
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
                        onChange={(e) => {
                          const value = e.target.value;
                          setFormData({ ...formData, epfNo: value });
                          checkExistingPatientByEPF(value);
                        }}
                        onBlur={(e) =>
                          handlePatientLookup("epfNo", e.target.value)
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handlePatientLookup("epfNo", e.target.value);
                          }
                        }}
                        className={`mt-1 block w-full border rounded-md shadow-sm p-1 focus:ring-2 focus:ring-red-500 ${
                          errors.epfNo
                            ? "border-red-500 bg-red-50"
                            : "border-gray-300"
                        }`}
                      />

                      {/* LIVE EPF CHECK MESSAGE */}
                      {epfCheckMsg && (
                        <p
                          className={`mt-1 text-xs ${
                            epfCheckMsg.includes("⚠")
                              ? "text-red-600"
                              : "text-green-600"
                          }`}
                        >
                          {epfCheckMsg}
                        </p>
                      )}

                      {errors.epfNo && (
                        <p className="mt-1 text-xs text-red-500 flex items-center">
                          <ExclamationCircleIcon className="w-3 h-3 mr-1" />
                          {errors.epfNo}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="department"
                        className="block text-xs font-medium text-gray-700"
                      >
                        Department <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="department"
                        name="department"
                        value={formData.department}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            department: e.target.value,
                          })
                        }
                        className={`mt-1 block w-full border rounded-md shadow-sm p-1 focus:ring-2 focus:ring-red-500 ${
                          errors.department
                            ? "border-red-500 bg-red-50"
                            : "border-gray-300"
                        }`}
                      >
                        <option value="">Select Department</option>
                        {[
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
                        ].map((dept) => (
                          <option key={dept} value={dept}>
                            {dept}
                          </option>
                        ))}
                      </select>
                      {errors.department && (
                        <p className="mt-1 text-xs text-red-500 flex items-center">
                          <ExclamationCircleIcon className="w-3 h-3 mr-1" />
                          {errors.department}
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
                    <h1 className="gap-5 text-xl font-semibold text-gray-800 flex items-center bg-red-50 p-3 rounded-lg border border-red-200">
                      <HeartIcon className="w-6 h-6 mr-2 text-red-500" />
                      Health Metrics
                     
                      {/* Date Section */}
                      {selectedRecord && (
                        <div className="flex items-center gap-3">
                          <span className="text-sm px-3 py-1 rounded-full bg-white border text-gray-700">
                            {new Date(
                              selectedRecord.visitDate || selectedRecord.date
                            ).toLocaleDateString()}
                          </span>

                          <select
                            className="border rounded-lg px-3 py-1 text-sm"
                            value={selectedRecordId || ""}
                            onChange={(e) => loadRecordById(e.target.value)}
                          >
                            <option value="">Change Date</option>

                            {history.map((rec) => {
                              const key = getRecordKey(rec);
                              return (
                                <option key={key} value={key}>
                                  {new Date(
                                    rec.visitDate || rec.date
                                  ).toLocaleDateString()}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      )}
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
                            min="0"
  max="300"
  step="0.01"
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

                        <div className="relative">
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

                          <span
                            className="absolute right-10 top-[25px] cursor-pointer text-blue-600 hover:text-blue-800"
                            onClick={() => openChartModal("bmi")}
                          >
                            📈
                          </span>

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
                        <div className="relative">
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
                            className={`mt-1 block w-full border rounded-md shadow-sm p-1 pr-10 focus:ring-2 focus:ring-red-500 ${
                              errors.rbs
                                ? "border-red-500 bg-red-50"
                                : "border-gray-300"
                            }`}
                          />

                          <span
                            className="absolute right-10 top-[25px] cursor-pointer text-blue-600 hover:text-blue-800"
                            onClick={() => openChartModal("rbs")}
                          >
                            📈
                          </span>

                          {errors.rbs && (
                            <p className="mt-1 text-xs text-red-500 flex items-center">
                              <ExclamationCircleIcon className="w-3 h-3 mr-1" />
                              {errors.rbs}
                            </p>
                          )}
                        </div>
                        <div className="relative">
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
                            className={`mt-1 block w-full border rounded-md shadow-sm p-1 pr-10 focus:ring-2 focus:ring-red-500 ${
                              errors.fbs
                                ? "border-red-500 bg-red-50"
                                : "border-gray-300"
                            }`}
                          />

                          <span
                            className="absolute right-10 top-[25px] cursor-pointer text-blue-600 hover:text-blue-800"
                            onClick={() => openChartModal("fbs")}
                          >
                            📈
                          </span>

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
                          <div className="relative flex-1">
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
                              className={`mt-1 block w-full border rounded-md shadow-sm p-1 pr-10 ${
                                errors.systolicBP
                                  ? "border-red-500 bg-red-50"
                                  : "border-gray-300"
                              }`}
                            />

                            <span
                              className="absolute right-10 top-[25px] cursor-pointer text-blue-600 hover:text-blue-800"
                              onClick={() => openChartModal("systolicBP")}
                            >
                              📈
                            </span>

                            {errors.systolicBP && (
                              <p className="mt-1 text-xs text-red-500 flex items-center">
                                <ExclamationCircleIcon className="w-3 h-3 mr-1" />
                                {errors.systolicBP}
                              </p>
                            )}
                          </div>

                          {/* Diastolic BP */}
                          <div className="relative flex-1">
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
                              className={`mt-1 block w-full border rounded-md shadow-sm p-1 pr-10 ${
                                errors.diastolicBP
                                  ? "border-red-500 bg-red-50"
                                  : "border-gray-300"
                              }`}
                            />

                            <span
                              className="absolute right-10 top-[25px] cursor-pointer text-blue-600 hover:text-blue-800"
                              onClick={() => openChartModal("diastolicBP")}
                            >
                              📈
                            </span>

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
                    <h1 className="gap-5 text-2xl font-semibold text-gray-800 flex items-center bg-red-50 p-4 rounded-lg border border-red-200 shadow-sm">
                      <ClipboardDocumentListIcon className="w-7 h-7 mr-3 text-red-500" />
                      Medical History
                      {selectedRecord && (
                        <div className="flex items-center gap-3">
                          <span className="text-sm px-3 py-1 rounded-full bg-white border text-gray-700">
                            {new Date(
                              selectedRecord.visitDate || selectedRecord.date
                            ).toLocaleDateString()}
                          </span>

                          <select
                            className="border rounded-lg px-3 py-1 text-sm"
                            value={selectedRecordId || ""}
                            onChange={(e) => loadRecordById(e.target.value)}
                          >
                            <option value="">Change Date</option>

                            {history.map((rec) => {
                              const key = getRecordKey(rec);
                              return (
                                <option key={key} value={key}>
                                  {new Date(
                                    rec.visitDate || rec.date
                                  ).toLocaleDateString()}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      )}
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
                    <h1 className="gap-5 text-xl font-semibold text-gray-800 md:col-span-2 flex items-center bg-red-50 p-3 rounded-lg border border-red-200">
                      <SunIcon className="w-6 h-6 mr-2 text-red-500" />
                      Lifestyle & Habits
                      {selectedRecord && (
                        <div className="flex items-center gap-3">
                          <span className="text-sm px-3 py-1 rounded-full bg-white border text-gray-700">
                            {new Date(
                              selectedRecord.visitDate || selectedRecord.date
                            ).toLocaleDateString()}
                          </span>

                          <select
                            className="border rounded-lg px-3 py-1 text-sm"
                            value={selectedRecordId || ""}
                            onChange={(e) => loadRecordById(e.target.value)}
                          >
                            <option value="">Change Date</option>

                            {history.map((rec) => {
                              const key = getRecordKey(rec);
                              return (
                                <option key={key} value={key}>
                                  {new Date(
                                    rec.visitDate || rec.date
                                  ).toLocaleDateString()}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      )}
                    </h1>

                    {/* Alcohol Consumption Section */}
                    <div className="mt-6 bg-white rounded-xl shadow-md p-6 border border-gray-100">
                      <h2 className="text-lg font-semibold text-red-700 border-b-2 border-red-500 pb-1 mb-4">
                        🍷 Alcohol Consumption
                      </h2>

                      <div
                        className={`flex flex-col space-y-3 p-3 rounded-md transition-all duration-200 ${
                          errors.consumeAlcohol
                            ? "border border-red-400 bg-red-50"
                            : "bg-gray-50 hover:bg-gray-100"
                        }`}
                      >
                        {/* Do you consume alcohol? */}
                        <div>
                          <label
                            htmlFor="consumeAlcohol"
                            className="block text-sm font-medium text-gray-800 mb-1"
                          >
                            Do you consume alcohol?
                          </label>
                          <select
                            id="consumeAlcohol"
                            name="consumeAlcohol"
                            value={formData.consumeAlcohol}
                            onChange={handleChange}
                            className={`block w-full border rounded-lg p-2 focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                              errors.consumeAlcohol
                                ? "border-red-500 bg-red-50"
                                : "border-gray-300"
                            }`}
                          >
                            <option value="">Select</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                          </select>
                        </div>

                        {/* Only show these fields if alcohol is consumed */}
                        {formData.consumeAlcohol === "Yes" && (
                          <>
                            <div className="grid grid-cols-2 gap-4 mt-2">
                              {/* Type of Alcohol */}
                              <div>
                                <label
                                  htmlFor="typeOfAlcohol"
                                  className="block text-sm font-medium text-gray-800 mb-1"
                                >
                                  Type of Alcohol
                                </label>
                                <select
                                  id="typeOfAlcohol"
                                  name="typeOfAlcohol"
                                  value={formData.typeOfAlcohol}
                                  onChange={handleChange}
                                  className={`block w-full border rounded-lg p-2 focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                                    errors.typeOfAlcohol
                                      ? "border-red-500 bg-red-50"
                                      : "border-gray-300"
                                  }`}
                                >
                                  <option value="">Select type</option>
                                  <option value="Beer">Beer</option>
                                  <option value="Wine">Wine</option>
                                  <option value="Spirits">Spirits</option>
                                  <option value="Arrack">Arrack</option>
                                  <option value="Whisky">Whisky</option>
                                  <option value="Other">Other</option>
                                </select>
                              </div>

                              {/* Drinks per week */}
                              <div>
                                <label
                                  htmlFor="drinksPerWeek"
                                  className="block text-sm font-medium text-gray-800 mb-1"
                                >
                                  Drinks per week (approx.)
                                </label>
                                <input
                                  type="number"
                                  id="drinksPerWeek"
                                  name="drinksPerWeek"
                                  value={formData.drinksPerWeek}
                                  onChange={handleChange}
                                  placeholder="e.g. 5"
                                  className={`block w-full border rounded-lg p-2 focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                                    errors.drinksPerWeek
                                      ? "border-red-500 bg-red-50"
                                      : "border-gray-300"
                                  }`}
                                />
                              </div>

                              {/* Duration of Habit */}
                              <div>
                                <label
                                  htmlFor="durationOfHabit"
                                  className="block text-sm font-medium text-gray-800 mb-1"
                                >
                                  Duration of Habit
                                </label>
                                <input
                                
                                  type="text"
                                  id="durationOfHabit"
                                  name="durationOfHabit"
                                  value={formData.durationOfHabit}
                                  onChange={handleChange}
                                  placeholder="e.g. 5 years"
                                  className={`block w-full border rounded-lg p-2 focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                                    errors.durationOfHabit
                                      ? "border-red-500 bg-red-50"
                                      : "border-gray-300"
                                  }`}
                                />
                              </div>

                              {/* Comments */}
                              <div>
                                <label
                                  htmlFor="alcoholComments"
                                  className="block text-sm font-medium text-gray-800 mb-1"
                                >
                                  Comments
                                </label>
                                <textarea
                                  id="alcoholComments"
                                  name="alcoholComments"
                                  rows="2"
                                  value={formData.alcoholComments}
                                  onChange={handleChange}
                                  placeholder="Any remarks..."
                                  className={`block w-full border rounded-lg p-2 focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                                    errors.alcoholComments
                                      ? "border-red-500 bg-red-50"
                                      : "border-gray-300"
                                  }`}
                                ></textarea>
                              </div>
                            </div>

                            {/* Smart Decision Section */}
                            <div className="mt-4">
                              <div
                                className={`border rounded-lg p-3 font-medium ${
                                  getAlcoholMessageStep4(formData).includes(
                                    "✅"
                                  )
                                    ? "bg-green-50 border-green-300 text-green-700"
                                    : getAlcoholMessageStep4(formData).includes(
                                        "⚠️"
                                      )
                                    ? "bg-yellow-50 border-yellow-300 text-yellow-700"
                                    : "bg-red-50 border-red-300 text-red-700"
                                }`}
                              >
                                {getAlcoholMessageStep4(formData)}
                              </div>
                            </div>
                          </>
                        )}

                        {/* If No is selected */}
                        {formData.consumeAlcohol === "No" && (
                          <div className="mt-3 bg-green-50 border border-green-200 text-green-700 text-sm font-medium rounded-lg p-3">
                            {getAlcoholMessageStep4(formData)}
                          </div>
                        )}
                        {formData.alcoholSummary}
                      </div>
                    </div>

                    {/* Smoking Habits Section */}
                    <div className="mt-6 bg-white rounded-xl shadow-md p-6 border border-gray-100">
                      <h2 className="text-lg font-semibold text-red-700 border-b-2 border-red-500 pb-1 mb-4">
                        🚬 Smoking Habits
                      </h2>

                      <div
                        className={`flex flex-col space-y-3 p-3 rounded-md transition-all duration-200 ${
                          errors.smokingHabits
                            ? "border border-red-400 bg-red-50"
                            : "bg-gray-50 hover:bg-gray-100"
                        }`}
                      >
                        {/* Radio Options */}
                        <div className="grid grid-cols-3 gap-4 text-sm font-medium text-gray-700">
                          {[
                            "Non Smoker",
                            "Occasional Smoker",
                            "Regular Smoker",
                          ].map((habit) => (
                            <label
                              key={habit}
                              htmlFor={habit}
                              className={`flex items-center space-x-2 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                                formData.smokingHabits === habit
                                  ? habit === "Non Smoker"
                                    ? "bg-green-100 border border-green-300 text-green-700 shadow-sm"
                                    : habit === "Occasional Smoker"
                                    ? "bg-yellow-100 border border-yellow-300 text-yellow-700 shadow-sm"
                                    : "bg-red-100 border border-red-300 text-red-700 shadow-sm"
                                  : "bg-white border border-gray-200 hover:bg-gray-50"
                              }`}
                            >
                              <input
                                type="radio"
                                id={habit}
                                name="smokingHabits"
                                value={habit}
                                checked={formData.smokingHabits === habit}
                                onChange={handleChange}
                                className={`h-4 w-4 ${
                                  habit === "Non Smoker"
                                    ? "text-green-600"
                                    : habit === "Occasional Smoker"
                                    ? "text-yellow-600"
                                    : "text-red-600"
                                } border-gray-300 focus:ring-2 ${
                                  habit === "Non Smoker"
                                    ? "focus:ring-green-500"
                                    : habit === "Occasional Smoker"
                                    ? "focus:ring-yellow-500"
                                    : "focus:ring-red-500"
                                }`}
                              />
                              <span>{habit.replace("-", " ")}</span>
                            </label>
                          ))}
                        </div>

                        {/* Smart Decision Box */}
                        {formData.smokingHabits && (
                          <div
                            className={`mt-4 border rounded-lg p-3 font-medium ${
                              formData.smokingHabits === "Non Smoker"
                                ? "bg-green-50 border-green-300 text-green-700"
                                : formData.smokingHabits === "Occasional Smoker"
                                ? "bg-yellow-50 border-yellow-300 text-yellow-700"
                                : "bg-red-50 border-red-300 text-red-700"
                            }`}
                          >
                            {getSmokingMessageStep4(formData.smokingHabits)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 5: Current Problems (with all definitions under Issues) */}
                {currentStep === 5 && (
                  <div>
                    <h1 className="gap-5 text-xl font-semibold text-gray-800 mb-4 flex items-center bg-red-50 p-3 rounded-lg border border-red-200">
                      <ExclamationCircleIcon className="w-6 h-6 mr-2 text-red-500" />
                      Current Problems
                      {selectedRecord && (
                        <div className="flex items-center gap-3">
                          <span className="text-sm px-3 py-1 rounded-full bg-white border text-gray-700">
                            {new Date(
                              selectedRecord.visitDate || selectedRecord.date
                            ).toLocaleDateString()}
                          </span>

                          <select
                            className="border rounded-lg px-3 py-1 text-sm"
                            value={selectedRecordId || ""}
                            onChange={(e) => loadRecordById(e.target.value)}
                          >
                            <option value="">Change Date</option>

                            {history.map((rec) => {
                              const key = getRecordKey(rec);
                              return (
                                <option key={key} value={key}>
                                  {new Date(
                                    rec.visitDate || rec.date
                                  ).toLocaleDateString()}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      )}
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
                            {/* Issues Section */}
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-700">
                                Issues
                              </span>
                            </div>

                            {/* Definitions Section  */}
                            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
                              {/* BMI */}
                              {formData.bmiCategory && (
                                <div className="flex flex-col items-start bg-white border border-red-200 rounded-xl shadow-sm p-3">
                                  <div className="text-xs font-medium text-gray-600 mb-1">
                                    {formData.step2Titles?.bmi || "BMI"}
                                  </div>
                                  <label className="flex items-center">
                                    <input
                                      type="checkbox"
                                      checked
                                      readOnly
                                      className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                                    />
                                    <span className="ml-2 text-xs text-gray-800">
                                      {formData.bmiCategory}
                                    </span>
                                  </label>
                                </div>
                              )}

                              {/* Waist */}
                              {formData.getwaistCategory && (
                                <div className="flex flex-col items-start bg-white border border-red-200 rounded-xl shadow-sm p-3">
                                  <div className="text-xs font-medium text-gray-600 mb-1">
                                    {formData.step2Titles?.waist || "Waist"}
                                  </div>
                                  <label className="flex items-center">
                                    <input
                                      type="checkbox"
                                      checked
                                      readOnly
                                      className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                                    />
                                    <span className="ml-2 text-xs text-gray-800">
                                      {formData.getwaistCategory}
                                    </span>
                                  </label>
                                </div>
                              )}

                              {/* Vision */}
                              {formData.visionCategory && (
                                <div className="flex flex-col items-start bg-white border border-red-200 rounded-xl shadow-sm p-3">
                                  <div className="text-xs font-medium text-gray-600 mb-1">
                                    {formData.step2Titles?.vision || "Vision"}
                                  </div>
                                  <label className="flex items-center">
                                    <input
                                      type="checkbox"
                                      checked
                                      readOnly
                                      className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                                    />
                                    <span className="ml-2 text-xs text-gray-800">
                                      {formData.visionCategory}
                                    </span>
                                  </label>
                                </div>
                              )}

                              {/* Diabetes */}
                              {diabetesCategory && (
                                <div className="flex flex-col items-start bg-white border border-red-200 rounded-xl shadow-sm p-3">
                                  <div className="text-xs font-medium text-gray-600 mb-1">
                                    {formData.step2Titles?.diabetes ||
                                      "Diabetes Diagnosis"}
                                  </div>
                                  <label className="flex items-center">
                                    <input
                                      type="checkbox"
                                      checked
                                      readOnly
                                      className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                                    />
                                    <span className="ml-2 text-xs text-gray-800">
                                      {diabetesCategory}
                                    </span>
                                  </label>
                                </div>
                              )}

                              {/* Blood Pressure */}
                              {getHypertensionCategory(
                                formData.systolicBP,
                                formData.diastolicBP
                              ) && (
                                <div className="flex flex-col items-start bg-white border border-red-200 rounded-xl shadow-sm p-3">
                                  <div className="text-xs font-medium text-gray-600 mb-1">
                                    {formData.step2Titles?.bp ||
                                      "Blood Pressure"}
                                  </div>
                                  <label className="flex items-center">
                                    <input
                                      type="checkbox"
                                      checked
                                      readOnly
                                      className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                                    />
                                    <span className="ml-2 text-xs text-gray-800">
                                      {getHypertensionCategory(
                                        formData.systolicBP,
                                        formData.diastolicBP
                                      )}
                                    </span>
                                  </label>
                                </div>
                              )}

                              {/* Alcohol */}
                              {formData.consumeAlcohol && (
                                <div
                                  className={`flex flex-col items-start rounded-xl shadow-sm p-3 mt-2 border font-medium ${
                                    getAlcoholMessageStep4(formData).includes(
                                      "✅"
                                    )
                                      ? "bg-green-50 border-green-300 text-green-700"
                                      : getAlcoholMessageStep4(
                                          formData
                                        ).includes("⚠️")
                                      ? "bg-yellow-50 border-yellow-300 text-yellow-700"
                                      : "bg-red-50 border-red-300 text-red-700"
                                  }`}
                                >
                                  <div className="text-xs font-semibold mb-1 text-gray-700">
                                    Alcohol
                                  </div>
                                  <span className="text-sm">
                                    {getAlcoholMessageStep4(formData)}
                                  </span>
                                </div>
                              )}


                              {/* Smoking */}
                              {formData.smokingHabits && (
                                <div
                                  className={`flex flex-col items-start rounded-xl shadow-sm p-3 mt-2 border font-medium ${
                                    getSmokingMessageStep4(
                                      formData.smokingHabits
                                    ).includes("✅")
                                      ? "bg-green-50 border-green-300 text-green-700"
                                      : getSmokingMessageStep4(
                                          formData.smokingHabits
                                        ).includes("⚠️")
                                      ? "bg-yellow-50 border-yellow-300 text-yellow-700"
                                      : "bg-red-50 border-red-300 text-red-700"
                                  }`}
                                >
                                  <div className="text-xs font-semibold mb-1 text-gray-700">
                                    Smoking
                                  </div>
                                  <span className="text-sm">
                                    {getSmokingMessageStep4(
                                      formData.smokingHabits
                                    )}
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Additional Details*/}
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

                            {/*  Validation Message*/}
                            {errors.currentProblems && (
                              <p className="text-xs text-red-600 flex items-center mt-2">
                                <ExclamationCircleIcon className="w-3 h-3 mr-1" />
                                {errors.currentProblems}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Step 6: Screening Tests*/}
                {currentStep === 6 && (
                  <div className="space-y-4">
                    <h1 className="gap-5 text-xl font-semibold text-gray-800 flex items-center bg-red-50 p-3 rounded-lg border border-red-200">
                      <BeakerIcon className="w-6 h-6 mr-2 text-red-500" />
                      Screening Tests
                      {selectedRecord && (
                        <div className="flex items-center gap-3">
                          <span className="text-sm px-3 py-1 rounded-full bg-white border text-gray-700">
                            {new Date(
                              selectedRecord.visitDate || selectedRecord.date
                            ).toLocaleDateString()}
                          </span>

                          <select
                            className="border rounded-lg px-3 py-1 text-sm"
                            value={selectedRecordId || ""}
                            onChange={(e) => loadRecordById(e.target.value)}
                          >
                            <option value="">Change Date</option>

                            {history.map((rec) => {
                              const key = getRecordKey(rec);
                              return (
                                <option key={key} value={key}>
                                  {new Date(
                                    rec.visitDate || rec.date
                                  ).toLocaleDateString()}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      )}
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
                    <h1 className="gap-5 text-xl font-semibold text-gray-800 flex items-center bg-red-50 p-3 rounded-lg border border-red-200">
                      <CheckCircleIcon className="w-6 h-6 mr-2 text-red-500" />
                      Treatment Plan/Recommendations
                      {selectedRecord && (
                        <div className="flex items-center gap-3">
                          <span className="text-sm px-3 py-1 rounded-full bg-white border text-gray-700">
                            {new Date(
                              selectedRecord.visitDate || selectedRecord.date
                            ).toLocaleDateString()}
                          </span>

                          <select
                            className="border rounded-lg px-3 py-1 text-sm"
                            value={selectedRecordId || ""}
                            onChange={(e) => loadRecordById(e.target.value)}
                          >
                            <option value="">Change Date</option>

                            {history.map((rec) => {
                              const key = getRecordKey(rec);
                              return (
                                <option key={key} value={key}>
                                  {new Date(
                                    rec.visitDate || rec.date
                                  ).toLocaleDateString()}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      )}
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
                    className="relative flex items-center justify-center px-6 py-2.5 border-2 border-red-500 
             text-red-600 font-semibold rounded-xl shadow-sm bg-white
             hover:bg-red-500 hover:text-white hover:shadow-md transition-all duration-300
             active:scale-95 group"
                  >
                    <svg
                      className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:rotate-90"
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
                    <span className="tracking-wide">Cancel</span>
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
                    className="relative flex items-center justify-center px-6 py-2.5 border-2 border-red-500 
             text-red-600 font-semibold rounded-xl shadow-sm bg-red-200
             hover:bg-red-500 hover:text-white hover:shadow-md transition-all duration-300
             active:scale-95 group"
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
        <MedicalHistoryChartModal
          visible={chartModalVisible}
          onClose={closeChartModal}
          history={history}
          fieldName={chartField}
          index={chartIndex}
          goPrev={goPrev}
          goNext={goNext}
        />

        <AppFooter />
      </main>
    </div>
  );
}

export default AddNewPatient;
