import { useContext, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom";
import useUserController from "../../api/controllers/useUserController";
import { CurrUserContext } from "../../context/CurrUserProvider";
import { CircleLoader } from "../../components/loaders/CircleLoader";
import { Loader } from "../../components/loaders/Loader";
import FragranceCardProfile from "../../components/FragranceCardProfile";

const EmptyCollection = () => {
  return (
    <div className="text-center mt-24">
      <h2 className="text-2xl font-bold mb-6 my-text-medium">
        Your collection is empty. Add a fragrance to your collection.
      </h2>
      <Link
        to="/fragrances"
        className="items-center inline-block px-6 py-2.5 text-xl font-semibold bg-white my-text-primary rounded-lg shadow-md hover:bg-gray-200 transition duration-300"
      >
        Fragrances
      </Link>
    </div>
  );
};

const UserFragrances = () => {
  const { user, isLoading } = useContext(CurrUserContext);
  const { getFragrances } = useUserController();
  const { ref, inView } = useInView();
  const { data, status, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
    //should we do this to prevent getting error pop ups
    ["items", user?.username || ""],
    async ({ queryKey, pageParam = 1 }) => {
      const username = queryKey[1];
      return await getFragrances({ username, pageParam });
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextPage,
      enabled: !!user?.username,
    }
  );

  useEffect(() => {
    if (inView && data?.pages[data.pages.length - 1].nextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView, data]);

  if (isLoading || status === "loading") {
    return <CircleLoader />;
  }

  if (user?.collection.length == 0) return <EmptyCollection />;

  return (
    <section className="bg-gray-50 antialiased py-12 mt-24">
      <div className="mx-auto max-w-screen-xl px-4">
        <h2 className="text-2xl font-bold mb-6 text-center my-text-medium">
          Your collection
        </h2>
        <div className="flex justify-center mb-6">
          <Link
            to="/recommend"
            type="button"
            className="text-white bg-gradient-to-br from-green-400 to-blue-600 
                   hover:bg-gradient-to-bl focus:ring-4 focus:outline-none 
                   focus:ring-green-200 dark:focus:ring-green-800 
                   font-medium rounded-lg text-lg px-8 py-4 text-center"
          >
            Recommend
          </Link>
        </div>
        {data?.pages?.map((page) => (
          <div key={page.currentPage}>
            <div className="mb-4 grid gap-4 sm:grid-cols-2 md:mb-8 lg:grid-cols-3 xl:grid-cols-4 w-full">
              {page.fragrances.map((fragrance) => (
                <div
                  key={fragrance.id}
                  className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm "
                >
                  <FragranceCardProfile
                    id={fragrance.id}
                    image={fragrance.image ? fragrance.image : ""}
                    name={fragrance.name}
                    gender={fragrance.gender}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
        {isFetchingNextPage && (
          <section className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-gray-50 antialiased py-4 w-full flex justify-center items-center z-10">
            <Loader />
          </section>
        )}
        <div ref={ref}></div>
      </div>
    </section>
  );
};

export default UserFragrances;
