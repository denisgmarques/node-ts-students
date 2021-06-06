export default interface ClassRepository {
  findAll (): any[]

  findByLevelAndModuleAndCode (level: string, module: string, code: string): any
}