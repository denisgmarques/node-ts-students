import Student from '../entities/Student';
import EnrollmentRepository from './EnrollmentRepository'
import Enrollment from '../entities/Enrollment';

export default class EnrollmentRepositoryMemory implements EnrollmentRepository {

  data: Enrollment[];

  constructor () {
    this.data = [];
  }

  findAll (): Enrollment[] {
    return this.data;
  }

  findByCode (code: string): Enrollment | undefined {
    return this.data.find((enroll) => {
      return enroll.code.value === code
    })
  }

  findByStudentCpf (cpf: string): Enrollment | undefined {
    return this.data.find((enroll) => {
      return enroll.student && enroll.student.cpf.value === cpf
    })
  }

  existByCpf (cpf: string): boolean {
    return this.data.filter((enroll) => {
      return enroll.student.cpf.value === cpf
    }).length > 0
  }

  count (): number {
    return this.data.length;
  }

  add (enrollment: any): void {
    this.data.push(enrollment);
  }

}
