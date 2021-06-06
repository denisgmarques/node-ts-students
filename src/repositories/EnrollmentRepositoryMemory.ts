import Student from '../entities/Student';
import ModuleRepository from './ModuleRepositoryMemory';
import ClassRepository from './ClassRepositoryMemory';
import EnrollmentRepository from './EnrollmentRepository'

export default class EnrollmentRepositoryMemory implements EnrollmentRepository {
  moduleRepository: ModuleRepository;
  classRepository: ClassRepository;
  data: any[] = []

  constructor (moduleRepository: ModuleRepository, classRepository: ClassRepository) {
    this.moduleRepository = moduleRepository;
    this.classRepository = classRepository;
  }

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

    // Class Business Rules   
    let clas = this.classRepository.findByLevelAndModuleAndCode(enrollment.level, enrollment.module, enrollment.class);

    if (clas) {
      // Should not enroll after que end of the class
      let today = new Date();
      let startClassDate = new Date(clas.start_date);
      let endClassDate = new Date(clas.end_date);

      if (today > endClassDate) {
        throw new Error("Should not enroll after que end of the class");
      }

      // Should not enroll after 25% of the start of the class
      if (startClassDate < today) {
        let totalDays = this.getDaysFromPeriod(startClassDate, endClassDate);
        let passedDays = this.getDaysFromPeriod(startClassDate, today);

        if (passedDays / totalDays > 0.25) {
          throw new Error("Should not enroll after 25% of the start of the class");
        }
      }

      // Check class capacity
      if (this.countStudentInTheClass(enrollment) >= clas.capacity) {
        throw new Error("Should not enroll student over class capacity");
      }
    } else {
      throw new Error("Invalid class");
    }

    enrollment.student.cpf = student.cpf.value; // extractOnlyDigits
    this.checkDuplicateKey(enrollment);
    enrollment.id = this.generateEnrollmentId(enrollment);
    this.data.push(enrollment);
  }

  private getDaysFromPeriod (start: Date, end: Date) {
    // Take the difference between the dates and divide by milliseconds per day.
    // Round to nearest whole number to deal with DST.
    return Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  }

  private checkDuplicateKey (enrollment: any) {
    if (this.existByCpf(enrollment.student.cpf)) {
      throw new Error('Should not enroll duplicated student')
    }
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
    return new String(currentId).padStart(4, "0");
  }

  private getEnrollmentPrefix (enrollment: any): string {
    return `${new Date().getFullYear()}${enrollment.level}${enrollment.module}${enrollment.class}`;
  }

  private generateEnrollmentId (enrollment: any): string {
    return `${this.getEnrollmentPrefix(enrollment)}${this.getNextSequenceFor(this.getEnrollmentPrefix(enrollment))}`;
  }

}
