import Module from '../entities/Module';

export default interface ModuleRepository {
  findAll (): Module[]

  findByLevelAndCode (level: string, code: string): Module
}