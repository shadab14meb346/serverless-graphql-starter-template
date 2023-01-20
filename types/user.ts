export interface IUser {
  id?: number;
  email?: string;
  name?: string;
  admin?: boolean;
}

export type UserForJWTGeneration = {
  id: number;
  email: string;
  name: string | null;
  admin: boolean;
};
