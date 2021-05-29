import CpfValidator from "../CpfValidator";

export default class Cpf {
  value: string;

  constructor (value: string) {
    this.value = this.validate(value);
  }


  validate(value: string) : string {
    if (!new CpfValidator(value).validate()) {
      throw new Error("Should not enroll without valid student cpf")
    }

    return this.extractDigits(value);
  }

  extractDigits(value: string) {
    return value.replace(/\D/g, "");
  }

}