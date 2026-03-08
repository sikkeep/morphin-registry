export default function AiSendMessageIcon({
  className,
  props,
}: {
  className?: string;
  props?: React.SVGProps<SVGSVGElement>;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      {...props}
    >
      <g clip-path="url(#clip0_3261_13379)">
        <path
          d="M19.83 15.6L18.69 15.86C17.87 16.05 17.23 16.69 17.04 17.51L16.77 18.65C16.74 18.77 16.57 18.77 16.54 18.65L16.28 17.51C16.09 16.69 15.45 16.05 14.63 15.86L13.49 15.59C13.37 15.56 13.37 15.39 13.49 15.36L14.63 15.1C15.45 14.91 16.09 14.27 16.28 13.45L16.55 12.31C16.58 12.19 16.75 12.19 16.78 12.31L17.04 13.45C17.23 14.27 17.87 14.91 18.69 15.1L19.83 15.37C19.95 15.4 19.95 15.57 19.83 15.6Z"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-miterlimit="10"
        />
        <path
          d="M12.31 18.37L9.51002 19.77C3.75002 22.65 1.40002 20.29 4.28002 14.54L5.15002 12.81C5.37002 12.37 5.37002 11.64 5.15002 11.2L4.28002 9.46001C1.40002 3.71001 3.76002 1.35001 9.51002 4.23001L18.07 8.51001C20.46 9.71001 21.36 11.37 20.78 12.92"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          opacity="0.4"
          d="M5.44 12H10.84"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_3261_13379">
          <rect width="24" height="24" fill="currentColor" />
        </clipPath>
      </defs>
    </svg>
  );
}
