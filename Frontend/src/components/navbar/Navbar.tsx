
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { useAuthStore } from "@/store/useAuthStore";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { mockAlerts } from "./moq-data/data";
import { Actions, Modules } from "@/constants/permissions";


export interface NavItem {
  name: string;
  href: string;
  module: Modules;
  action: Actions;
}

const navigation: NavItem[] = [
  { name: "Indicadores", href: "/indicadores", module: Modules.Indicators, action: Actions.View },
  { name: "Comunicaciones", href: "/comunicaciones", module: Modules.Communications, action: Actions.View },
  { name: "C. Operacional", href: "/control-operacional", module: Modules.OperationalControl, action: Actions.View },
  { name: "Objetivos", href: "/objetivos", module: Modules.Objectives, action: Actions.View },
  { name: "Sitios", href: "/sitios", module: Modules.Sites, action: Actions.View },
  { name: "Usuarios", href: "/usuarios", module: Modules.Users, action: Actions.View }
];


function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const { logout, user, hasPermission } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };


  const toggleAlertsPanel = () => navigate("/notificaciones");

  return (
    <Disclosure as="nav" className="bg-gray-800 fixed top-0 inset-x-0 z-50 shadow-md">
      {({ open }) => (
        <>
          <div className="mx-auto w-full px-4 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="flex items-center max-[1160px]:block lg:hidden">
                <DisclosureButton className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-none cursor-pointer">
                  <span className="sr-only">Abrir menú</span>
                  {open ? (
                    <XMarkIcon className="size-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="size-6" aria-hidden="true" />
                  )}
                </DisclosureButton>
              </div>

              <div className="flex items-center">
                <Link to="/" className="flex items-center">
                  <span className="text-white text-2xl font-bold">TMB</span>
                </Link>
              </div>

              <div className="hidden max-[1160px]:hidden lg:flex lg:ml-6">
                <div className="flex space-x-4">
                  {navigation
                    .filter(item => hasPermission(item.module, item.action))
                    .map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={classNames(
                          location.pathname === item.href
                            ? "bg-gray-900 text-white"
                            : "text-gray-300 hover:bg-gray-700 hover:text-white",
                          "rounded-md px-3 py-2 text-sm font-medium"
                        )}
                      >
                        {item.name}
                      </Link>
                    ))}
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Menu as="div" className="relative">
                  <MenuButton onClick={toggleAlertsPanel} className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white cursor-pointer">
                    <BellIcon className="size-6" />
                    {mockAlerts.length > 0 && (
                      <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"></span>
                    )}
                  </MenuButton>
                </Menu>
                <Menu as="div" className="relative">
                  <MenuButton className="flex items-center space-x-2 bg-gray-800 text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm">
                    <UserCircleIcon className="size-6" />
                    <span className="hidden sm:block">{user ?? "Usuario"}</span>
                  </MenuButton>
                  <MenuItems className="z-90 absolute right-0 mt-2 w-28 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5">
                    <MenuItem>
                      {() => (
                        <button
                          onClick={handleLogout}
                          className="w-full  text-gray-600 text-sm py-1 rounded-md hover:text-gray-900 flex items-center justify-center cursor-pointer"
                        >
                          Cerrar sesión
                        </button>
                      )}
                    </MenuItem>

                  </MenuItems>
                </Menu>
              </div>
            </div>
          </div>
          <DisclosurePanel className="lg:hidden">
            <div className="space-y-1 px-2 pt-2 pb-3">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
}
