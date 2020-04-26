import React from "react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error(error);
    console.error(error.stack);
    console.log(errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <center className="bg-dark pt-5" style={{ height: "100vh" }}>
          <h1>Oops! Something went wrong.</h1>
          <p>
            Please try refresh the page or create an{" "}
            <a
              className="text-white"
              href="https://github.com/HaveAGitGat/Tdarr/issues/new"
            >
              issue here!
            </a>
          </p>
        </center>
      );
    }
    return this.props.children;
  }
}
