import { useSWRConfig } from 'swr';

export const useRevalidatePostList = () => {
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
