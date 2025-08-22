
import type { SVGProps } from "react";

export function FerryIcon(props: SVGProps<SVGSVGElement>) {
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
        <path d="M2 12h20" />
        <path d="M4 17h16" />
        <path d="M20 12v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3" />
        <path d="M18 12V8l-2-4H8L6 8v4" />
        <path d="M12 3v5" />
    </svg>
  );
}
