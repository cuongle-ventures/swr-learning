import { zodResolver } from '@hookform/resolvers/zod';
import { Button, ButtonOwnProps, Container, Stack, Tab, Tabs, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
    ingredients: z.array(z.object({ name: z.string(), quantity: z.string() })),
    ingredients2: z.array(z.object({ name: z.string(), quantity: z.string() })),
});

const ReactHookForm = () => {
    const form = useForm({
        defaultValues: {
            ingredients: [],
            ingredients2: [],
        },
        resolver: zodResolver(schema),
    });

    const [tab, setTab] = useState(0);

    const { fields, append } = useFieldArray({
        control: form.control,
        name: 'ingredients',
    });

    const { fields: field2, append: append2 } = useFieldArray({
        control: form.control,
        name: 'ingredients2',
    });

    const fieldArr = tab === 0 ? fields : field2;

    const appFunc = tab === 0 ? append : append2;

    const prefix = tab === 0 ? 'ingredients' : 'ingredients2';

    const size: ButtonOwnProps['size'] = 'medium';

    return (
        <FormProvider {...form}>
            <Container maxWidth="sm">
                <form onSubmit={form.handleSubmit((data) => console.log(data))}>
                    <Stack gap={2}>
                        <Tabs value={tab} onChange={(_, value) => setTab(value)}>
                            <Tab label={`Ingredient 1 (${fields.length})`} value={0} />
                            <Tab label={`Ingredient 2 (${field2.length})`} value={1} />
                        </Tabs>
                        {fieldArr.map((field, index) => (
                            <Stack key={field.id} sx={{ display: 'grid', gridTemplateColumns: 'auto 1fr 1fr', gap: 2 }}>
                                <Typography>{index + 1}.</Typography>
                                <TextField size={size} label="Name" {...form.register(`${prefix}.${index}.name`)} />
                                <TextField size={size} label="Name" {...form.register(`${prefix}.${index}.quantity`)} />
                            </Stack>
                        ))}
                        <Stack gap={2}>
                            <Button
                                size={size}
                                variant="outlined"
                                type="button"
                                onClick={() =>
                                    appFunc({
                                        name: '',
                                        quantity: '0',
                                    })
                                }
                            >
                                Add
                            </Button>
                            <Button size={size} variant="contained" type="submit">
                                Submit
                            </Button>
                        </Stack>
                    </Stack>
                </form>
            </Container>
        </FormProvider>
    );
};

export default ReactHookForm;
