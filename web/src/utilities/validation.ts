/**
   * Validates the passwords. If a password contains no letter, is shorter than 
   * 8 characters or the password and password confirmation do not match, returns 
   * an appropriate error message.
   * @returns true if the passwords are valid, relevant error message otherwise
   */
function validatePasswords(password: string, passwordConfirmation: string) {
  if (!password.match(/[a-zA-Z]/)) {
    // Password needs to contain at least one letter
    throw Error('A senha precisa conter pelo menos uma letra');
  }
  if (password.length < 8) {
    // Password needs to be at least 8 characters long
    throw Error('A senha precisa ter no mínimo 8 caracteres');
  }
  if (password !== passwordConfirmation) {
    // Passwords do not match
    throw Error('Os campos de senha precisam ser iguais');
  }
  return true;
}

/**
   * Checks if the email is valid. If it is not, returns error message.
   * @param email the email to be validated
   * @returns true if the email is valid, relevant error message otherwise
   */
function validateEmail(email: string) {
  if (email.length > 0) {
    if (!(/^[a-z0-9!'#$%&*+\/=?^_`{|}~-]+(?:\.[a-z0-9!'#$%&*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-zA-Z]{2,}$/i).test(email)) {
      throw Error('Email inválido'); //Email is invalid
    }

    return true;
  }
  throw Error('Email requerido'); // Email is required
}

export { validatePasswords, validateEmail }