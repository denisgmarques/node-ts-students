export default class LevelRepository {
  data: any[] = [
    {
        code: "EF1",
        description: "Ensino Fundamental I"
    },
    {
        code: "EF2",
        description: "Ensino Fundamental II"
    },
    {
        code: "EM",
        description: "Ensino Médio"
    }
  ]

  findAll (): any[] {
    return this.data;
  }

  findByCode (code: string): any {
    return this.data.find((level) => {
      level.code === code
    })
  }
}
