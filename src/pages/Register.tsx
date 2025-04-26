import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { useForm, SubmitHandler } from "react-hook-form"
import { REGISTER_FORM } from "../data";

interface IFormInput {
  username: string,
  email: string,
  password: string,
}

const  RegisterPage = () => {
  // ** Handler
  const { register, formState: { errors }, handleSubmit } = useForm<IFormInput>()
  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    console.log(data)

    
  }

  // ** Render
  const renderRegisterForm = REGISTER_FORM.map((input, idx) => (
    <div className={input.name} key={idx}>
      <Input type={input.type} placeholder={input.placeholder} {...register(input.name, input.validation)}
        aria-invalid={errors.username ? "true" : "false"}
      />
      {errors[input.name]?.type === "required" && (
        <p role="alert" className="text-red-500">{input.errorRequired}</p>
      )}
      {errors[input.name]?.type === "minLength" && (
        <p role="alert" className="text-red-500">{input.errorValidation}</p>
      )}
    </div>
  ))

  return (
    <div className="max-w-md mx-auto">
      <h2 className="mb-4 text-3xl font-semibold text-center">
        Register to get access!
      </h2>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {renderRegisterForm}

        <Button fullWidth>Register</Button>

      </form>
    </div>
  );
};

export default RegisterPage;
