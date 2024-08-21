import { Observation, CodeableConcept, Coding } from 'fhir/r4';

class ObservationBuilder {
  private observation: Partial<Observation>;

  constructor() {
    this.observation = {
      resourceType: "Observation",
      status: "final",
      category: [{
        coding: [{
          system: "http://terminology.hl7.org/CodeSystem/observation-category",
          code: "vital-signs",
          display: "Vital Signs"
        }],
        text: "Vital Signs"
      }],
    };
  }

  setIdentifier(system: string, value: string): ObservationBuilder {
    this.observation.identifier = [{
      system,
      value
    }];
    return this;
  }

  setStatus(status: Observation['status']): ObservationBuilder {
    this.observation.status = status;
    return this;
  }

  addCategory(coding: Coding): ObservationBuilder {
    if (!this.observation.category) {
      this.observation.category = [];
    }
    this.observation.category.push({ coding: [coding] , text: coding.display });
    return this;
  }

  setCodes(codes: Coding[], text?: string): ObservationBuilder {
    this.observation.code = {
      coding: codes,
      text: text || codes[0].display
    };
    return this;
  }

  setSubject(patientId: string | null): ObservationBuilder {
    this.observation.subject = {
      reference: `Patient/${patientId}`
    };
    return this;
  }

  setEffectiveDateTime(date: Date = new Date()): ObservationBuilder {
    this.observation.effectiveDateTime = date.toISOString();
    return this;
  }

  setValue(value: number, unit: string, system: string, code: string): ObservationBuilder {
    this.observation.valueQuantity = {
      value,
      unit,
      system,
      code
    };
    return this;
  }

  setComponent(components: Array<{ code: CodeableConcept, value: number, unit: string, unitCode: string | null }>): ObservationBuilder {
    this.observation.component = components.map(comp => ({
      code: comp.code,
      valueQuantity: {
        value: comp.value,
        unit: comp.unit,
        system: "http://unitsofmeasure.org",
        code: comp.unitCode || comp.unit
      }
    }));
    return this;
  }

  setInterpretation(coding: Coding): ObservationBuilder {
    this.observation.interpretation = [{
      coding: [coding],
      text: coding.display
    }];
    return this;
  }

  setReferenceRange(low: number, high: number, unit: string): ObservationBuilder {
    this.observation.referenceRange = [{
      low: {
        value: low,
        unit: unit,
        system: "http://unitsofmeasure.org",
        code: unit
      },
      high: {
        value: high,
        unit: unit,
        system: "http://unitsofmeasure.org",
        code: unit
      }
    }];
    return this;
  }

  build(): Observation {
    return this.observation as Observation;
  }
}

export default ObservationBuilder;
