import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = {
  children: ReactNode;
};

type State = {
  error: Error | null;
};

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    if (import.meta.env.DEV) {
      console.error(error, info);
    }
  }

  render(): ReactNode {
    if (this.state.error) {
      return (
        <main className="grid min-h-screen place-items-center bg-ink px-6 text-paper">
          <section className="max-w-xl rounded border border-coral/50 bg-white/10 p-6">
            <h1 className="text-2xl font-semibold">Visualizer paused</h1>
            <p className="mt-3 text-sm text-paper/80">{this.state.error.message}</p>
            <button
              className="mt-5 rounded bg-paper px-4 py-2 text-sm font-semibold text-ink"
              onClick={() => this.setState({ error: null })}
            >
              Try again
            </button>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}
