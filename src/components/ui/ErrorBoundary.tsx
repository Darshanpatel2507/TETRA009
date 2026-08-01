/**
 * ErrorBoundary — catches any render-time exception in the tree below
 * and shows a small recoverable error panel instead of a blank screen.
 *
 * React 18 still ships no built-in error boundary. This is the
 * canonical class-component shim. We intentionally don't try to
 * recover — a blank screen is worse than an error message.
 */
import { Component } from "react";
import type { ReactNode } from "react";
import { Card } from "./Card";
import { Button } from "./Button";

interface Props {
  children: ReactNode;
}
interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: unknown) {
    // eslint-disable-next-line no-console
    console.error("ErrorBoundary caught:", error, info);
  }

  reset = () => this.setState({ error: null });

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen grid place-items-center bg-bg p-6">
          <Card className="p-6 max-w-md w-full">
            <h2 className="font-display text-lg text-risk-crit">Something went wrong.</h2>
            <p className="mt-2 text-sm text-text-secondary">
              {this.state.error.message || "An unexpected error occurred."}
            </p>
            <Button className="mt-4" onClick={this.reset}>Try again</Button>
          </Card>
        </div>
      );
    }
    return this.props.children;
  }
}