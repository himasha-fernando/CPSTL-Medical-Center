import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

// Register Times-Roman font
Font.register({
  family: "Times-Roman",
  src: "https://cdn.jsdelivr.net/npm/react-pdf-renderer/fonts/Times-Roman.ttf",
});

// Create styles
const styles = StyleSheet.create({
  page: {
    fontFamily: "Times-Roman",
    fontSize: 11,
    padding: 30,
    lineHeight: 1.45,
    color: "#111827",
  },
  header: {
    paddingBottom: 8,
    borderBottomWidth: 1.5,
    borderBottomColor: "#e5e7eb",
  },
  brandBar: {
    height: 4,
    width: "100%",
    backgroundColor: "#b91c1c",
    marginBottom: 10,
    borderRadius: 2,
  },
  hospitalName: {
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  hospitalSubtitle: {
    fontSize: 10,
    color: "#6b7280",
    fontStyle: "italic",
    marginTop: 2,
  },
  reportTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#b91c1c",
    textAlign: "center",
    marginVertical: 12,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  cardsGrid: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
    width: "49%",
  },
  cardTitle: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
  },
  mark: {
    width: 6,
    height: 16,
    backgroundColor: "#b91c1c",
    borderRadius: 3,
  },
  row: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 4,
  },
  label: {
    width: 130, 
    fontWeight: "bold",
  },
  value: {
    flex: 1,
  },
  muted: {
    color: "#6b7280",
  },
  chip: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 999,
    fontWeight: "bold",
    fontSize: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  activeChip: {
    color: "#15803d",
    borderColor: "#bbf7d0",
    backgroundColor: "#f0fdf4",
  },
  inactiveChip: {
    color: "#b91c1c",
    borderColor: "#fecaca",
    backgroundColor: "#fef2f2",
  },
  treatmentChip: {
    color: "#1d4ed8",
    borderColor: "#bfdbfe",
    backgroundColor: "#eff6ff",
  },
  footer: {
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  signatureGrid: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  sigBox: {
    textAlign: "center",
    fontSize: 10,
    width: "45%",
  },
  sigLine: {
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    height: 26,
    marginBottom: 6,
  },
  disclaimer: {
    marginTop: 8,
    fontSize: 9,
    color: "#6b7280",
    backgroundColor: "#fafafa",
    padding: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    textAlign: "center",
  },
  meta: {
    textAlign: "center",
    fontSize: 9,
    color: "#6b7280",
    marginTop: 6,
  },
});


const PatientReport = ({ patient }) => {
  const v = (x, fallback = "—") =>
    x !== undefined && x !== null && String(x).trim() !== "" ? x : fallback;

  const calculateAge = (dob) => {
    if (!dob) return "";
    const birthDate = new Date(dob);
    if (isNaN(birthDate.getTime())) return "";
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const age = calculateAge(patient.dateOfBirth);
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const medicalHistoryText =
    (Array.isArray(patient.patientHistory) && patient.patientHistory.length > 0
      ? patient.patientHistory.join(", ")
      : "") +
    (patient.otherPatientConditions
      ? (Array.isArray(patient.patientHistory) &&
        patient.patientHistory.length > 0
          ? ", "
          : "") + patient.otherPatientConditions
      : "");

  const showVitals =
    !!patient.bp ||
    !!patient.rbs ||
    !!patient.fbs ||
    !!patient.visionLeft ||
    !!patient.visionRight;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.brandBar}></View>
          <Text style={styles.hospitalName}>MEDICAL CENTER - CPSTL</Text>
          <Text style={styles.hospitalSubtitle}>
            Comprehensive Healthcare Services
          </Text>
        </View>

        <Text style={styles.reportTitle}>Medical Examination Report</Text>

        <View style={styles.cardsGrid}>
          <View style={styles.card}>
            <View style={styles.cardTitle}>
              <View style={styles.mark}></View>
              <Text>Patient Overview</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Patient Name</Text>
              <Text style={styles.value}>{v(patient.name)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Registration No.</Text>
              <Text style={styles.value}>{v(patient.registrationNo)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>EPF No.</Text>
              <Text style={styles.value}>{v(patient.epfNo)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Status</Text>
              <Text style={styles.value}>
                <Text
                  style={[
                    styles.chip,
                    patient.status === "Deactivate"
                      ? styles.inactiveChip
                      : patient.status === "In treatment"
                      ? styles.treatmentChip
                      : styles.activeChip,
                  ]}
                >
                  {v(patient.status || "Active")}
                </Text>
              </Text>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardTitle}>
              <View style={styles.mark}></View>
              <Text>Demographics</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Date of Birth</Text>
              <Text style={styles.value}>
                {patient.dateOfBirth
                  ? new Date(patient.dateOfBirth).toLocaleDateString()
                  : v(null)}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Age</Text>
              <Text style={styles.value}>{age ? `${age} years` : v(null)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Gender</Text>
              <Text style={styles.value}>{v(patient.gender)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Contact No.</Text>
              <Text style={styles.value}>{v(patient.contactNo)}</Text>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardTitle}>
              <View style={styles.mark}></View>
              <Text>Physical Measurements</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Height</Text>
              <Text style={styles.value}>
                {patient.height
                  ? `${patient.height} cm`
                  : v(null, "Not recorded")}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Weight</Text>
              <Text style={styles.value}>
                {patient.weight
                  ? `${patient.weight} kg`
                  : v(null, "Not recorded")}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>BMI</Text>
              <Text style={styles.value}>
                {patient.bmi || v(null, "Not calculated")}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Waist</Text>
              <Text style={styles.value}>
                {patient.waist
                  ? `${patient.waist} cm`
                  : v(null, "Not recorded")}
              </Text>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardTitle}>
              <View style={styles.mark}></View>
              <Text>Vitals & Laboratory</Text>
            </View>
            {showVitals ? (
              <View>
                {patient.bp && (
                  <View style={styles.row}>
                    <Text style={styles.label}>Blood Pressure</Text>
                    <Text style={styles.value}>{patient.bp} mmHg</Text>
                  </View>
                )}
                {(patient.rbs || patient.fbs) && (
                  <View style={styles.row}>
                    <Text style={styles.label}>RBS / FBS</Text>
                    <Text style={styles.value}>
                      {patient.rbs ? `RBS: ${patient.rbs} mg/dL` : ""}
                      {patient.rbs && patient.fbs ? " / " : ""}
                      {patient.fbs ? `FBS: ${patient.fbs} mg/dL` : ""}
                    </Text>
                  </View>
                )}
                {(patient.visionLeft || patient.visionRight) && (
                  <View style={styles.row}>
                    <Text style={styles.label}>Vision</Text>
                    <Text style={styles.value}>
                      {patient.visionLeft ? `Left: ${patient.visionLeft}` : ""}
                      {patient.visionLeft && patient.visionRight ? " / " : ""}
                      {patient.visionRight
                        ? `Right: ${patient.visionRight}`
                        : ""}
                    </Text>
                  </View>
                )}
              </View>
            ) : (
              <Text style={styles.muted}>
                No recent vitals or lab values recorded.
              </Text>
            )}
          </View>
        </View>

        <View style={{ marginTop: 10 }}>
          <View style={[styles.card, { width: "100%" }]}>
            <View style={styles.cardTitle}>
              <View style={styles.mark}></View>
              <Text>Medical History</Text>
            </View>
            <Text>
              {medicalHistoryText.trim().length > 0
                ? medicalHistoryText
                : v(null, "No significant medical history reported.")}
            </Text>
          </View>
        </View>

        {patient.currentProblems && (
          <View style={{ marginTop: 10 }}>
            <View style={[styles.card, { width: "100%" }]}>
              <View style={styles.cardTitle}>
                <View style={styles.mark}></View>
                <Text>Current Health Problems</Text>
              </View>
              <Text>{patient.currentProblems}</Text>
            </View>
          </View>
        )}

        {patient.treatmentPlan && (
          <View style={{ marginTop: 10 }}>
            <View style={[styles.card, { width: "100%" }]}>
              <View style={styles.cardTitle}>
                <View style={styles.mark}></View>
                <Text>Treatment Plan & Recommendations</Text>
              </View>
              <Text>{patient.treatmentPlan}</Text>
            </View>
          </View>
        )}

        <View style={styles.footer}>
          <View style={styles.signatureGrid}>
            <View style={styles.sigBox}>
              <View style={styles.sigLine}></View>
              <Text>Examining Physician</Text>
              <View style={{ marginTop: 6, fontSize: 9.5 }}>
                <Text>Name: ________________</Text>
                <Text>Date: {currentDate}</Text>
              </View>
            </View>
            <View style={styles.sigBox}>
              <View style={styles.sigLine}></View>
              <Text>Medical Center Doctor</Text>
              <View style={{ marginTop: 6, fontSize: 9.5 }}>
                <Text>Name: ________________</Text>
                <Text>Date: {currentDate}</Text>
              </View>
            </View>
          </View>

          <View style={styles.meta}>
            <Text>
              Report Ref: {patient.registrationNo || "REG"}-{Date.now()} |
              Generated: {currentDate}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default PatientReport;
