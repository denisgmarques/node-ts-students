import CpfValidator from "./CpfValidator";

test("Cpf black listed", function () {
    expect(new CpfValidator("00000000000").validate()).toBeFalsy();
});

test("Invalid CPF", function () {
  expect(new CpfValidator("86446422799").validate()).toBeFalsy();
});

test("Valid CPF", function () {
  expect(new CpfValidator("86446422784").validate());
});

test("Valid CPF with mask", function () {
  expect(new CpfValidator("864.464.227-84").validate());
});

test("Valid CPF", function () {
  expect(new CpfValidator("91720489726").validate());
});