import { fireEvent, render, screen } from '@testing-library/react';
import PostTable from '../PostTable';
import { defaultContextValues, FilterPostContext } from '../../contexts/FilterPostContext';
import { act } from 'react';
import MockAdapter from 'axios-mock-adapter';
import instance from '../../api/axios';

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
        render(<PostTable />);
        expect(screen.getByRole('table')).toBeInTheDocument();
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

        const setPageFn = vi.fn();
        render(
            <FilterPostContext.Provider value={{ ...defaultContextValues, setPage: setPageFn, limit: 1 }}>
                <PostTable />
            </FilterPostContext.Provider>,
        );

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
