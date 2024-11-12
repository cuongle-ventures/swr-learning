import { useSnackbar } from 'notistack';
import { KeyedMutator } from 'swr';
import instance from '../api/axios';
import { useRevalidatePostList } from './useRevalidatePostList';
import { GetPostsResponse } from './useGetPosts';

interface Props {
    mutate: KeyedMutator<GetPostsResponse | undefined>;
}

const useDeletePost = ({ mutate }: Props) => {
    const { revalidateAll } = useRevalidatePostList();
    const { enqueueSnackbar } = useSnackbar();

    const handleDeletePost = async (id: string) => {
        const optimisticData = (currentData: GetPostsResponse | undefined) => {
            if (!currentData) return undefined;
            return {
                ...currentData,
                data: currentData.data.filter((it) => it.id !== id),
            };
        };
        try {
            await mutate(
                new Promise((resolve) => {
                    setTimeout(() => {
                        // const randomErr = Math.floor(Math.random() * 2);
                        // if (randomErr === 1) {
                        //     return reject(new Error('Something wrong'));
                        // }
                        instance.delete('/posts/' + id).then((data) => {
                            enqueueSnackbar({
                                variant: 'success',
                                message: 'Delete ' + data.data.title + ' successfully',
                            });
                            resolve(data as any);
                        });
                    }, 500);
                }),
                {
                    // During calling API
                    optimisticData(currentData) {
                        return optimisticData(currentData);
                    },
                    // After API is done
                    populateCache(_result, currentData) {
                        return optimisticData(currentData);
                    },
                    throwOnError: true,
                    rollbackOnError: true,
                    revalidate: false,
                },
            );
            revalidateAll();
        } catch (error) {
            enqueueSnackbar({
                variant: 'error',
                message: 'Fail to delete item',
            });
        }
    };

    return { handleDeletePost };
};

export default useDeletePost;
