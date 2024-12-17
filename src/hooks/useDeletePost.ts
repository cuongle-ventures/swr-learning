import { useSnackbar } from 'notistack';
import { KeyedMutator } from 'swr';
import instance from '../api/axios';
import { useRevalidatePostList } from './useRevalidatePostList';
import { GetPostsResponse } from './useGetPosts';

interface Props {
    mutate?: KeyedMutator<GetPostsResponse | undefined>;
}

const useDeletePost = ({ mutate }: Props) => {
    const { revalidateAll } = useRevalidatePostList();
    const { enqueueSnackbar } = useSnackbar();

    const handleDeletePost = async (id: string) => {
        try {
            mutate?.(undefined, {
                optimisticData(_currentData, displayedData) {
                    if (!displayedData) return undefined;
                    return {
                        ...displayedData,
                        data: displayedData.data.filter((it) => it.id !== id),
                    };
                },
                populateCache: false,
                revalidate: false,
            });

            await new Promise((resolve, _reject) => {
                setTimeout(() => {
                    const randomErr = Math.floor(Math.random() * 2);
                    if (randomErr === 1 && !import.meta.env.TEST) {
                        return _reject(new Error('Something wrong'));
                    }
                    instance.delete('/posts/' + id).then((data) => {
                        enqueueSnackbar({
                            variant: 'success',
                            message: 'Delete ' + data.data.title + ' successfully',
                        });
                        resolve(data as any);
                    });
                }, 500);
            });
        } catch (error) {
            enqueueSnackbar({
                variant: 'error',
                message: 'Fail to delete item',
            });
        } finally {
            revalidateAll();
        }
    };

    return { handleDeletePost };
};

export default useDeletePost;
