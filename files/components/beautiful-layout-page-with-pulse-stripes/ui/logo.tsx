function Logo({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 126 126"
      className={className}
    >
      <path d="M32 32h31v-.5A31.5 31.5 0 1 0 31.5 63h.5Zm62 0v31h.5A31.5 31.5 0 1 0 63 31.5v.5ZM32 94V63h-.5A31.5 31.5 0 1 0 63 94.5V94Zm62.5-31H94v31H63v.5A31.5 31.5 0 1 0 94.5 63" />
      <path d="M63 32a31.5 31.5 0 0 1-31 31 31.5 31.5 0 0 1 31 31 31.5 31.5 0 0 1 31-31 31.5 31.5 0 0 1-31-31" />
    </svg>
  );
}

export default Logo;
