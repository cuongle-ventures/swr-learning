import { screen, render } from '@testing-library/react';
import PostForm from '../PostForm';
import { MemoryRouter } from 'react-router-dom';

const renderWithProvider = (ui: React.ReactNode) => {
    render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>{ui}</MemoryRouter>);
};

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
