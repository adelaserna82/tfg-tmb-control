import { Routes, Route, Navigate } from "react-router-dom";
import AuthLayout from "../modules/auth/AuthLayout";
import MainLayout from "../layouts/MainLayout";
import LoginPage from "../modules/auth/pages/LoginPage";
import ProtectedRoute from "./ProtectedRoutes";
import CommunicationsPage from "@/modules/communications/CommunicationsPage";
import ObjectivesPage from "@/modules/objectives/ObjectivesPage";
import CommunicationsLayout from "@/modules/communications/CommunicationsLayout";
import ObjetivesLayout from "@/modules/objectives/ObjetivesLayout";
import SitesLayout from "@/modules/sites/SitesLayout";
import SitesPage from "@/modules/sites/SitesPages";
import NotificationsLayout from "@/modules/notifications/NotificationsLayout";
import NotificationsPage from "@/modules/notifications/NotificationsPage";
import AllNotificationsPage from "@/modules/notifications/AllNotificationsPage";
import OperationalControlLayout from "@/modules/operationalControls/OperationalControlLayout";
import OperationalControlPage from "@/modules/operationalControls/OperationalControlPage";
import UserLayout from "@/modules/users/UserLayout";
import UserPage from "@/modules/users/UserPage";
import PermissionRoute from "./PermissionRoute";
import { Modules } from "@/constants/permissions";
import IndicatorsLayout from "@/modules/indicators/IndicatorsLayout";
import IndicatorsPage from "@/modules/indicators/pages/IndicatorsPage";
import AlertsPage from "@/modules/indicators/pages/AlertsPage";


export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        {/* Pendiente de hacer */}
        {/* <Route path="/remember-password" element={<RememberPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} /> */}
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/indicadores" replace />} />

          <Route
            path="/indicadores"
            element={
              <PermissionRoute module={Modules.Indicators}>
                <IndicatorsLayout />
              </PermissionRoute>
            }
          >
            <Route index element={<IndicatorsPage />} />
          </Route>

          <Route
            path="/indicadores/alertas"
            element={
              <PermissionRoute module={Modules.Indicators}>
                <IndicatorsLayout />
              </PermissionRoute>
            }
          >
            <Route index element={<AlertsPage />} />
          </Route>

          <Route
            path="/comunicaciones"
            element={
              <PermissionRoute module={Modules.Communications}>
                <CommunicationsLayout />
              </PermissionRoute>
            }
          >
            <Route index element={<CommunicationsPage />} />
          </Route>

          <Route
            path="/objetivos"
            element={
              <PermissionRoute module={Modules.Objectives}>
                <ObjetivesLayout />
              </PermissionRoute>
            }
          >
            <Route index element={<ObjectivesPage />} />
          </Route>

          <Route
            path="/control-operacional"
            element={
              <PermissionRoute module={Modules.Objectives}>
                <OperationalControlLayout />
              </PermissionRoute>
            }
          >
            <Route index element={<OperationalControlPage />} />
          </Route>          


          <Route
            path="/sitios"
            element={
              <PermissionRoute module={Modules.Sites}>
                <SitesLayout />
              </PermissionRoute>
            }
          >
            <Route index element={<SitesPage />} />
          </Route>               

          <Route
            path="/usuarios"
            element={
              <PermissionRoute module={Modules.Users}>
                <UserLayout />
              </PermissionRoute>
            }
          >
            <Route index element={<UserPage />} />
          </Route>               


          <Route path="/notificaciones" element={<NotificationsLayout />}>
            <Route index element={<NotificationsPage />} />
            <Route path="todas" element={<AllNotificationsPage />} />
          </Route>
        </Route>
      </Route>
      <Route path="/unauthorized" element={<p className="text-center text-red-400 text-lg mt-10">Acceso denegado</p>} />

    </Routes>
  );
}
