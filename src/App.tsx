/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeEvent, FormEventHandler, useState } from "react";
import useGetPosts from "./hooks/useGetPosts";
import useGetPostDetail from "./hooks/useGetPostDetail";
import useCreatePostDetail, { INewPostData } from "./hooks/useCreatePostDetail";

function App() {
  const [page, setPage] = useState(1);
  const [selectedPostId, setSelectedPostId] = useState<string>();
  const { data: posts, isLoading } = useGetPosts({ page });
  const { data: post, isLoading: isLoadingPost } =
    useGetPostDetail(selectedPostId);

  console.log(isLoading, posts?.data.data);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        alignItems: "center",
        maxWidth: 800,
        margin: "auto",
      }}
    >
      <div>
        <PostForm />

        <hr />

        {posts?.data.data.map((item: any) => {
          return (
            <li
              key={item.id}
              onClick={() => {
                setSelectedPostId(item.id);
              }}
            >
              {item.title}
            </li>
          );
        })}
        <div>
          <button
            disabled={page === posts?.data.first}
            onClick={() => setPage(page - 1)}
          >
            prev
          </button>
          <span>{page}</span>
          <button
            disabled={page === posts?.data.last}
            onClick={() => setPage(page + 1)}
          >
            next
          </button>
        </div>
      </div>
      <div>
        <pre>
          {!isLoadingPost ? JSON.stringify(post?.data, null, 4) : "loading"}
        </pre>
      </div>
    </div>
  );
}

const PostForm = () => {
  const [value, setValue] = useState<INewPostData>({
    title: "",
  });

  const { trigger } = useCreatePostDetail();

  const onSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    trigger(value);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue({
      ...value,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form onSubmit={onSubmit}>
      <div>
        <label>Title</label>
        <input name="title" onChange={handleChange} />
      </div>
      <button>submit form</button>
    </form>
  );
};

export default App;
