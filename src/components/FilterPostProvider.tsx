import { FC, PropsWithChildren, useState } from 'react';
import { FilterPostContext } from '../contexts/FilterPostContext';

const FilterPostProvider: FC<PropsWithChildren> = ({ children }) => {
    const [status, setStatus] = useState('all');
    const [q, setQ] = useState('');
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(5);

    return (
        <FilterPostContext.Provider value={{ status, q, page, limit, setStatus, setQ, setPage, setLimit }}>
            {children}
        </FilterPostContext.Provider>
    );
};

export default FilterPostProvider;
