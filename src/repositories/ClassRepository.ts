export default class ClassRepository {
  data: any[] = [
      {
          level: "EM",
          module: "3",
          code: "A",
          capacity: 3
      },
      {
        level: "EF2",
        module: "6",
        code: "A",
        capacity: 3
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
