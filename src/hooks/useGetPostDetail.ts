import useSWR from "swr";
import instance from "../libs/axios";

const useGetPostDetail = (id?: string) => {
  return useSWR(id ? ["/posts", id] : null, ([url, id]) => {
    return instance.get(url + "/" + id);
  });
};

export default useGetPostDetail;
