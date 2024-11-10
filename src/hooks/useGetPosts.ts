import useSWR from 'swr';
import instance from '../api/axios';
import { Post } from '../types';

export interface GetPostsProps {
    q?: string;
    status?: string;
    page: number;
    per_page: number;
}

export interface GetPostsResponse {
    data: Post[];
    first: number;
    last: number;
    items: number;
    pages: number;
    next: string;
    prev: string;
}

const useGetPosts = (props: GetPostsProps) => {
    return useSWR<GetPostsResponse | undefined>(
        useGetPosts.getKey(props),
        () => {
            const cloneParams: any = {
                _page: props.page + 1,
                _per_page: props.per_page,
            };

            if (props.q) {
                cloneParams['title_like'] = props.q;
            }

            if (props.status && props.status !== 'all') {
                cloneParams['status'] = props.status;
            }

            return instance
                .get('/posts', {
                    params: cloneParams,
                })
                .then((data) => data.data);
        },
        {
            keepPreviousData: true,
            revalidateOnFocus: false,
            dedupingInterval: 30000000,
        },
    );
};

useGetPosts.getKey = (params?: any) => (params ? ['post-list', params] : ['post-list']);

export default useGetPosts;
