export default interface ModuleRepository {
  findAll (): any[]

  findByLevelAndCode (level: string, code: string): any
}