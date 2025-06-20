export function AdminBadgeCheck(
  props: React.SVGProps<SVGSVGElement> & { size?: number; className?: string }
) {
  return (
    <svg
      {...props}
      width={props.size}
      height={props.size}
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path
        clip-rule="evenodd"
        d="M6.267 3.455a3.066 3.066 0 0 0 1.745-.723 3.066 3.066 0 0 1 3.976 0 3.066 3.066 0 0 0 1.745.723 3.066 3.066 0 0 1 2.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 0 1 0 3.976 3.066 3.066 0 0 0-.723 1.745 3.066 3.066 0 0 1-2.812 2.812 3.066 3.066 0 0 0-1.745.723 3.066 3.066 0 0 1-3.976 0 3.066 3.066 0 0 0-1.745-.723 3.066 3.066 0 0 1-2.812-2.812 3.066 3.066 0 0 0-.723-1.745 3.066 3.066 0 0 1 0-3.976 3.066 3.066 0 0 0 .723-1.745 3.066 3.066 0 0 1 2.812-2.812Zm7.44 5.252a1 1 0 0 0-1.414-1.414L9 10.586 7.707 9.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4Z"
        fill="#3a76c9"
        fill-rule="evenodd"
      ></path>
    </svg>
  );
}

export function CheckIcon(
  props: React.SVGProps<SVGSVGElement> & { size?: number; className?: string }
) {
  return (
    <svg
      {...props}
      width={props.size}
      height={props.size}
      viewBox="0 0 12 12"
      fill="yellow"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 3L4.5 8.5L2 6"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
