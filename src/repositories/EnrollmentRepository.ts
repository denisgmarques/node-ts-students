export default interface EnrollmentRepository {
  findAll (): any[]

  findByCode (code: string): any

  findByStudentCpf (cpf: string): any

  existByCpf (cpf: string): boolean

  count (): number
  
  add (enrollment: any): void

  countStudentInTheClass (enrollment: any): any
}
