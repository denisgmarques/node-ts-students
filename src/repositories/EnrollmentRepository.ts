import Student from '../entities/Student';
import ModuleRepository from '../repositories/ModuleRepository';
import ClassRepository from '../repositories/ClassRepository';

export default class EnrollmentRepository {
  moduleRepository: ModuleRepository = new ModuleRepository()
  classRepository: ClassRepository = new ClassRepository()
  data: any[] = []

  findAll (): any[] {
    return this.data;
  }

  findById (id: string): any {
    return this.data.find((enroll) => {
      return enroll.id === id
    })
  }

  findByStudentCpf (cpf: string): any {
    return this.data.find((enroll) => {
      return enroll.student && enroll.student.cpf === cpf
    })
  }

  existByCpf (cpf: string): boolean {
    return this.data.filter((enroll) => {
      return enroll.student.cpf === cpf
    }).length > 0
  }

  count (): number {
    return this.data.length;
  }

  add (enrollment: any) {
    let student = new Student(enrollment.student.name, enrollment.student.cpf, enrollment.student.birthDate)

    // Check minimal age
    let module = this.moduleRepository.findByLevelAndCode(enrollment.level, enrollment.module);

    if (module) {
      if (module.minimumAge > student.age) {
        throw new Error("Should not enroll student below minimum age");
      }
    } else {
      throw new Error("Invalid module");
    }

    // Check class capacity
    let clas = this.classRepository.findByLevelAndModuleAndCode(enrollment.level, enrollment.module, enrollment.class);

    if (clas) {
      if (this.countStudentInTheClass(enrollment) >= clas.capacity) {
        throw new Error("Should not enroll student over class capacity");
      }
    } else {
      console.log(enrollment)
      throw new Error("Invalid class");
    }

    enrollment.student.cpf = student.cpf.value; // extractOnlyDigits
    this.checkDuplicateKey(enrollment);
    enrollment.id = this.generateEnrollmentId(enrollment);
    this.data.push(enrollment);
    console.log(enrollment);
  }

  private checkDuplicateKey (enrollment: any) {
    if (this.existByCpf(enrollment.student.cpf)) {
      throw new Error('Should not enroll duplicated student')
    }
  }

  private zeroPad (num: number, places: number): string {
    return String(num).padStart(places, '0');
  }

  countStudentInTheClass (enrollment: any): number {
    let filter = this.getEnrollmentPrefix(enrollment);
    return this.data.reduce((counter = 0, it) => {
      if (it.id.startsWith(filter)) {
        return ++counter;
      }
    }, 0)
  }

  private getNextSequenceFor (preffix: string) {
    let currentId = 0;
    
    // Get current sequence
    this.data.filter((it) => {
      if (it.id.startsWith(preffix)) {
        let lastPart = /[0-9]{4}$/.exec(it.id)
        if (lastPart) {
          let lastPartAsNumber = Number(lastPart)
          if (lastPartAsNumber > currentId) currentId = lastPartAsNumber;
        }
      }
    })

    currentId ++;
    return this.zeroPad(currentId, 4);
  }

  private getEnrollmentPrefix (enrollment: any): string {
    return `${new Date().getFullYear()}${enrollment.level}${enrollment.module}${enrollment.class}`;
  }

  private generateEnrollmentId (enrollment: any): string {
    return `${this.getEnrollmentPrefix(enrollment)}${this.getNextSequenceFor(this.getEnrollmentPrefix(enrollment))}`;
  }

}
