import useCustomQuery from "../components/hooks/useCustomQuery";
import Skeleton from "../components/ui/Skeleton";
import { ITodo } from "../interfaces";

  // Handlers
  const TodosPage = () => {
    const userDataString = localStorage.getItem("loggedInUser")
    const userData = userDataString ? JSON.parse(userDataString) : null;

    const { isLoading, data } = useCustomQuery({
      queryKey: ["paginatedTodos",],
      url: "/todos",
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

  return (
    <>
      {data.data.length ? data.data.map((todo: ITodo) => (
        <div key={todo.id} className="flex items-center justify-between hover:bg-gray-100 duration-300 p-3 rounded-md even:bg-gray-100">
          <h3 className="w-full font-semibold">{todo.id} - {todo.title}</h3>
        </div>
      ))
      : <h3 className="text-center text-gray-500">No todos found!</h3>}
    </>
  );
};

export default TodosPage;
