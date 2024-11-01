import useSWR from "swr";
import instance from "../libs/axios";

const useGetPosts = ({ page }: { page: number }) => {
  return useSWR(
    ["/posts/", { page }],
    ([url]) => {
      return instance.get(url, {
        params: {
          _page: page,
          _per_page: 2,
          _sort: "createdAt",
          _order: "desc",
        },
      });
    },
    {
      keepPreviousData: true,
    }
  );
};

export default useGetPosts;
