import { useQuery } from "@tanstack/react-query";
import Button from "./ui/Button"
import axiosInstance from "../config/axois.config";
import useAuthenticatedQuery from "./hooks/useAuthenticatedQuery";

const TodoList = () => {
  const userDataString = localStorage.getItem("loggedInUser")
  const userData = userDataString ? JSON.parse(userDataString) : null;

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

  return (
    <div className="space-y-1">
      {data.length ? data.map((todo) => (
        <div key={todo.id} className="flex items-center justify-between hover:bg-gray-100 duration-300 p-3 rounded-md even:bg-gray-100">
          <p className="w-full font-semibold">1 - {todo.title}</p>
          <div className="flex items-center justify-end w-full space-x-3">
            <Button size={"sm"}>Edit</Button>
            <Button variant={"danger"} size={"sm"}>
              Remove
            </Button>
          </div>
        </div>
      ))
      : <h3 className="text-center text-gray-500">No todos found!</h3>}
    </div>
  )
}

export default TodoList;