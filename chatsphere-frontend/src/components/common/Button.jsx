/**
 * Common Button component
 * Props:
 *  - variant: "primary" | "secondary" | "danger"
 *  - loading: boolean
 *  - disabled: boolean
 */

export default function Button({
  children,
  variant = "primary",
  loading = false,
  disabled = false,
  ...props
}) {
  return (
    <button
      className={`btn btn-${variant}`}
      disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {loading ? "Loading…" : children}
    </button>
  );
}
