import { Navigate } from "react-router-dom";

import { Modules, Actions } from "@/constants/permissions";
import { useAuthStore } from "@/store/useAuthStore";

interface Props {
  module: Modules;
  action?: Actions;
  children: React.ReactNode;
}

export default function PermissionRoute({ module, action = Actions.View, children }: Props) {
  const { hasPermission } = useAuthStore();

  if (!hasPermission(module, action)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}
