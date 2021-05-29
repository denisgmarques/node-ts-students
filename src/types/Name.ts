export default class Name {
  value: string;

  constructor (value: string) {
    this.value = this.validateName(value);
  }

  validateName(value: string) : string {
    if (!/^([A-Za-z]+ )+([A-Za-z])+$/.test(value)) {
      throw new Error("Should not enroll without valid student name")
    }

    return value
  }
}