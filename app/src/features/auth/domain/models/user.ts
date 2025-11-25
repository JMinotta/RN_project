export interface User {
  id: number;
  name: string;
  email: string;
  imagepathh?: string | null;
  uuid?: string | null;
}

export class UserEntity {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly email: string,
    public readonly imagepathh?: string | null,
    public readonly uuid?: string | null
  ) {}

  hasImage(): boolean {
    return !!this.imagepathh && this.imagepathh.trim() !== '';
  }

  hasUuid(): boolean {
    return !!this.uuid && this.uuid.trim() !== '';
  }

  getDisplayName(): string {
    return this.name || this.email || 'Usuario';
  }

  getInitials(): string {
    const names = this.name.split(' ').filter(n => n.length > 0);
    if (names.length === 0) return '?';
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  }

  isUninorteEmail(): boolean {
    return this.email.endsWith('@uninorte.edu.co');
  }

  static create(data: {
    id: number;
    name: string;
    email: string;
    imagepathh?: string | null;
    uuid?: string | null;
  }): UserEntity {
    return new UserEntity(
      data.id,
      data.name,
      data.email,
      data.imagepathh,
      data.uuid
    );
  }

  toPlainObject(): User {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      imagepathh: this.imagepathh,
      uuid: this.uuid,
    };
  }
}


const hashStringToInt = (value: string): number => {
  let hash = 0;
  if (!value.length) return hash;
  for (let index = 0; index < value.length; index += 1) {
    const chr = value.charCodeAt(index);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

export const mapToUser = (data: Record<string, any>): User => {
  const idValue = data.id ?? data._id;
  let id = 0;
  let uuid: string | undefined;

  if (typeof idValue === "string") {
    uuid = idValue;
    id = hashStringToInt(idValue);
  } else if (typeof idValue === "number") {
    id = idValue;
  }

  return {
    id,
    uuid: uuid ?? (typeof data.uuid === "string" ? data.uuid : undefined),
    name: (data.name ?? data.nombre ?? "").toString(),
    email: (data.email ?? data.correo ?? "").toString(),
    imagepathh:
      data.avatarUrl ?? data.image ?? data.imagen ?? data.imagepathh ?? null,
  };
};

export const mapUserToJson = (user: User): Record<string, any> => ({
  id: user.uuid ?? user.id,
  name: user.name,
  email: user.email,
  image: user.imagepathh ?? null,
});
