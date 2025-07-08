import { Link as RouterLink, LinkProps } from "react-router-dom";
import clsx from "clsx";

interface UiLinkProps extends LinkProps {
  className?: string;
  children: React.ReactNode;
}

function Link({ to, className, children, ...props }: UiLinkProps) {
  return (
    <RouterLink
      to={to}
      className={clsx("text-gray-300 hover:text-gray-100",
        "cursor-pointer", className)}
      {...props}
    >
      {children}
    </RouterLink>
  );
}

export { Link };
