import type { SVGProps } from "react";

export function MetroIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M18 10h-5" />
      <path d="M10 10H4.34a2 2 0 0 0-1.79 1.11l-1.42 4.24a2 2 0 0 0 .63 2.5l2.12 2.12a2 2 0 0 0 2.5.63l4.24-1.42A2 2 0 0 0 12 17.66V10Z" />
      <path d="m5 11 2-2" />
      <path d="M13 9a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z" />
      <path d="M16 8h3" />
      <path d="M19 11h-3" />
      <path d="M18 5h1" />
      <path d="M21 8h-1" />
    </svg>
  );
}
