import { Component, ErrorInfo, PropsWithChildren, ReactNode } from 'react';

interface Props extends PropsWithChildren {}

interface State {
    error: null | Error;
    errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            error: null,
            errorInfo: null,
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        this.setState({
            error,
            errorInfo,
        });
    }

    render(): ReactNode {
        if (this.state.error) {
            return <p style={{ color: 'red' }}>Something error {this.state.errorInfo?.componentStack}</p>;
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
