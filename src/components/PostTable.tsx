import {
    Button,
    MenuItem,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableFooter,
    TableHead,
    TablePagination,
    TableRow,
} from '@mui/material';
import useGetPosts from '../hooks/useGetPosts';
import { Post } from '../types';
import { useContext } from 'react';
import { FilterPostContext } from '../contexts/FilterPostContext';
import useUpdateStatus from '../hooks/useUpdateStatus';
import DeleteIcon from '@mui/icons-material/Delete';
import useDeletePost from '../hooks/useDeletePost';

const PostTable = () => {
    const { q, status, page, limit, setPage, setLimit } = useContext(FilterPostContext);
    const { data, mutate } = useGetPosts({
        q,
        status,
        page: page,
        per_page: limit,
    });
    const { handleUpdateStatus } = useUpdateStatus({ mutate });
    const { handleDeletePost } = useDeletePost({ mutate });

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ flex: '20%' }}>ID</TableCell>
                        <TableCell sx={{ flex: '25%' }}>Title</TableCell>
                        <TableCell align="left" sx={{ flex: '5%' }}>
                            Views
                        </TableCell>
                        <TableCell align="left" sx={{ flex: '25%' }}>
                            Status
                        </TableCell>
                        <TableCell align="right">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data?.data?.map((row: Post, index) => (
                        <TableRow
                            data-testid={`table-row-${index}`}
                            key={row.id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {row.id}
                            </TableCell>
                            <TableCell component="th" scope="row">
                                {row.title}
                            </TableCell>

                            <TableCell align="left">{row.views}</TableCell>
                            <TableCell align="left">
                                <Select
                                    size="small"
                                    sx={{ width: 130 }}
                                    value={row.status}
                                    onChange={() =>
                                        handleUpdateStatus({
                                            status: !row.status,
                                            id: row.id,
                                        })
                                    }
                                >
                                    <MenuItem value="true">Completed</MenuItem>
                                    <MenuItem value="false">Incomplete</MenuItem>
                                </Select>
                            </TableCell>
                            <TableCell align="right">
                                <Button onClick={() => handleDeletePost(row.id)} variant="text" color="error">
                                    <DeleteIcon />
                                    Delete
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TablePagination
                            rowsPerPageOptions={[1, 2, 5, 10, 25, { label: 'All', value: -1 }]}
                            count={data?.items ?? 0}
                            rowsPerPage={limit}
                            page={page}
                            slotProps={{
                                select: {
                                    inputProps: {
                                        'aria-label': 'rows per page',
                                    },
                                    native: false,
                                },
                            }}
                            onPageChange={(_e, page) => {
                                setPage(page);
                            }}
                            onRowsPerPageChange={(e) => {
                                setPage(0);
                                setLimit(parseInt(e.target.value));
                            }}
                        />
                    </TableRow>
                </TableFooter>
            </Table>
        </TableContainer>
    );
};

export default PostTable;
