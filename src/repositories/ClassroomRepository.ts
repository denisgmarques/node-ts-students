import Classroom from '../entities/Classroom';

export default interface ClassroomRepository {
  findAll (): Classroom[]

  findByLevelAndModuleAndCode (level: string, module: string, code: string): Classroom
}