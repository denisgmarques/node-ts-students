import EnrollStudent from "./EnrollStudent";
import Student from "./Student";

let enrollStudent = new EnrollStudent();

test("Student Ok", function () {
  let student = new Student("Mary Lee", "358.356.800-15")
  expect(enrollStudent.execute(student));
});

test("Bad CPF", function () {
  let student = new Student("John Way", "123.456.789-99")
  expect(() => enrollStudent.execute(student)).toThrow(new Error("Invalid student CPF"))
});

test("Bad Name", function () {
  let student = new Student("G", "777.740.360-59")
  expect(() => enrollStudent.execute(student)).toThrow(new Error("Invalid student name"))
});

test("Duplicated CPF", function () {
  let student = new Student("John Way Jr", "358.356.800-15")
  expect(() => enrollStudent.execute(student)).toThrow(new Error("CPF 35835680015 already exist"))
});

test("Student Ok", function () {
  let student = new Student("Mia Tommy", "108.008.610-27")
  expect(enrollStudent.execute(student));
});

test("Number of students OK", function () {
  expect(enrollStudent.students.length).toBe(2);
});