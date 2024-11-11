import { render, screen } from '@testing-library/react';
import App from './App';
import { mockHttp } from '../thirdParty';

describe('App', () => {
    afterEach(() => {
        mockHttp.reset();
    });

    afterAll(() => {
        mockHttp.restore();
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
        mockHttp.onGet('/posts').reply(200, {
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
        render(<App />);
        const rowItem = await screen.findByTestId('table-row-0');
        expect(rowItem).toBeInTheDocument();
    });

    it('should render all items in the document', async () => {
        mockHttp.onGet('/posts').reply(200, {
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

        render(<App />);
        const rowItems = await screen.findAllByTestId(/^table-row/i);
        expect(rowItems).toHaveLength(2);
    });
});
