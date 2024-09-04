import React, { ErrorInfo, ReactNode } from "react";
interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): State {
    // Update state so next render shows fallback UI
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log error messages to an error reporting service here
    console.error("Error caught by Error Boundary:", error, errorInfo);
  }

  render() {
    // console.log(this.state.hasError);
    if (this.state.hasError) {
      return <h1>Oops, something went wrong!!</h1>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
