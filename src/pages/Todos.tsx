import { useState } from "react";
import useCustomQuery from "../components/hooks/useCustomQuery";
import Paginator from "../components/ui/Paginator";
import Skeleton from "../components/ui/Skeleton";
import { ITodo } from "../interfaces";

  // Handlers
  const TodosPage = () => {
    const userDataString = localStorage.getItem("loggedInUser")
    const userData = userDataString ? JSON.parse(userDataString) : null;
    const [page, setPage] = useState<number>(1);

    const { isLoading, data, isFetching } = useCustomQuery({
      queryKey: [`todos-page-${page}`],
      url: `/todos?pagination[pageSize]=25&pagination[page]=${page}`,
      config: {
        headers: {
          Authorization: `Bearer ${userData?.jwt}`
        }
      }
    })

    // ** Handlers
    const handlePrev = () => {
      setPage(prev => prev - 1)
    }
    const handleNext = () => {
      setPage(prev => prev + 1)
    }

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
      <Paginator
        page={page}
        pageCount={data.meta.pagination.pageCount}
        total={data.meta.pagination.total}
        isLoading={isLoading || isFetching}
        onClickPrev={handlePrev}
        onClickNext={handleNext}
      />
    </>
  );
};

export default TodosPage;
