export default interface EnrollmentRepository {
  findAll (): any[]

  findById (id: string): any

  findByStudentCpf (cpf: string): any

  existByCpf (cpf: string): boolean

  count (): number
  
  add (enrollment: any): void

  countStudentInTheClass (enrollment: any): number
}
