export class Password {
  private constructor(private readonly value: string) {}

  static create(password: string): Password | null {
    if (!Password.isValid(password)) {
      return null;
    }
    return new Password(password);
  }

  private static isValid(password: string): boolean {
    if (!password || password.length < 6) return false;
    return true;
  }

  static validate(password: string): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!password || password.trim() === '') {
      errors.push('La contraseña es requerida');
    } else {
      if (password.length < 6) {
        errors.push('La contraseña debe tener al menos 6 caracteres');
      }
      if (password.length > 100) {
        errors.push('La contraseña no puede tener más de 100 caracteres');
      }
      // Podrías agregar más validaciones:
      // - Al menos una mayúscula
      // - Al menos un número
      // - Al menos un carácter especial
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  toString(): string {
    return this.value;
  }

  matches(other: Password): boolean {
    return this.value === other.value;
  }

  // No exponer el valor directamente por seguridad
  getValue(): string {
    return this.value;
  }
}
