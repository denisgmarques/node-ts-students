import Cpf from './types/Cpf'
import Name from './types/Name'

export default class Student {
  name: Name;
  cpf: Cpf;

  constructor (name: string, cpf: string) {
    this.name = new Name(name);
    this.cpf = new Cpf(cpf);
  }
}