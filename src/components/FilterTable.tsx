import { MenuItem, Select, Stack } from '@mui/material';
import { useContext } from 'react';
import { FilterPostContext } from '../contexts/FilterPostContext';

const FilterTable = () => {
    const { setStatus, setPage, status } = useContext(FilterPostContext);

    return (
        <Stack flexDirection="row" gap={2}>
            <Select
                sx={{ width: 300 }}
                size="small"
                value={status}
                defaultValue={status}
                onChange={(evt) => {
                    setStatus(evt.target.value);
                    setPage(0);
                }}
            >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="true">Completed</MenuItem>
                <MenuItem value="false">Incomplete</MenuItem>
            </Select>
        </Stack>
    );
};

export default FilterTable;
