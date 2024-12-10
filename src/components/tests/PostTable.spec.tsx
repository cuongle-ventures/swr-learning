import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import PostTable from '../PostTable';
import { defaultContextValues, FilterPostContext } from '../../contexts/FilterPostContext';
import { act } from 'react';
import MockAdapter from 'axios-mock-adapter';
import instance from '../../api/axios';
import { SWRConfig } from 'swr';

const { setPageFn } = vi.hoisted(() => ({
    setPageFn: vi.fn(),
}));

const renderWithProvider = () => {
    return render(
        <FilterPostContext.Provider value={{ ...defaultContextValues, setPage: setPageFn, limit: 1 }}>
            <SWRConfig value={{ provider: () => new Map() }}>
                <PostTable />
            </SWRConfig>
        </FilterPostContext.Provider>,
    );
};

let axiosMock: MockAdapter;

describe('PostTable', () => {
    beforeEach(() => {
        axiosMock = new MockAdapter(instance);
    });

    afterEach(() => {
        axiosMock.restore();
        vi.resetAllMocks();
    });

    it('should render PostTable in the document', () => {
        axiosMock.onGet('/posts').reply(200);
        renderWithProvider();
        expect(screen.getByRole('table')).toBeInTheDocument();
    });

    it('should handle error when fetching data failed', async () => {
        axiosMock.onGet('/posts').reply(500);
        render(<PostTable />);
        await waitFor(() =>
            expect(screen.getByText('There may be an error when loading the data')).toBeInTheDocument(),
        );
    });

    it('should change page when click on pagintion', async () => {
        axiosMock.onGet('/posts').reply(200, {
            first: 1,
            prev: null,
            next: null,
            last: 2,
            pages: 2,
            items: 10,
            data: [
                {
                    id: '1',
                    title: 'Title 1',
                    status: false,
                    views: 0,
                },
            ],
        });

        renderWithProvider();

        await screen.findByTestId('table-row-0');

        const nextBtnEl = screen.getByRole('button', { name: 'Go to next page' });

        expect(nextBtnEl).toBeInTheDocument();
        expect(nextBtnEl).not.toBeDisabled();

        await act(() => fireEvent.click(nextBtnEl));

        expect(setPageFn).toHaveBeenCalledWith(1);
    });

    // it('should change page size when users select page size dropdown', async () => {
    //     axiosMock.onGet('/posts').reply(200, {
    //         first: 1,
    //         prev: null,
    //         next: null,
    //         last: 2,
    //         pages: 2,
    //         items: 10,
    //         data: [
    //             {
    //                 id: '1',
    //                 title: 'Title 1',
    //                 status: false,
    //                 views: 0,
    //             },
    //         ],
    //     });
    //     const setPageFn = vi.fn();
    //     render(
    //         <FilterPostContext.Provider value={{ ...defaultContextValues, setPage: setPageFn, limit: 1 }}>
    //             <PostTable />
    //         </FilterPostContext.Provider>,
    //     );
    //     await screen.findByTestId('table-row-0');

    //     const dropdownEl = screen.getByLabelText('rows per page');

    //     expect(dropdownEl).toBeInTheDocument();

    //     screen.logTestingPlaygroundURL();

    //     await act(() => fireEvent.click(dropdownEl));

    //     await waitFor(() => expect(screen.getByRole('option', { name: '2' })));

    //     const dropdownContainer = within(dropdownEl);

    //     const options = dropdownContainer.getAllByRole('option');

    //     expect(options).toHaveLength(6);

    //     const arrOptions = options.map((option) => option.textContent);

    //     expect(arrOptions).to.toEqual(['1', '2', '5', '10', '25', 'All']);

    //     await act(() => fireEvent.click(dropdownContainer.getByRole('option', { name: '2' })));

    //     expect(setPageFn).toHaveBeenCalled();
    // });
});
