import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { FormEventHandler, useState } from 'react';
import { faker } from '@faker-js/faker';
import { Link } from 'react-router-dom';

export interface Props {
    btnText?: string;
    isLoading?: boolean;
    onClose?: () => void;
    onSubmit?: (val: string) => void | Promise<void>;
}

const PostForm = ({ btnText, isLoading, onClose, onSubmit }: Props) => {
    const [value, setValue] = useState(faker.book.title());

    const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        if (!value) return;
        onSubmit?.(value);
        onClose?.();
        setValue('');
    };

    return (
        <Box data-testid="form" sx={{ p: 2, width: 300 }}>
            <Typography data-testid="form-title" variant="h5" mb={2}>
                Create new post
            </Typography>
            <form onSubmit={handleSubmit}>
                <Stack gap={2}>
                    <TextField
                        placeholder="Title"
                        size="small"
                        value={value}
                        onChange={(evt) => setValue(evt.target.value)}
                    />
                    <Link to="/how-to-create-new-task">How to create a new task?</Link>
                    <Button data-testid="submit-btn" disabled={isLoading} variant="contained" type="submit">
                        {btnText ?? 'Submit'}
                    </Button>
                </Stack>
            </form>
        </Box>
    );
};

export default PostForm;
