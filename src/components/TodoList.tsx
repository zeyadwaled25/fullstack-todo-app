import Button from "./ui/Button"
import useAuthenticatedQuery from "./hooks/useAuthenticatedQuery";
import Modal from "./ui/Modal";
import Input from "./ui/Input";
import { useState } from "react";

const TodoList = () => {
  const userDataString = localStorage.getItem("loggedInUser")
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const [isEditMoadalOpen, setIsEditModalOpen] = useState(false)

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

  const onToggleEditModal = () => {
    setIsEditModalOpen(prev => !prev)
  }

  return (
    <div className="space-y-1">
      {data.length ? data.map((todo) => (
        <div key={todo.id} className="flex items-center justify-between hover:bg-gray-100 duration-300 p-3 rounded-md even:bg-gray-100">
          <p className="w-full font-semibold">1 - {todo.title}</p>
          <div className="flex items-center justify-end w-full space-x-3">
            <Button size={"sm"} onClick={onToggleEditModal}>Edit</Button>
            <Button variant={"danger"} size={"sm"}>
              Remove
            </Button>
          </div>
        </div>
      ))
      : <h3 className="text-center text-gray-500">No todos found!</h3>}
      <Modal isOpen={isEditMoadalOpen} onClose={onToggleEditModal} title="Edit this todo">
        <Input placeholder="EDIT TODO"/>
        <div className="flex items-center justify-end w-full space-x-3">
          <Button className="mt-4" fullWidth onClick={onToggleEditModal}>Save</Button>
          <Button className="mt-4" fullWidth variant="cancel" onClick={onToggleEditModal}>Cancel</Button>
        </div>
      </Modal>
    </div>
  )
}

export default TodoList;