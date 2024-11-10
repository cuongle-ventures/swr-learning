import { useSWRConfig } from 'swr';

const useRevalidatePostList = () => {
    const { mutate } = useSWRConfig();

    const revalidateAll = () => {
        mutate(
            (key) => {
                if (Array.isArray(key) && (key as string[])[0] === 'post-list') {
                    return true;
                }
                return false;
            },
            undefined,
            {
                revalidate: true,
                populateCache(_result, currentData) {
                    return currentData;
                },
            },
        );
    };

    return { revalidateAll };
};

export default useRevalidatePostList;
