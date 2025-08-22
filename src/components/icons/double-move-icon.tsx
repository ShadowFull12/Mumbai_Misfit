import type { SVGProps } from "react";

export function DoubleMoveIcon(props: SVGProps<SVGSVGElement>) {
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
        <path d="M2 17h10" />
        <path d="m9 20 3-3-3-3" />
        <path d="M22 7H12" />
        <path d="m15 4-3 3 3 3" />
    </svg>
  );
}
