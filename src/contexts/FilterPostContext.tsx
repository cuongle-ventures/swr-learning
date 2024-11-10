import { createContext, Dispatch, SetStateAction } from 'react';

interface FilterPostContextValue {
    q: string;
    status: string;
    page: number;
    limit: number;
    setStatus: Dispatch<SetStateAction<string>>;
    setQ: Dispatch<SetStateAction<string>>;
    setPage: Dispatch<SetStateAction<number>>;
    setLimit: Dispatch<SetStateAction<number>>;
}

export const FilterPostContext = createContext<FilterPostContextValue>({
    q: '',
    status: 'all',
    page: 0,
    limit: 2,
    setStatus: () => {},
    setQ: () => {},
    setLimit: () => {},
    setPage: () => {},
});
