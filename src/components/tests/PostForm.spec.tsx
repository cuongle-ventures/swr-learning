import { render, screen } from '@testing-library/react';
import PostForm from '../PostForm';

it('should render post form in the document', () => {
    render(<PostForm />);
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
    render(<PostForm btnText={btnText} />);
    const btnEl = screen.getByText(btnText);
    expect(btnEl).toBeInTheDocument();
    expect(screen.getByRole('button', { name: btnText })).toBeInTheDocument();
});

it('should contain text input', () => {
    render(<PostForm />);
    const inputEl = screen.getByPlaceholderText('Title');
    expect(inputEl).toBeInTheDocument();
});
