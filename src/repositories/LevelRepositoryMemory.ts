import Level from '../entities/Level';
import LevelRepository from './LevelRepository'

export default class LevelRepositoryMemory implements LevelRepository {
  data: Level[] = [
    new Level({
        code: "EF1",
        description: "Ensino Fundamental I"
    }),
    new Level({
        code: "EF2",
        description: "Ensino Fundamental II"
    }),
    new Level({
        code: "EM",
        description: "Ensino Médio"
    })
  ]

  findAll (): Level[] {
    return this.data;
  }

  findByCode (code: string): Level {
    const result = this.data.find((level) => {
      return level.code === code
    });

    if (!result) {
      throw new Error('Invalid level');
    }

    return result;
  }
}
