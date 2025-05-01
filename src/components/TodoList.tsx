import Button from "./ui/Button"
import useAuthenticatedQuery from "./hooks/useAuthenticatedQuery";
import Modal from "./ui/Modal";
import Input from "./ui/Input";
import { useState } from "react";
import Textarea from "./ui/Textarea";
import { IErrorResponse, ITodo } from "../interfaces";
import axiosInstance from "../config/axois.config";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { useForm, SubmitHandler } from "react-hook-form";

interface IFormInput {
  title: string;
  description: string;
}

const TodoList = () => {
  const userDataString = localStorage.getItem("loggedInUser")
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [todoToEdit, setTodoToEdit] = useState<ITodo>({
    id: 0,
    documentId: "",
    title: "",
    description: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<IFormInput>({
    defaultValues: {
      title: "",
      description: ""
    }
  })

  const { isLoading, data } = useAuthenticatedQuery({
    queryKey: ["todoList", `${todoToEdit.id}`],
    url: "/users/me?populate=todos",
    config: {
      headers: {
        Authorization: `Bearer ${userData?.jwt}`
      }
    }
  })

  if (isLoading) return <h3>Loading...</h3>

  //  ** Handler
  const onCloseEditModal = () => {
    setIsEditModalOpen(false)
    reset() // Reset form state
    setTodoToEdit({
      id: 0,
      documentId: "",
      title: "",
      description: ""
    })
  }
  const onOpenEditModal = (todo: ITodo) => {
    setTodoToEdit(todo)
    setValue("title", todo.title)
    setValue("description", todo.description ?? "")
    setIsEditModalOpen(true)
  }
  const onSubmit: SubmitHandler<IFormInput> = async (formData) => {
    setIsSubmitting(true)
    try {
      await axiosInstance.put(`/todos/${todoToEdit.documentId}`, {
        data: {
          title: formData.title,
          description: formData.description
        }
      }, {
        headers: {
          Authorization: `Bearer ${userData?.jwt}`
        }
      }).then(() => {
        toast.success("Todo updated successfully!", {
          position: 'top-left',
          duration: 4000,
          style: {
            background: '#333',
            color: '#fff',
            width: 'fit-content',
          },
        });
        onCloseEditModal()
      })
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
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-1">
      {data.length ? data.map((todo: ITodo) => (
        <div key={todo.id} className="flex items-center justify-between hover:bg-gray-100 duration-300 p-3 rounded-md even:bg-gray-100">
          <p className="w-full font-semibold">{todo.id} - {todo.title}</p>
          <div className="flex items-center justify-end w-full space-x-3">
            <Button size={"sm"} onClick={() => onOpenEditModal(todo)}>Edit</Button>
            <Button variant={"danger"} size={"sm"}>
              Remove
            </Button>
          </div>
        </div>
      ))
      : <h3 className="text-center text-gray-500">No todos found!</h3>}
      <Modal key={todoToEdit.id} isOpen={isEditModalOpen} onClose={onCloseEditModal} title="Edit this todo">
        <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-3">
            <div>
              <Input 
                {...register("title", { 
                  required: "Title is required",
                  minLength: { 
                    value: 3, 
                    message: "Title must be at least 3 characters" 
                  }
                })}
                placeholder="Todo title"
                aria-invalid={errors.title ? "true" : "false"}
              />
              {errors.title && (
                <p role="alert" className="text-red-500 text-sm mt-1">{errors.title.message}</p>
              )}
            </div>
            <div>
              <Textarea 
                {...register("description", { 
                  required: "Description is required",
                  minLength: { 
                    value: 5, 
                    message: "Description must be at least 5 characters" 
                  }
                })}
                placeholder="Todo description"
                aria-invalid={errors.description ? "true" : "false"}
              />
              {errors.description && (
                <p role="alert" className="text-red-500 text-sm mt-1">{errors.description.message}</p>
              )}
            </div>
          </div>
          <div className="flex items-center justify-end w-full space-x-3">
            <Button 
              className="mt-4" 
              fullWidth 
              type="submit"
              isLoading={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Update"}
            </Button>
            <Button 
              className="mt-4" 
              fullWidth 
              variant="cancel" 
              onClick={onCloseEditModal}
              type="button"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default TodoList;