import Enrollment from "../entities/Enrollment";

export default interface EnrollmentRepository {
  findAll (): Enrollment[]

  findByCode (code: string): Enrollment | undefined

  findByStudentCpf (cpf: string): Enrollment | undefined

  existByCpf (cpf: string): boolean

  count (): number
  
  add (enrollment: any): void
}
