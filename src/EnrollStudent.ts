import EnrollmentRepository from './repositories/EnrollmentRepository'

export default class EnrollStudent {
  enrollmentRepository: EnrollmentRepository;

  constructor (enrollmentRepository: EnrollmentRepository) {
    this.enrollmentRepository = enrollmentRepository;
  }

  execute(enrollmentRequest: any): any {
    return this.enrollmentRepository.add(enrollmentRequest);
  }
}