import { validateEmail, validatePasswords } from "../../../src/utilities/validation";

describe('validatePasswords()', () => {
  it('should return true if the passwords are valid and match', () => {
    const newpassword = 'testpass1';
    const confirmPassword = 'testpass1';

    expect(validatePasswords(newpassword, confirmPassword)).toBe(true);
  });

  it('should throw an error if the passwords do not match', () => {
    const newpassword = 'testpass1';
    const confirmPassword = 'testpass2';

    expect(() => validatePasswords(newpassword, confirmPassword)).toThrow('Os campos de senha precisam ser iguais');
  });

  it('should throw an error if the passwords are shorter than 8 characters', () => {
    const newpassword = 'test';
    const confirmPassword = 'test';

    expect(() => validatePasswords(newpassword, confirmPassword)).toThrow('A senha precisa ter no mínimo 8 caracteres');
  });

  it('should throw an error if the passwords do not contain a letter', () => {
    const newpassword = '12345678';
    const confirmPassword = '12345678';

    expect(() => validatePasswords(newpassword, confirmPassword)).toThrow('A senha precisa conter pelo menos uma letra');
  });

  it('should throw an error if the passwords are empty', () => {
    const newpassword = '';
    const confirmPassword = '';

    expect(() => validatePasswords(newpassword, confirmPassword)).toThrow('A senha precisa conter pelo menos uma letra');
  });
  
});

describe('validateEmail()', () => {
  it('should return true if the email is valid', () => {
    const email = 'email@email.com';
    expect(validateEmail(email)).toBe(true);
  });
  
  it('should throw an error if the email is invalid', () => {
    const email = 'email';
    expect(() => validateEmail(email)).toThrow('Email inválido');
  });

  it('should throw an error if the email is empty', () => {
    const email = '';
    expect(() => validateEmail(email)).toThrow('Email requerido');
  });
});