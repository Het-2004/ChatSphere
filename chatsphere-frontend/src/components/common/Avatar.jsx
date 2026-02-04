/**
 * Avatar component
 * Props:
 *  - name: string
 *  - size: "sm" | "md" | "lg"
 */

export default function Avatar({ name = "?", size = "md" }) {
  const initial = name?.charAt(0).toUpperCase() || "?";

  return (
    <div className={`avatar avatar-${size}`}>
      {initial}
    </div>
  );
}
