export default function MessageFormattingToolbar({ onFormat }) {
  const formatButtons = [
    { icon: "B", format: "bold", label: "Bold", syntax: "**" },
    { icon: "I", format: "italic", label: "Italic", syntax: "_" },
    { icon: "S", format: "strike", label: "Strikethrough", syntax: "~~" },
    { icon: "</>", format: "code", label: "Code", syntax: "`" },
    { icon: "```", format: "codeblock", label: "Code Block", syntax: "```" },
  ];

  return (
    <div className="formatting-toolbar">
      {formatButtons.map((btn) => (
        <button
          key={btn.format}
          type="button"
          className="format-btn"
          onClick={() => onFormat(btn.syntax)}
          title={btn.label}
        >
          {btn.icon}
        </button>
      ))}
    </div>
  );
}
