import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { useForm, SubmitHandler } from "react-hook-form"
import { REGISTER_FORM } from "../data";
import axiosInstance from "../config/axois.config";
import toast, { Toaster } from 'react-hot-toast';
import { useState } from "react";
import { AxiosError } from "axios";
import { IErrorResponse } from "../interfaces";

interface IFormInput {
  username: string,
  email: string,
  password: string,
}

const  RegisterPage = () => {
  const [isLoading, setIsLoading] = useState(false)

  // ** Handler
  const { register, formState: { errors }, handleSubmit } = useForm<IFormInput>()
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setIsLoading(true)

    try {
      const {status} = await axiosInstance.post("/auth/local/register", data)
      if (status === 200) {
        toast.success('You will navigate to the login page after 4 seconds to login!', {
          position: 'top-left',
          duration: 4000,
          style: {
            background: '#333',
            color: '#fff',
            width: 'fit-content',
          },
        });
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
    <>
      <div className="max-w-md mx-auto">
        <h2 className="mb-4 text-3xl font-semibold text-center">
          Register to get access!
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          {renderRegisterForm}

          <Button fullWidth isLoading={isLoading}>
            {isLoading ? "Loading..." : "Register"}
          </Button>

        </form>
      </div>
      <Toaster />
    </>
  );
};

export default RegisterPage;
