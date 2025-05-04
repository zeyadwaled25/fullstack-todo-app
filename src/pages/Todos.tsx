import { ChangeEvent, useState } from "react";
import useCustomQuery from "../components/hooks/useCustomQuery";
import Paginator from "../components/ui/Paginator";
import Skeleton from "../components/ui/Skeleton";
import Button from "../components/ui/Button";
import axiosInstance from "../config/axois.config";
import { faker } from '@faker-js/faker';
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { IErrorResponse } from "../interfaces";

  // Handlers
  const TodosPage = () => {
    const userDataString = localStorage.getItem("loggedInUser")
    const userData = userDataString ? JSON.parse(userDataString) : null;
    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [sortBy, setSortBy] = useState<string>("DESC");

    const { isLoading, data, isFetching, refetch } = useCustomQuery({
      queryKey: [`todos-page-${page}`, `${pageSize}`, `${sortBy}`],
      url: `/todos?pagination[pageSize]=${pageSize}&pagination[page]=${page}&sort=createdAt:${sortBy}`,
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
    const onChangePageSize = (e: ChangeEvent<HTMLSelectElement>) => {
      setPageSize(Number(e.target.value))
    }
    const onChangeSortBy = (e: ChangeEvent<HTMLSelectElement>) => {
      setSortBy(e.target.value as 'DESC' | 'ASC')
    }

    const onGenerateTodos = async () => {
      for (let i = 0; i < 100; i++) {
        try {
          await axiosInstance.post(`/todos`, {
            data: {
              title: faker.word.words(3),
              description: faker.lorem.paragraph(),
            }
          }, {
            headers: {
              Authorization: `Bearer ${userData?.jwt}`
            }
          }).then(() => {
            refetch();
          })
        } catch (error) {
          const errorObj = error as AxiosError<IErrorResponse>      
          console.log(errorObj.response?.data.error.message)
        }
      }
      toast.success("All Todos Added successfully!", {
        position: 'top-left',
        duration: 2000,
        style: {
          background: '#333',
          color: '#fff',
          width: 'fit-content',
        },
      });
    }

    if (isLoading) return (
      <div className="space-y-2 p-3">
        {Array.from({ length: 5 }).map((_, index) => <Skeleton key={index} />)}
      </div>
    )
  return (
    <>
      <div className="flex items-center justify-between space-x-2">
        <Button
          size="sm"
          onClick={onGenerateTodos}
          title="Generate 100 records"
        >
          Generate todos
        </Button>
        <div className="flex items-center justify-between space-x-2 text-md">
          <select
            className="border-2 border-indigo-600 rounded-md p-2"
            value={sortBy}
            onChange={onChangeSortBy}
          >
            <option disabled>Sort by</option>
            <option value="ASC">Oldest</option>
            <option value="DESC">Latest</option>
          </select>
          <select
            className="border-2 border-indigo-600 rounded-md p-2"
            value={pageSize}
            onChange={onChangePageSize}
          >
            <option disabled>Page Size</option>
            <option value={10}>10</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>
      <div className="my-10 space-y-2">
        {data.data.length ? (
          data.data.map(
            ({
              id,
              title,
            }: {
              id: number;
              title: string;
            }) => {
              return (
                <div
                  key={id}
                  className="flex items-center justify-between hover:bg-gray-100 duration-300 p-3 rounded-md even:bg-gray-100"
                >
                  <h3 className="w-full font-semibold">
                    {id} - {title}
                  </h3>
                </div>
              );
            }
          )
        ) : (
          <h3>No Todos Yet</h3>
        )}
        <div className="mt-10">
          <Paginator
            isLoading={isLoading || isFetching}
            total={data.meta.pagination.total}
            page={page}
            pageCount={data.meta.pagination.pageCount}
            onClickPrev={handlePrev}
            onClickNext={handleNext}
          />
        </div>
      </div>
    </>
  );
};

export default TodosPage;
