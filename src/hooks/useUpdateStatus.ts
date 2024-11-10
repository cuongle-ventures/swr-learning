import { useSnackbar } from 'notistack';
import { KeyedMutator } from 'swr';
import instance from '../api/axios';
import useRevalidatePostList from './useRevalidatePostList';
import { GetPostsResponse } from './useGetPosts';
import { cloneDeep } from 'lodash';

interface Props {
    mutate: KeyedMutator<GetPostsResponse | undefined>;
}

const useUpdateStatus = ({ mutate }: Props) => {
    const { revalidateAll } = useRevalidatePostList();
    const { enqueueSnackbar } = useSnackbar();

    const handleUpdateStatus = async ({ id, status }: { status: boolean; id: string }) => {
        const optimisticData = (currentData: GetPostsResponse | undefined) => {
            if (!currentData) return undefined;
            const cloneCurrentData = cloneDeep(currentData);
            const index = cloneCurrentData.data.findIndex((it) => it.id === id);
            cloneCurrentData.data[index].status = status;
            return cloneCurrentData;
        };

        await mutate(
            instance
                .patch('/posts/' + id, {
                    status,
                })
                .then(
                    (data) =>
                        new Promise<any>((resolve) => {
                            setTimeout(() => {
                                enqueueSnackbar({
                                    variant: 'success',
                                    message: 'Update ' + data.data.title + ' successfully',
                                });
                                resolve(data);
                            }, 500);
                        }),
                ),
            {
                // During calling API
                optimisticData(currentData) {
                    return optimisticData(currentData);
                },
                // After API is done
                populateCache(_result, currentData) {
                    return optimisticData(currentData);
                },
                rollbackOnError: true,
                revalidate: false,
            },
        );
        revalidateAll();
    };

    return { handleUpdateStatus };
};

export default useUpdateStatus;
