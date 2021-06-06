import ClassRepository from './ClassRepository'

export default class ClassRepositoryMemory implements ClassRepository {
  data: any[] = [
      {
          level: "EM",
          module: "3",
          code: "A",
          capacity: 3,
          start_date: "2021-06-01",
          end_date: "2021-12-15"
      },
      {
        level: "EF1",
        module: "1",
        code: "A",
        capacity: 3,
        start_date: "2021-05-01",
        end_date: "2021-05-30"
      },
      {
        level: "EF1",
        module: "2",
        code: "A",
        capacity: 3,
        start_date: "2021-03-10",
        end_date: "2021-11-30"
      },
      {
        level: "EF2",
        module: "6",
        code: "A",
        capacity: 3,
        start_date: "2021-05-01",
        end_date: "2021-10-30"
      }
  ]

  findAll (): any[] {
    return this.data;
  }

  findByLevelAndModuleAndCode (level: string, module: string, code: string): any {
    return this.data.find((it) => {
      return it.level === level && it.module === module && it.code === code
    })
  }
}
