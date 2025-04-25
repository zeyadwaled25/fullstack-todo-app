import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { useForm, SubmitHandler } from "react-hook-form"

interface IFormInput {
  username: string,
  email: string,
  password: string,
}

const  RegisterPage=()=>{
  const { register, formState: { errors }, handleSubmit } = useForm<IFormInput>()
  const onSubmit: SubmitHandler<IFormInput> = (data) => console.log(data)

  return (
    <div className="max-w-md mx-auto">
      <h2 className="mb-4 text-3xl font-semibold text-center">
        Register to get access!
      </h2>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="username">
          <Input placeholder="Username" {...register("username", {
            required: true,
            minLength: 5,
            maxLength: 50,
          })}
            aria-invalid={errors.username ? "true" : "false"}
          />
          {errors.username?.type === "required" && (
            <p role="alert" className="text-red-500">Username is required.</p>
          )}
          {errors.username?.type === "minLength" && (
            <p role="alert" className="text-red-500">Username Should be at-least 5 characters.</p>
          )}
        </div>
        <div className="email">
          <Input placeholder="Email address" {...register("email", {
              required: true,
              pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            })}
            aria-invalid={errors.email ? "true" : "false"}
          />
          {errors.email?.type === "required" && (
            <p role="alert" className="text-red-500">Email is required.</p>
          )}
          {errors.email?.type === "pattern" && (
            <p role="alert" className="text-red-500">Not valid email.</p>
          )}
        </div>
        <div className="password">
          <Input placeholder="Password" {...register("password", {
            required: true,
            minLength: 6,
          })}
            aria-invalid={errors.password ? "true" : "false"}
          />
          {errors.password?.type === "required" && (
            <p role="alert" className="text-red-500">Password is required.</p>
          )}
          {errors.password?.type === "minLength" && (
            <p role="alert" className="text-red-500">Password Should be at-least 6 characters.</p>
          )}
        </div>

        <Button fullWidth>Register</Button>

      </form>
    </div>
  );
};

export default RegisterPage;
