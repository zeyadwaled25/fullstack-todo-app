import Button from "./ui/Button"
import Modal from "./ui/Modal";
import Input from "./ui/Input";
import { ChangeEvent, FormEvent, useState } from "react";
import Textarea from "./ui/Textarea";
import { IAddTodo, IErrorResponse, ITodo } from "../interfaces";
import axiosInstance from "../config/axois.config";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { useForm, SubmitHandler } from "react-hook-form";
import Skeleton from "./ui/Skeleton";
import useCustomQuery from "./hooks/useCustomQuery";

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
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [todoToAdd, setTodoToAdd] = useState<IAddTodo>({
    title: "",
    description: ""
  })
  const [isAddSubmitted, setIsAddSubmitted] = useState(false);
  const [queryVersion, setQueryVersion] = useState(0);

  const getAddErrors = () => {
    const errors: { title?: string; description?: string } = {};
    if (!todoToAdd.title) {
      errors.title = "Title is required";
    } else if (todoToAdd.title.length < 3) {
      errors.title = "Title must be at least 3 characters";
    }
    if (!todoToAdd.description) {
      errors.description = "Description is required";
    } else if (todoToAdd.description.length < 5) {
      errors.description = "Description must be at least 5 characters";
    }
    return errors;
  };

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<IFormInput>({
    defaultValues: {
      title: "",
      description: ""
    }
  })

  const { isLoading, data, refetch } = useCustomQuery({
    queryKey: ["todoList", `${queryVersion}`],
    url: "/users/me?populate=todos",
    config: {
      headers: {
        Authorization: `Bearer ${userData?.jwt}`
      }
    }
  })

  if (isLoading) return (
    <div className="space-y-2 p-3">
      {Array.from({ length: 5 }).map((_, index) => <Skeleton key={index} />)}
    </div>
  )

  //  ** Handler
  const onCloseAddModal = () => {
    setIsAddModalOpen(false)
    reset() // Reset form state
    setTodoToAdd({
      title: "",
      description: ""
    })
    setIsAddSubmitted(false)
  }
  const onOpenAddModal = () => {
    setIsAddModalOpen(true)
  }
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
  const closeConfirmModal = () => setIsOpenConfirmModal(false)
  const openConfirmModal = (todo: ITodo) => {
    setTodoToEdit(todo)
    setIsOpenConfirmModal(true)
  }

  const onChangeAddTodoHandler = (
    evt: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = evt.target;
    setTodoToAdd({
      ...todoToAdd,
      [name]: value,
    });
  };
  const removeHandler = async () => {
    setIsSubmitting(true)
    try {
      await axiosInstance.delete(`/todos/${todoToEdit.documentId}`, {
        headers: {
          Authorization: `Bearer ${userData?.jwt}`
        }
      }).then(() => {
        toast.success("Todo removed successfully!", {
          position: 'top-left',
          duration: 2000,
          style: {
            background: '#333',
            color: '#fff',
            width: 'fit-content',
          },
        });
        setQueryVersion(prev => prev + 1)
        closeConfirmModal()
      })
    } catch (error) {
      const errorObj = error as AxiosError<IErrorResponse>
      toast.error(`${errorObj.response?.data.error.message}`, {
        position: 'top-left',
        duration: 2000,
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
  const onSubmitAddTodo = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setIsAddSubmitted(true)

    const errors = getAddErrors();
    // If there are errors, don't submit
    if (errors.title || errors.description) {
      setTimeout(() => {
        setIsSubmitting(false)
      }, 250);
      return;
    }
    
    try {
      await axiosInstance.post(`/todos`, {
        data: {
          title: todoToAdd.title,
          description: todoToAdd.description,
        }
      }, {
        headers: {
          Authorization: `Bearer ${userData?.jwt}`
        }
      }).then(() => {
        toast.success("Todo Added successfully!", {
          position: 'top-left',
          duration: 2000,
          style: {
            background: '#333',
            color: '#fff',
            width: 'fit-content',
          },
        });
        setQueryVersion(prev => prev + 1)
        onCloseAddModal()
        refetch();
      })
    } catch (error) {
      const errorObj = error as AxiosError<IErrorResponse>      
      toast.error(`${errorObj.response?.data.error.message}`, {
        position: 'top-left',
        duration: 2000,
        style: {
          background: '#333',
          color: '#fff',
          width: 'fit-content',
        },
      });
    } finally {
      setIsSubmitting(false)
      setIsAddSubmitted(false)
    }
  }
  const onSubmitEditTodo: SubmitHandler<IFormInput> = async (formData) => {
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
          duration: 2000,
          style: {
            background: '#333',
            color: '#fff',
            width: 'fit-content',
          },
        });
        setQueryVersion(prev => prev + 1)
        onCloseEditModal()
      })
    } catch (error) {
      const errorObj = error as AxiosError<IErrorResponse>      
      toast.error(`${errorObj.response?.data.error.message}`, {
        position: 'top-left',
        duration: 2000,
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
      <div className="w-fit me-auto mb-5">
        <Button size={"sm"} onClick={onOpenAddModal}>Add New Todo</Button>
      </div>
      {data.length ? data.map((todo: ITodo) => (
        <div key={todo.id} className="flex items-center justify-between hover:bg-gray-100 duration-300 p-3 rounded-md even:bg-gray-100">
          <p className="w-full font-semibold">{todo.id} - {todo.title}</p>
          <div className="flex items-center justify-end w-full space-x-3">
            <Button size={"sm"} onClick={() => onOpenEditModal(todo)}>Edit</Button>
            <Button variant={"danger"} size={"sm"} onClick={() => openConfirmModal(todo)}>
              Remove
            </Button>
          </div>
        </div>
      ))
      : <h3 className="text-center text-gray-500">No todos found!</h3>}

      {/* Add Modal */}
      <Modal isOpen={isAddModalOpen} onClose={onCloseAddModal} title="Add a new todo">
        <form onSubmit={onSubmitAddTodo}>
          <div className="space-y-3">
            <div>
              <Input
                name="title"
                value={todoToAdd.title}
                onChange={onChangeAddTodoHandler}
                placeholder="Todo title"
              />
              {isAddSubmitted && (
                <>
                  {(!todoToAdd.title || todoToAdd.title.length < 3) && (
                    <p role="alert" className="text-red-500 text-sm mt-1">
                      {!todoToAdd.title
                        ? "Title is required"
                        : "Title must be at least 3 characters"}
                    </p>
                  )}
                </>
              )}
            </div>
            <div>
              <Textarea
                name="description"
                value={todoToAdd.description}
                onChange={onChangeAddTodoHandler}
                placeholder="Todo description"
              />
              {isAddSubmitted && (
                <>
                  {(!todoToAdd.description || todoToAdd.description.length < 5) && (
                    <p role="alert" className="text-red-500 text-sm mt-1">
                      {!todoToAdd.description
                        ? "Description is required"
                        : "Description must be at least 5 characters"}
                    </p>
                  )}
                </>
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
              {isSubmitting ? "Adding..." : "Add"}
            </Button>
            <Button
              className="mt-4"
              fullWidth
              variant="cancel"
              onClick={onCloseAddModal}
              type="button"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={isEditModalOpen} onClose={onCloseEditModal} title="Edit this todo">
        <form onSubmit={handleSubmit(onSubmitEditTodo)}>
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

      {/* Remove Modal */}
      <Modal isOpen={isOpenConfirmModal} onClose={closeConfirmModal}
        title="Are you sure you want to remove this Todo from your Store?"
        description="Deleting this Todo will remove it permanently from your inventory. Any associated data, sales history, and other related information will also be deleted. Please make sure this is the intended action."
      >
        <div className="flex items-center space-x-3">
          <Button variant={'danger'} onClick={removeHandler} isLoading={isSubmitting}>
            Yes, remove
          </Button>
          <Button variant={'cancel'} onClick={closeConfirmModal}>
            Cancel
          </Button>
        </div>
      </Modal>
    </div>
  )
}

export default TodoList;