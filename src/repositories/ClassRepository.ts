export default class ClassRepository {
  data: any[] = [
      {
          level: "EM",
          module: "3",
          code: "A",
          capacity: 10
      }
  ]

  findAll (): any[] {
    return this.data;
  }

  findByCode (code: string): any {
    return this.data.find((clas) => {
      clas.code === code
    })
  }
}
