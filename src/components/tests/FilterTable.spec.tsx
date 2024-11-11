import { fireEvent, render, screen, within } from '@testing-library/react';
import FilterTable from '../FilterTable';
import { defaultContextValues, FilterPostContext } from '../../contexts/FilterPostContext';

describe('FilterTable', () => {
    it('should render FilterTable in the document', () => {
        render(<FilterTable />);
        const selectEl = screen.getByRole('combobox');
        expect(selectEl).toBeInTheDocument();
        expect(selectEl).toBeVisible();
    });

    it('should render 3 options in list combobox', () => {
        render(<FilterTable />);

        fireEvent.mouseDown(screen.getByRole('combobox'));

        const listbox = within(screen.getByRole('listbox'));
        const options = listbox.getAllByRole('option');
        const stringOptionArr = options.map((it) => it.textContent);

        expect(options).toHaveLength(3);
        expect(stringOptionArr).toEqual(['All', 'Completed', 'Incomplete']);
    });

    it('should set status when changing option', () => {
        const setStatus = vi.fn();

        render(
            <FilterPostContext.Provider value={{ ...defaultContextValues, setStatus }}>
                <FilterTable />
            </FilterPostContext.Provider>,
        );

        fireEvent.mouseDown(screen.getByRole('combobox'));

        const listbox = within(screen.getByRole('listbox'));

        const completedOption = listbox.getByRole('option', { name: 'Completed' });

        fireEvent.click(completedOption);

        expect(setStatus).toHaveBeenCalled();
        expect(setStatus).toHaveBeenCalledWith('true');
    });

    it('should set default page is 0 when changing status', () => {
        const setPage = vi.fn();

        render(
            <FilterPostContext.Provider value={{ ...defaultContextValues, setPage }}>
                <FilterTable />
            </FilterPostContext.Provider>,
        );

        fireEvent.mouseDown(screen.getByRole('combobox'));

        const listbox = within(screen.getByRole('listbox'));

        const completedOption = listbox.getByRole('option', { name: 'Completed' });

        fireEvent.click(completedOption);

        expect(setPage).toHaveBeenCalled();
        expect(setPage).toHaveBeenCalledWith(0);
    });

    it('should set default status on the first time', () => {
        render(
            <FilterPostContext.Provider value={{ ...defaultContextValues, status: 'false' }}>
                <FilterTable />
            </FilterPostContext.Provider>,
        );

        const currentSelectedOption = screen.getByRole('combobox');
        expect(currentSelectedOption).toHaveTextContent('Incomplete');
    });
});
