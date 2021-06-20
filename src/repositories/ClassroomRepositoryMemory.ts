import ClassroomRepository from './ClassroomRepository'
import Classroom from '../entities/Classroom';

export default class ClassroomRepositoryMemory implements ClassroomRepository {
  data: Classroom[] = [
    new Classroom({
          level: "EM",
          module: "3",
          code: "A",
          capacity: 3,
          startDate: new Date("2021-06-29"),
          endDate: new Date("2021-12-15")
      }),
      new Classroom({
        level: "EF1",
        module: "1",
        code: "A",
        capacity: 3,
        startDate: new Date("2021-05-18"),
        endDate: new Date("2021-05-30")
      }),
      new Classroom({
        level: "EF1",
        module: "2",
        code: "A",
        capacity: 3,
        startDate: new Date("2021-03-20"),
        endDate: new Date("2021-11-30")
      }),
      new Classroom({
        level: "EF2",
        module: "6",
        code: "A",
        capacity: 1,
        startDate: new Date("2021-05-11"),
        endDate: new Date("2021-10-30")
      })
  ]

  findAll (): Classroom[] {
    return this.data;
  }

  findByLevelAndModuleAndCode (level: string, module: string, code: string): Classroom {
    const result = this.data.find((it) => {
      return it.level === level && it.module === module && it.code === code
    });

    if (!result) {
      throw new Error('Invalid classroom');
    }

    return result;
  }
}
