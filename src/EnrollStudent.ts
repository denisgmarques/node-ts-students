import { textChangeRangeIsUnchanged } from "typescript";
import CpfValidator from "./CpfValidator";
import Student from "./Student";

export default class EnrollStudent {
  students: Student[] = [];

  execute(enrollmentRequest: Student) {
    this.validateName(enrollmentRequest.name)
    this.validateCpf(enrollmentRequest.cpf)
    enrollmentRequest.cpf = this.extractDigits(enrollmentRequest.cpf)
    this.duplicateKey(enrollmentRequest)
    this.students.push(enrollmentRequest)
  }

  duplicateKey(student: Student) {
    if (this.students.filter((st) => st.cpf === student.cpf).length > 0) {
      throw new Error(`CPF ${student.cpf} already exist`)
    }
  }

  validateName(name: string) : void {
    if (!/^([A-Za-z]+ )+([A-Za-z])+$/.test(name)) {
      throw new Error("Invalid student name")
    }
  }

  validateCpf(cpf: string) : void {
    if (!new CpfValidator(cpf).validate()) {
      throw new Error("Invalid student CPF")
    }
  }

  extractDigits(cpf: string) {
    return cpf.replace(/\D/g, "");
  }

}