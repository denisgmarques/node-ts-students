import Student from '../entities/Student';
import LevelRepository from './LevelRepository';
import ModuleRepository from './ModuleRepository';
import ClassroomRepository from './ClassroomRepository';
import EnrollmentRepository from './EnrollmentRepository'
import Enrollment from '../entities/Enrollment';

export default class EnrollmentRepositoryMemory implements EnrollmentRepository {
  levelRepository: LevelRepository;
  moduleRepository: ModuleRepository;
  classroomRepository: ClassroomRepository;
  data: Enrollment[] = []

  constructor (levelRepository: LevelRepository, moduleRepository: ModuleRepository, classroomRepository: ClassroomRepository) {
    this.levelRepository = levelRepository;
    this.moduleRepository = moduleRepository;
    this.classroomRepository = classroomRepository;
  }

  findAll (): Enrollment[] {
    return this.data;
  }

  findByCode (code: string): Enrollment | undefined {
    return this.data.find((enroll) => {
      return enroll.code.value === code
    })
  }

  findByStudentCpf (cpf: string): Enrollment | undefined {
    return this.data.find((enroll) => {
      return enroll.student && enroll.student.cpf.value === cpf
    })
  }

  existByCpf (cpf: string): boolean {
    return this.data.filter((enroll) => {
      return enroll.student.cpf.value === cpf
    }).length > 0
  }

  count (): number {
    return this.data.length;
  }

  add (enrollmentRequest: any): any {
    let student = new Student(enrollmentRequest.student.name, enrollmentRequest.student.cpf, enrollmentRequest.student.birthDate);

    let level = this.levelRepository.findByCode(enrollmentRequest.level);
    let module = this.moduleRepository.findByLevelAndCode(enrollmentRequest.level, enrollmentRequest.module);
    let classroom = this.classroomRepository.findByLevelAndModuleAndCode(enrollmentRequest.level, enrollmentRequest.module, enrollmentRequest.classroom);

    // Check class capacity
    const classCount = this.countStudentInTheClass(enrollmentRequest);

    // Instantiate Enrollment entity
    const issueDate = new Date();
    let enrollment = new Enrollment(student, level, module, classroom, enrollmentRequest.installments, issueDate, classCount + 1);

    if (classCount >= classroom.capacity) {
      throw new Error("Should not enroll student over class capacity");
    }

    // Check existing enrollment (The same CPF)
    this.checkDuplicateKey(enrollment);
   
    this.data.push(enrollment);

    return enrollment;
  }

  private checkDuplicateKey (enrollment: Enrollment) {
    if (this.existByCpf(enrollment.student.cpf.value)) {
      throw new Error('Should not enroll duplicated student')
    }
  }

  countStudentInTheClass (enrollmentRequest: any): any {
    let filter = `${new Date().getFullYear()}${enrollmentRequest.level}${enrollmentRequest.module}${enrollmentRequest.classroom}`;
    return this.data.reduce((counter = 0, it) => {
      if (it.code.value.startsWith(filter)) {
        return ++counter;
      }
    }, 0) || 0; // TODO - Não sei pq retorna undefined as vezes
  }
}
