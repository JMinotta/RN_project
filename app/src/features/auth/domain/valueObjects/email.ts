export class Email {
  private constructor(private readonly value: string) {}

  static create(email: string): Email | null {
    if (!Email.isValid(email)) {
      return null;
    }
    return new Email(email.trim().toLowerCase());
  }

  private static isValid(email: string): boolean {
    if (!email || email.trim() === '') return false;
    
    // Validación básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  toString(): string {
    return this.value;
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }

  getDomain(): string {
    return this.value.split('@')[1];
  }

  isUninorteEmail(): boolean {
    return this.getDomain() === 'uninorte.edu.co';
  }
}
