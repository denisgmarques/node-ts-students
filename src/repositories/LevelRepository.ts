import Level from '../entities/Level';

export default interface LevelRepository {
  findAll (): Level[]

  findByCode (code: string): Level
}