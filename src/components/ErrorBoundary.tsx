"use client";
import { Component, type ReactNode } from "react";

interface Props { children: ReactNode; fallback?: ReactNode; }
interface State { hasError: boolean; error?: Error; }

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error: Error) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div style={{ padding: 40, textAlign: "center", background: "var(--surface)", borderRadius: 16, border: "1px solid var(--border)", margin: 20 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>!</div>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Something went wrong</h3>
          <p style={{ color: "var(--text-muted)", marginBottom: 18 }}>{this.state.error?.message || "An unexpected error occurred"}</p>
          <button onClick={() => this.setState({ hasError: false })} className="btn btn-primary">Try Again</button>
        </div>
      );
    }
    return this.props.children;
  }
}
