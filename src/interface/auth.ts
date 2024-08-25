export interface UserRes {
  _id: string;
  name: string;
  email: string;
}

export interface ApiErrorResponse {
  message: string;
  errors: Record<string, string[]>;
}

export interface UserData {
  data: UserRes | null;
  status: string;
  error: ApiErrorResponse | unknown;
}
