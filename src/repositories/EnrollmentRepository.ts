import Student from "../entities/Student";

export default class EnrollmentRepository {
  data: any[] = []

  findAll (): any[] {
    return this.data;
  }

  findByStudentCpf (cpf: string): any {
    return this.data.find((enroll) => {
      enroll.student && enroll.student.cpf === cpf
    })
  }

  existByCpf (cpf: string): boolean {
    return this.data.filter((enroll) => {
      return enroll.student.cpf === cpf
    }).length > 0
  }

  count (): number {
    return this.data.length;
  }

  add (enrollment: any) {
    let student = new Student(enrollment.student.name, enrollment.student.cpf, enrollment.student.birthDate)
    enrollment.student.cpf = student.cpf.value; // extractOnlyDigits
    this.checkDuplicateKey(enrollment);
    this.data.push(enrollment);
  }

  private checkDuplicateKey(enrollment: any) {
    if (this.existByCpf(enrollment.student.cpf)) {
      throw new Error('Should not enroll duplicated student')
    }
  }

}
