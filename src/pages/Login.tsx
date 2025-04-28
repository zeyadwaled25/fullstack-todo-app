import { useState } from "react";
import Input from "../components/ui/Input";
import { LOGIN_FORM } from "../data";
import { SubmitHandler, useForm } from "react-hook-form";
import axiosInstance from "../config/axois.config";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { IErrorResponse } from "../interfaces";
import Button from "../components/ui/Button";

interface IFormInput {
  identifier: string,
  password: string,
}

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false)

  // ** Handler
  const { register, formState: { errors }, handleSubmit } = useForm<IFormInput>()
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setIsLoading(true)

    try {
      const { status, data: resData } = await axiosInstance.post("/auth/local", data)
      if (status === 200) {
        toast.success('You will navigate to the Home page after 2 seconds!', {
          position: 'top-left',
          duration: 1500,
          style: {
            background: '#333',
            color: '#fff',
            width: 'fit-content',
          },
        });

        localStorage.setItem("loggedInUser", JSON.stringify(resData))
        setTimeout(() => {
          location.replace('/')
        }, 2000)
      }
    } catch (error) {
      const errorObj = error as AxiosError<IErrorResponse>      
      toast.error(`${errorObj.response?.data.error.message}`, {
        position: 'top-left',
        duration: 4000,
        style: {
          background: '#333',
          color: '#fff',
          width: 'fit-content',
        },
      });
    } finally {
      setIsLoading(false)
    }
  }

  // ** Render
  const renderLoginForm = LOGIN_FORM.map((input, idx) => (
    <div className={input.name} key={idx}>
      <Input type={input.type} placeholder={input.placeholder} {...register(input.name, input.validation)}
        aria-invalid={errors.identifier ? "true" : "false"}
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
        Login to get access!
      </h2>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {renderLoginForm}

        <Button fullWidth isLoading={isLoading}>
          {isLoading ? "Loading..." : "Login"}
        </Button>
      </form>
    </div>
  );
};

export default LoginPage;
