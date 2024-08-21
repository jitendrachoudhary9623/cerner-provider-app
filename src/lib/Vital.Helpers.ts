import { Observation } from 'fhir/r4';
import ObservationBuilder from './ObservationBuilder';

export function createHeartRateObservation(patientId: string | null, value: number, date: Date = new Date()): Observation {
  return new ObservationBuilder()
    .setStatus("final")
    .addCategory({
      system: "http://loinc.org",
      code: "8867-4",
      display: "Heart rate"
    })
    .setCodes([{
      system: "http://loinc.org",
      code: "8867-4",
      display: "Heart rate"
    }])
    .setSubject(patientId)
    .setEffectiveDateTime(date)
    .setValue(value, "beats/minute", "http://unitsofmeasure.org", "/min")
    .build();
}

// export function createBloodPressureObservation(patientId: string | null, systolic: number, diastolic: number, date: Date = new Date()): Observation {
//   return new ObservationBuilder()
//     .setStatus("final")
//     .addCategory({
//       system: "http://loinc.org",
//       code: "85354-9",
//       display: "Blood pressure panel with all children optional"
//     })
//     .setCodes([{
//       system: "http://loinc.org",
//       code: "85354-9",
//       display: "Blood pressure panel with all children optional"
//     }])
//     .setSubject(patientId)
//     .setEffectiveDateTime(date)
//     .setComponent([
//       {
//         code: {
//           coding: [{
//             system: "http://loinc.org",
//             code: "8480-6",
//             display: "Systolic blood pressure"
//           }]
//         },
//         value: systolic,
//         unit: "mm[Hg]"
//       },
//       {
//         code: {
//           coding: [{
//             system: "http://loinc.org",
//             code: "8462-4",
//             display: "Diastolic blood pressure"
//           }]
//         },
//         value: diastolic,
//         unit: "mm[Hg]"
//       }
//     ])
//     .build();
// }

export function createBodyTemperatureObservation(patientId: string | null, value: number, date: Date = new Date()): Observation {
  return new ObservationBuilder()
    .setStatus("final")
    .setCodes([
      {
        system: "http://loinc.org",
        code: "8331-1"
      }
    ], "Temperature Oral")
    .setSubject(patientId)
    .setEffectiveDateTime(date)
    .setValue(value, "degC", "http://unitsofmeasure.org", "Cel")
    .build();
}

export function createRespiratoryRateObservation(patientId: string | null, value: number, date: Date = new Date()): Observation {
  return new ObservationBuilder()
    .setStatus("final")
    .setCodes([{
      "system": "http://loinc.org",
      "code": "9279-1",
      display: "Respiratory Rate"
    }])
    .setSubject(patientId)
    .setEffectiveDateTime(date)
    .setValue(value, "breaths/minute", "http://unitsofmeasure.org", "min")
    .build();
}

export function createBodyWeight(patientId: string | null, value: number, date: Date = new Date()): Observation {
  return new ObservationBuilder()
    .setStatus("final")
    .setCodes([
      {
        "system": "http://loinc.org",
        "code": "29463-7",
        "display": "Body weight"
      },
      {
        "system": "http://loinc.org",
        "code": "3141-9",
        "display": "Body weight Measured"
      }
    ], "Weight Measured")
    .setSubject(patientId)
    .setEffectiveDateTime(date)
    .setValue(value, "kg", "http://unitsofmeasure.org", "kg")
    .build();
}

export function createBMI(patientId: string | null, value: number, date: Date = new Date()): Observation {
  return new ObservationBuilder()
    .setStatus("final")
    .setCodes([
      {
        system: "http://loinc.org",
        code: "39156-5",
        display: "Body mass index (BMI) [Ratio]"
      }
    ])
    .setSubject(patientId)
    .setEffectiveDateTime(date)
    .setValue(value, "kg/m2", "http://unitsofmeasure.org", "kg/m2")
    .build();
}

export function createOxygenSaturationObservation(patientId: string | null, value: number, date: Date = new Date()): Observation {
  return new ObservationBuilder()
    .setStatus("final")
    .addCategory({
      system: "http://loinc.org",
      code: "2708-6",
      display: "Oxygen saturation in Arterial blood"
    })
    .setCodes([
      {
        system: "http://loinc.org",
        code: "59408-5",
        display: "Oxygen saturation in Arterial blood by Pulse oximetry"
      },
      {
        system: "urn:iso:std:iso:11073:10101",
        code: "150456",
        display: "MDC_PULS_OXIM_SAT_O2"
      }
    ])
    .setSubject(patientId)
    .setEffectiveDateTime(date)
    .setValue(value, "%", "http://unitsofmeasure.org", "%")
    .setReferenceRange(90, 99, "%")
    .build();
}

export function createBloodPressureObservation(patientId: string | null, systolic: number, diastolic: number, date: Date = new Date()): Observation {
  return new ObservationBuilder()
    .setStatus("final")
    .setCodes([{
      system: "http://loinc.org",
      code: "85354-9",
      display: "Blood pressure panel with all children optional"
    }], "Blood pressure systolic & diastolic")
    .setSubject(patientId)
    .setEffectiveDateTime(date)
    .setComponent([
      {
        code: {
          coding: [
            {
              system: "http://loinc.org",
              code: "8480-6",
              display: "Systolic blood pressure"
            },
            {
              system: "http://snomed.info/sct",
              code: "271649006",
              display: "Systolic blood pressure"
            }
          ],

        },
        unitCode: "mm[Hg]",
        value: systolic,
        unit: "mmHg"
      },
      {
        code: {
          coding: [
            {
              system: "http://loinc.org",
              code: "8462-4",
              display: "Diastolic blood pressure"
            }
          ]
        },
        unitCode: "mm[Hg]",
        value: diastolic,
        unit: "mmHg"
      }
    ])
    .build();
}

function getSystolicInterpretationCode(systolic: number): string {
  if (systolic < 90) return "L";
  if (systolic > 140) return "H";
  return "N";
}

function getSystolicInterpretationDisplay(systolic: number): string {
  if (systolic < 90) return "low";
  if (systolic > 140) return "high";
  return "normal";
}

function getSystolicInterpretationText(systolic: number): string {
  if (systolic < 90) return "Below normal";
  if (systolic > 140) return "Above normal";
  return "Normal";
}

function getDiastolicInterpretationCode(diastolic: number): string {
  if (diastolic < 60) return "L";
  if (diastolic > 90) return "H";
  return "N";
}

function getDiastolicInterpretationDisplay(diastolic: number): string {
  if (diastolic < 60) return "low";
  if (diastolic > 90) return "high";
  return "normal";
}

function getDiastolicInterpretationText(diastolic: number): string {
  if (diastolic < 60) return "Below normal";
  if (diastolic > 90) return "Above normal";
  return "Normal";
}

function getOverallInterpretationCode(systolic: number, diastolic: number): string {
  if (systolic < 90 || diastolic < 60) return "L";
  if (systolic > 140 || diastolic > 90) return "H";
  return "N";
}

function getOverallInterpretationDisplay(systolic: number, diastolic: number): string {
  if (systolic < 90 || diastolic < 60) return "low";
  if (systolic > 140 || diastolic > 90) return "high";
  return "normal";
}