export interface IRegisterInput {
  name: "username" | "email" | "password";
  type: string;
  placeholder: string;
  validation: {
    required: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
  };
  errorRequired: string;
  errorValidation: string;
}
export interface ILoginInput {
  name: "identifier" | "password";
  type: string;
  placeholder: string;
  validation: {
    required: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
  };
  errorRequired: string;
  errorValidation: string;
}

export interface IErrorResponse {
  error: {
    message?: string;
  }
}

export interface ITodo {
  id: number;
  documentId: string;
  title: string;
  description?: string;
}
export interface IAddTodo {
  title: string;
  description: string;
}