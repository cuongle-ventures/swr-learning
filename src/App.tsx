import { useState } from 'react';
import FilterTable from './components/FilterTable';
import PostTable from './components/PostTable';
import { Container, Card, Stack, Button, Drawer, Typography } from '@mui/material';
import PostForm from './components/PostForm';
import useCreatePost from './hooks/useCreatePost';

const App = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);

    const { trigger, isMutating } = useCreatePost();

    return (
        <>
            <Container maxWidth="lg">
                <Card sx={{ padding: 4 }}>
                    <Typography sx={{ mb: 2, fontSize: 24 }} variant="h1">
                        Tasks
                    </Typography>
                    <Stack direction="row" alignItems="center" mb={2} justifyContent="space-between">
                        <FilterTable />
                        <Button onClick={() => setDrawerOpen(true)} variant="contained">
                            Add new
                        </Button>
                    </Stack>
                    <PostTable />
                </Card>
            </Container>
            <Drawer onClose={() => setDrawerOpen(false)} open={drawerOpen} anchor="right">
                <PostForm
                    isLoading={isMutating}
                    onSubmit={(value) => {
                        trigger({
                            title: value,
                        });
                    }}
                    onClose={() => setDrawerOpen(false)}
                />
            </Drawer>
        </>
    );
};

export default App;
