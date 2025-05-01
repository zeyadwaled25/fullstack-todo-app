import Button from "./ui/Button"
import useAuthenticatedQuery from "./hooks/useAuthenticatedQuery";
import Modal from "./ui/Modal";
import Input from "./ui/Input";
import { ChangeEvent, FormEvent, useState } from "react";
import Textarea from "./ui/Textarea";
import { IErrorResponse, ITodo } from "../interfaces";
import axiosInstance from "../config/axois.config";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

const TodoList = () => {
  const userDataString = localStorage.getItem("loggedInUser")
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const [isEditMoadalOpen, setIsEditModalOpen] = useState(false)
  const [todoToEdit, setTodoToEdit] = useState<ITodo>({
    id: 0,
    title: "",
    description: ""
  })

  const { isLoading, data } = useAuthenticatedQuery({
    queryKey: ["todos"],
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
    setTodoToEdit({
      id: 0,
      title: "",
      description: ""
    })
  }
  const onOpenEditModal = (todo: ITodo) => {
    setTodoToEdit(todo)
    setIsEditModalOpen(true)
  }
  const onChangeHandler = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setTodoToEdit((prev) => ({
      ...prev,
      [name]: value
    }))
  }
  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      await axiosInstance.put(`/todos/${todoToEdit.id}`, {
        data: {
          title: todoToEdit.title,
          description: todoToEdit.description
        }
      }, {
        headers: {
          Authorization: `Bearer ${userData?.jwt}`
        }
      }).then(() => {
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
    }
  }

  return (
    <div className="space-y-1">
      {data.length ? data.map((todo: ITodo) => (
        <div key={todo.id} className="flex items-center justify-between hover:bg-gray-100 duration-300 p-3 rounded-md even:bg-gray-100">
          <p className="w-full font-semibold">1 - {todo.title}</p>
          <div className="flex items-center justify-end w-full space-x-3">
            <Button size={"sm"} onClick={() => onOpenEditModal(todo)}>Edit</Button>
            <Button variant={"danger"} size={"sm"}>
              Remove
            </Button>
          </div>
        </div>
      ))
      : <h3 className="text-center text-gray-500">No todos found!</h3>}
      <Modal key={todoToEdit.id} isOpen={isEditMoadalOpen} onClose={onCloseEditModal} title="Edit this todo">
        <form onSubmit={submitHandler}>
          <div className="space-y-3">
            <Input name="title" value={todoToEdit.title} onChange={onChangeHandler} />
            <Textarea name="description" value={todoToEdit.description} onChange={onChangeHandler} />
          </div>
          <div className="flex items-center justify-end w-full space-x-3">
            <Button className="mt-4" fullWidth>Save</Button>
            <Button className="mt-4" fullWidth variant="cancel" onClick={onCloseEditModal}>Cancel</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default TodoList;