export default interface LevelRepository {
  findAll (): any[]

  findByCode (code: string): any
}