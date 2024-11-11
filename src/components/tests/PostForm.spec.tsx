import { screen, render, fireEvent } from '@testing-library/react';
import PostForm from '../PostForm';
import { MemoryRouter } from 'react-router-dom';

const renderWithProvider = (ui: React.ReactNode) => {
    render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>{ui}</MemoryRouter>);
};

describe('Post Form', () => {
    it('should render post form in the document', () => {
        renderWithProvider(<PostForm />);
        const frm = screen.queryByTestId('form');
        expect(frm).toBeInTheDocument();
        const frmTitle = screen.queryByTestId('form-title');
        const frmHeading = screen.getByText('Create new post');
        expect(frmHeading).toBeInTheDocument();
        expect(frmTitle).toBeInTheDocument();
        expect(frmTitle?.textContent).to.eq('Create new post');
        const btnSubmit = screen.queryByTestId('submit-btn');
        expect(btnSubmit).toBeInTheDocument();
        expect(btnSubmit?.textContent).to.be.eq('Submit');
        expect(btnSubmit).toHaveTextContent(/submit/i);
    });

    it('should same text passed to button text', () => {
        const btnText = 'Hello world';
        renderWithProvider(<PostForm btnText={btnText} />);
        const btnEl = screen.getByText(btnText);
        expect(btnEl).toBeInTheDocument();
        expect(screen.getByRole('button', { name: btnText })).toBeInTheDocument();
    });

    it('should contain text input', () => {
        renderWithProvider(<PostForm />);
        const inputEl = screen.getByPlaceholderText('Title');
        expect(inputEl).toBeInTheDocument();
    });

    it('should has a visible link', () => {
        renderWithProvider(<PostForm />);
        const linkEl = screen.getByText(/How to create a new task?/i);
        expect(linkEl).toBeVisible();
    });

    it('should initial value in text field', () => {
        renderWithProvider(<PostForm />);
        const inputEl = screen.getByPlaceholderText(/Title/i);
        expect(inputEl).toHaveValue();
    });

    it('should contain user text input', () => {
        renderWithProvider(<PostForm />);
        const inputEl = screen.getByPlaceholderText(/Title/i);
        fireEvent.change(inputEl, { target: { value: 'Hello world' } });
        expect(inputEl).toHaveValue('Hello world');
    });

    it('should submit user text input', () => {
        const handleSubmit = vi.fn();
        const userTextInput = 'New task title';
        renderWithProvider(<PostForm onSubmit={handleSubmit} />);

        const inputEl = screen.getByPlaceholderText(/Title/i);
        const button = screen.getByRole('button', { name: 'Submit' });

        fireEvent.change(inputEl, { target: { value: userTextInput } });
        fireEvent.click(button);

        expect(handleSubmit).toHaveBeenNthCalledWith(1, userTextInput);
    });

    it('should clear user input after submitting form', () => {
        renderWithProvider(<PostForm />);

        const inputEl = screen.getByPlaceholderText(/Title/i);
        const btnEl = screen.getByRole('button');

        fireEvent.click(btnEl);
        expect(inputEl).not.toHaveValue();
    });

    it('should call `onClose` after submitting form', () => {
        const handleClose = vi.fn();
        renderWithProvider(<PostForm onClose={handleClose} />);

        const btnEl = screen.getByRole('button');

        fireEvent.click(btnEl);

        expect(handleClose).toHaveBeenCalled();
    });
});
