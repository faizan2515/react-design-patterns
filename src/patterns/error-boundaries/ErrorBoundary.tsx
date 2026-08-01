import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  /** Rendered instead of the children once an error is caught. */
  fallback: (error: Error, retry: () => void) => ReactNode;
  onError?: (message: string) => void;
}

interface State {
  error: Error | null;
}

/**
 * Error boundaries are the one thing in React that still requires a class.
 *
 * There is no hook equivalent, because the two lifecycle methods involved have no
 * rendering-phase counterpart: `getDerivedStateFromError` runs during the render that
 * failed, and `componentDidCatch` runs afterwards for reporting. In real projects most
 * people use `react-error-boundary` rather than writing this; it is worth writing once to
 * see there is very little to it.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Where you would report to Sentry. `info.componentStack` is the reason to implement
    // this at all — it names the component that threw, which the error alone does not.
    const source = info.componentStack?.trim().split("\n")[0]?.trim();

    this.props.onError?.(
      source ? `caught ${error.message} ${source}` : `caught ${error.message}`,
    );
  }

  retry = () => {
    this.setState({ error: null });
  };

  render() {
    if (this.state.error) {
      return this.props.fallback(this.state.error, this.retry);
    }

    return this.props.children;
  }
}
