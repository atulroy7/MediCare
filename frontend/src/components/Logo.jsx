export default function Logo({ className = "h-7 w-7", ...props }) {
    return (
        <svg
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-hidden="true"
            {...props}
        >
            {/* Pharmacy Cross Symbol */}
            <path
                d="M12 3.5C12 2.67157 12.6716 2 13.5 2H18.5C19.3284 2 20 2.67157 20 3.5V12H28.5C29.3284 12 30 12.6716 30 13.5V18.5C30 19.3284 29.3284 20 28.5 20H20V28.5C20 29.3284 19.3284 30 18.5 30H13.5C12.6716 30 12 29.3284 12 28.5V20H3.5C2.67157 20 2 19.3284 2 18.5V13.5C2 12.6716 2.67157 12 3.5 12H12V3.5Z"
                className="fill-[rgb(var(--color-primary))]"
            />
            {/* Center Heartbeat / Care Accent Line */}
            <path
                d="M9 16H13L15 12.5L17 19.5L19 16H23"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
