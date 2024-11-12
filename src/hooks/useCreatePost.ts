import useSWRMutation from 'swr/mutation';
import instance from '../api/axios';
import { useRevalidatePostList } from './useRevalidatePostList';
import { useSnackbar } from 'notistack';
import { CREATE_POST } from './keys';

const useCreatePost = () => {
    const { revalidateAll } = useRevalidatePostList();
    const { enqueueSnackbar } = useSnackbar();

    return useSWRMutation(
        CREATE_POST,
        (_key, { arg }: { arg: { title: string } }) => {
            return instance.post('/posts', {
                title: arg.title,
                status: false,
                views: 0,
            });
        },
        {
            onSuccess() {
                enqueueSnackbar({
                    variant: 'success',
                    message: 'Create post successfully',
                });
                revalidateAll();
            },
            onError() {
                console.log('err');
            },
        },
    );
};

export default useCreatePost;
