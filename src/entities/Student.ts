import Cpf from '../types/Cpf'
import Name from '../types/Name'

export default class Student {
  name: Name;
  cpf: Cpf;
  birthDate: Date;
  private _age: number;

  constructor (name: string, cpf: string, birthDate: string) {
    this.name = new Name(name);
    this.cpf = new Cpf(cpf);
    this.birthDate = new Date(birthDate);
    this._age = this._calculateAge();
  }

  get age () {
    return this._age;
  }

  private _calculateAge () {
    var ageDifMs = Date.now() - this.birthDate.getTime();
    var ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }
}