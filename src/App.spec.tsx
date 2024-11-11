import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import App from './App';
import MockAdapter from 'axios-mock-adapter';
import instance from './api/axios';
import { SWRConfig } from 'swr';
import FilterPostProvider from './components/FilterPostProvider';
import { MemoryRouter } from 'react-router-dom';

let axiosMock: MockAdapter;

describe('App', () => {
    beforeEach(() => {
        axiosMock = new MockAdapter(instance);
    });

    afterEach(() => {
        axiosMock.restore();
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

    it('should send DELETE request when users click on Button Delete', () => {});

    it('should open Drawer when users click on Button `Add New`', () => {});

    it('should send POST request when users click on Button Submit on Add New Form', () => {});
});
