import { zodResolver } from '@hookform/resolvers/zod';
import { Edit } from '@mui/icons-material';
import { Button, ButtonOwnProps, Container, IconButton, Stack, Tab, Tabs, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
    ingredients: z.array(
        z.object({ name: z.string(), quantity: z.string(), is_deleted: z.boolean(), id: z.number().nullish() }),
    ),
    ingredients2: z.array(
        z.object({ name: z.string(), quantity: z.string(), is_deleted: z.boolean(), id: z.number().nullish() }),
    ),
});

const ReactHookForm = () => {
    const form = useForm({
        defaultValues: {
            ingredients: [
                {
                    id: 1,
                    name: 'Apple',
                    quantity: '1',
                    is_deleted: false,
                },
                {
                    id: 2,
                    name: 'Banana',
                    quantity: '2',
                    is_deleted: false,
                },
            ],
            ingredients2: [],
        },
        resolver: zodResolver(schema),
    });

    const [tab, setTab] = useState(0);

    const { fields, append, update, remove } = useFieldArray({
        control: form.control,
        name: 'ingredients',
        keyName: 'key',
    });

    const {
        fields: field2,
        append: append2,
        update: update2,
        remove: remove2,
    } = useFieldArray({
        control: form.control,
        name: 'ingredients2',
        keyName: 'key',
    });

    const fieldArr = tab === 0 ? fields : field2;

    const appFunc = tab === 0 ? append : append2;
    const updateFunc = tab === 0 ? update : update2;
    const removeFunc = tab === 0 ? remove : remove2;

    const prefix = tab === 0 ? 'ingredients' : 'ingredients2';

    const size: ButtonOwnProps['size'] = 'medium';

    const findIndex = (key: string) => fieldArr.findIndex((it) => it.key === key);

    console.log('fieldArr', fieldArr);

    return (
        <FormProvider {...form}>
            <Container maxWidth="lg">
                <form onSubmit={form.handleSubmit((data) => console.table(data.ingredients))}>
                    <Stack gap={2}>
                        <Tabs value={tab} onChange={(_, value) => setTab(value)}>
                            <Tab label={`Ingredient 1 (${fields.length})`} value={0} />
                            <Tab label={`Ingredient 2 (${field2.length})`} value={1} />
                        </Tabs>
                        {fieldArr
                            .filter((it) => !it.is_deleted)
                            .map((field, index) => {
                                const frmIndex = findIndex(field.key);
                                return (
                                    <Stack
                                        key={field.key}
                                        sx={{ display: 'grid', gridTemplateColumns: 'auto 1fr 1fr auto', gap: 2 }}
                                    >
                                        <Typography>{index}.</Typography>
                                        <TextField
                                            size={size}
                                            label="Name"
                                            {...form.register(`${prefix}.${frmIndex}.name`)}
                                        />
                                        <TextField
                                            size={size}
                                            label="Name"
                                            slotProps={{
                                                input: {},
                                            }}
                                            {...form.register(`${prefix}.${frmIndex}.quantity`)}
                                        />
                                        <IconButton
                                            onClick={() => {
                                                const index = findIndex(field.key);
                                                if (fieldArr[index].id) {
                                                    return updateFunc(index, { ...field, is_deleted: true });
                                                }
                                                removeFunc(index);
                                            }}
                                        >
                                            <Edit />
                                        </IconButton>
                                    </Stack>
                                );
                            })}
                        <Stack gap={2}>
                            <Button
                                size={size}
                                variant="outlined"
                                type="button"
                                onClick={() =>
                                    appFunc({
                                        name: '',
                                        quantity: '0',
                                        is_deleted: false,
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
