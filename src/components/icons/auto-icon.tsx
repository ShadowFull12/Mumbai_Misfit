import type { SVGProps } from "react";

export function AutoIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M19 17h-0.8" />
      <path d="M15 17h-0.8" />
      <path d="M3 17h-0.8" />
      <path d="M10 17h-3.4" />
      <path d="M12 17H3.4a2 2 0 0 1-1.4-3.4L5 9" />
      <path d="M12 9h4.5a2.5 2.5 0 0 1 2.5 2.5V17" />
      <path d="M8 9V7.5a2.5 2.5 0 0 1 2.5-2.5h0" />
      <path d="M5 17a2 2 0 0 0 4 0" />
      <path d="M17 17a2 2 0 0 0 4 0" />
    </svg>
  );
}
