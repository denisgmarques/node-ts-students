import EnrollmentRepository from './repositories/EnrollmentRepository'

export default class EnrollStudent {
  enrollmentRepository: EnrollmentRepository = new EnrollmentRepository();

  execute(enrollmentRequest: any) {
    this.store(enrollmentRequest)
  }

  store(enrollmentRequest: any) {
    this.enrollmentRepository.add(enrollmentRequest);
  }
}