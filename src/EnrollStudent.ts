import Student from "./Student";

export default class EnrollStudent {
  enrollments: any[] = [];

  execute(enrollmentRequest: any) {
    this.store(enrollmentRequest)
  }

  store(enrollmentRequest: any) {
    let student = new Student(enrollmentRequest.student.name, enrollmentRequest.student.cpf)
    this.checkDuplicateKey(student)
    this.enrollments.push(enrollmentRequest)
  }

  checkDuplicateKey(student: Student) {
    if (this.enrollments.find((enroll) => new Student(enroll.student.name, enroll.student.cpf).cpf.value === student.cpf.value)) {
      throw new Error('Should not enroll duplicated student')
    }
  }
}