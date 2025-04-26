import { IRegisterInput } from "../interfaces";

export const REGISTER_FORM: IRegisterInput[] = [
  {
    name: "username",
    type: "text",
    placeholder: "Username",
    validation: {
      required: true,
      minLength: 5,
      maxLength: 50,
    },
    errorRequired: "Username is required.",
    errorValidation: "Username should be at least 5 characters.",
  },
  {
    name: "email",
    type: "email",
    placeholder: "Email address",
    validation: {
      required: true,
      pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    },
    errorRequired: "Email is required.",
    errorValidation: "Not a valid email.",
  },
  {
    name: "password",
    type: "password",
    placeholder: "Password",
    validation: {
      required: true,
      minLength: 6,
    },
    errorRequired: "Password is required.",
    errorValidation: "Password should be at least 6 characters.",
  },
]