import { fireEvent, getByPlaceholderText, render, screen, waitFor, within } from '@testing-library/react';
import App from './App';
import MockAdapter from 'axios-mock-adapter';
import instance from './api/axios';
import { SWRConfig } from 'swr';
import FilterPostProvider from './components/FilterPostProvider';
import { MemoryRouter } from 'react-router-dom';
import { act } from 'react';

let axiosMock: MockAdapter;

const { revalidateAllFn } = vi.hoisted(() => {
    return { revalidateAllFn: vi.fn() };
});

describe('App', () => {
    beforeEach(() => {
        axiosMock = new MockAdapter(instance);
    });

    afterEach(() => {
        axiosMock.restore();
        vi.resetAllMocks();
    });

    it('should render in the document', () => {
        render(<App />);

        const headingEl = screen.getByRole('heading', { name: 'Tasks' });
        const btnAddEl = screen.getByRole('button', { name: 'Add new' });
        const tableEl = screen.getByRole('table');

        expect(btnAddEl).toBeInTheDocument();
        expect(headingEl).toBeInTheDocument();
        expect(tableEl).toBeInTheDocument();
    });

    it('should render list item in the document', async () => {
        axiosMock.onGet('/posts').reply(200, {
            first: 1,
            prev: null,
            next: 2,
            last: 4,
            pages: 4,
            items: 16,
            data: [
                {
                    id: '1',
                    title: 'Title 1',
                    status: false,
                    views: 0,
                },
            ],
        });
        render(
            <SWRConfig value={{ provider: () => new Map() }}>
                <App />
            </SWRConfig>,
        );
        const rowItem = await screen.findByTestId('table-row-0');
        expect(rowItem).toBeInTheDocument();
    });

    it('should render all items in the document', async () => {
        axiosMock.onGet('/posts').reply(200, {
            first: 1,
            prev: null,
            next: null,
            last: 1,
            pages: 1,
            items: 2,
            data: [
                {
                    id: '1',
                    title: 'Title 1',
                    status: false,
                    views: 0,
                },
                {
                    id: '2',
                    title: 'Title 2',
                    status: false,
                    views: 0,
                },
            ],
        });

        render(
            <SWRConfig value={{ provider: () => new Map() }}>
                <App />
            </SWRConfig>,
        );

        const rowItems = await screen.findAllByTestId(/^table-row/i);
        expect(rowItems).toHaveLength(2);
    });

    describe('FilterTable', () => {
        it('should request filter status `true` when users change filter select', async () => {
            axiosMock.onGet('/posts').reply(200, {
                first: 1,
                prev: null,
                next: null,
                last: 1,
                pages: 1,
                items: 2,
                data: [
                    {
                        id: '2',
                        title: 'Title 2',
                        status: false,
                        views: 0,
                    },
                ],
            });

            const { getByTestId, getByRole } = render(
                <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                    <FilterPostProvider>
                        <SWRConfig value={{ provider: () => new Map() }}>
                            <App />
                        </SWRConfig>
                    </FilterPostProvider>
                </MemoryRouter>,
            );

            await waitFor(() => getByTestId(/table-row-/));

            const selectEl = within(getByTestId('filter-table')).getByRole('combobox');

            fireEvent.mouseDown(selectEl);

            const listbox = within(getByRole('listbox'));

            const completedOption = listbox.getByRole('option', { name: 'Completed' });

            fireEvent.click(completedOption);

            const btnEl = getByRole('button', { name: /Add new/i });

            fireEvent.click(btnEl);

            await waitFor(() => {
                expect(axiosMock.history.get.length).to.be.eq(2);
                expect(axiosMock.history.get[1].params).toEqual({ _page: 1, _per_page: 5, status: 'true' });
            });
        });

        it('should request filter status `false` when users change filter select', async () => {
            axiosMock.onGet('/posts').reply(200, {
                first: 1,
                prev: null,
                next: null,
                last: 1,
                pages: 1,
                items: 2,
                data: [
                    {
                        id: '2',
                        title: 'Title 2',
                        status: false,
                        views: 0,
                    },
                ],
            });

            const { getByTestId, getByRole } = render(
                <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                    <FilterPostProvider>
                        <SWRConfig value={{ provider: () => new Map() }}>
                            <App />
                        </SWRConfig>
                    </FilterPostProvider>
                </MemoryRouter>,
            );

            await waitFor(() => getByTestId(/table-row-/));

            const selectEl = within(getByTestId('filter-table')).getByRole('combobox');

            fireEvent.mouseDown(selectEl);

            const listbox = within(getByRole('listbox'));

            const incomleteOption = listbox.getByRole('option', { name: 'Incomplete' });

            fireEvent.click(incomleteOption);

            const btnEl = getByRole('button', { name: /Add new/i });

            fireEvent.click(btnEl);

            await waitFor(() => {
                expect(axiosMock.history.get.length).to.be.eq(2);
                expect(axiosMock.history.get[1].params).toEqual({ _page: 1, _per_page: 5, status: 'false' });
            });
        });
    });

    it('should send DELETE request when users click on Button Delete', async () => {
        axiosMock.onGet('/posts').reply(200, {
            first: 1,
            prev: null,
            next: null,
            last: 1,
            pages: 1,
            items: 2,
            data: [
                {
                    id: '2',
                    title: 'Title 2',
                    status: false,
                    views: 0,
                },
            ],
        });
        axiosMock.onDelete(/\/posts\//).reply(200, {
            data: {
                title: 'Hello world',
            },
        });
        vi.mock('./hooks/useRevalidatePostList', () => {
            return {
                useRevalidatePostList: () => ({ revalidateAll: revalidateAllFn }),
            };
        });
        const { getByTestId, getByRole } = render(
            <SWRConfig value={{ provider: () => new Map() }}>
                <App />
            </SWRConfig>,
        );
        await waitFor(() => getByTestId(/table-row-/));
        const btnDeleteEl = getByRole('button', { name: 'Delete' });

        vi.useFakeTimers();

        await act(() => fireEvent.click(btnDeleteEl));

        await act(() => vi.advanceTimersByTime(500));

        vi.useRealTimers();

        expect(axiosMock.history.delete[0].url).to.be.eq('/posts/2');
        expect(revalidateAllFn).toHaveBeenCalled();
    });

    it('should open Drawer when users click on Button `Add New`', async () => {
        const { getByTestId, getByRole } = render(
            <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <SWRConfig value={{ provider: () => new Map() }}>
                    <App />
                </SWRConfig>
            </MemoryRouter>,
        );

        const addBtn = getByRole('button', { name: 'Add new' });

        await act(() => fireEvent.click(addBtn));

        const formEl = within(getByTestId('form'));

        expect(formEl.getByTestId('form-title')).toBeInTheDocument();
        expect(formEl.getByRole('button', { name: /Submit/i })).toBeInTheDocument();
    });

    it('should send POST request when users click on Button Submit on Add New Form', async () => {
        axiosMock.onPost('/posts').reply(201);
        const { getByRole, getByPlaceholderText } = render(
            <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <SWRConfig value={{ provider: () => new Map() }}>
                    <App />
                </SWRConfig>
            </MemoryRouter>,
        );

        const addBtn = getByRole('button', { name: 'Add new' });

        await act(() => fireEvent.click(addBtn));

        vi.mock('./hooks/useRevalidatePostList', () => {
            return {
                useRevalidatePostList: () => ({ revalidateAll: revalidateAllFn }),
            };
        });

        const submitBtn = getByRole('button', { name: /Submit/i });
        const inputEl = getByPlaceholderText('Title');
        const someText = 'hello world, I am on the top of the world';

        fireEvent.change(inputEl, { target: { value: someText } });
        await act(() => fireEvent.click(submitBtn));

        expect(revalidateAllFn).toHaveBeenCalled();
        expect(axiosMock.history.post[0].data).to.be.eq(
            JSON.stringify({
                title: someText,
                status: false,
                views: 0,
            }),
        );
    });
});
