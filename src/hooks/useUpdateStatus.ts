import { cloneDeep } from 'lodash';
import { useSnackbar } from 'notistack';
import { KeyedMutator } from 'swr';
import useSWRMutation from 'swr/mutation';
import instance from '../api/axios';
import { GetPostsResponse } from './useGetPosts';
import { useRevalidatePostList } from './useRevalidatePostList';

interface Props {
    mutate?: KeyedMutator<GetPostsResponse | undefined>;
}

const useUpdateStatus = ({ mutate }: Props) => {
    const { revalidateAll } = useRevalidatePostList();
    const { enqueueSnackbar } = useSnackbar();

    const { trigger, ...rest } = useSWRMutation(
        'update-user',
        (_key, { arg }: { arg: { id: string; status: boolean } }) => {
            return instance
                .patch('/posts/' + arg.id, {
                    status: arg.status,
                })
                .then((data) => {
                    enqueueSnackbar({
                        variant: 'success',
                        message: 'Update ' + data.data.title + ' successfully',
                    });
                    return data;
                });
        },
        {
            throwOnError: true,
        },
    );

    const handleUpdateStatus = async ({ id, status }: { status: boolean; id: string }) => {
        try {
            mutate?.(undefined, {
                optimisticData(currentData) {
                    if (!currentData) return undefined;
                    const cloneCurrentData = cloneDeep(currentData);
                    const index = cloneCurrentData.data.findIndex((it) => it.id === id);
                    cloneCurrentData.data[index].status = status;
                    return cloneCurrentData;
                },
                populateCache: false,
                revalidate: false,
            });

            await trigger({ id, status });
        } catch (error) {
            enqueueSnackbar({
                variant: 'error',
                message: 'Update ' + id + ' failed',
            });
        } finally {
            revalidateAll();
        }
    };

    return { trigger, handleUpdateStatus, ...rest };
};

export default useUpdateStatus;
