import useSWRMutation from "swr/mutation";
import instance from "../libs/axios";

export interface INewPostData {
  title: string;
}

const useCreatePostDetail = () => {
  return useSWRMutation(
    "/posts",
    (url, { arg }: { arg: INewPostData }) => {
      return instance.post(url, { ...arg, views: 0 });
    },
    {
      onError(err) {
        console.log("Error", err);
      },
      onSuccess(data, key, config) {
        console.log("onSuccess", data, key, config);
      },
    }
  );
};

export default useCreatePostDetail;
