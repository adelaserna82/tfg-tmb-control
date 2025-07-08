import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { FaEllipsisV } from "react-icons/fa";

interface ObjectivesMenuProps {
  onEdit: () => void;
}

export default function ObjectivesMenu({ onEdit }: ObjectivesMenuProps) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <MenuButton className="inline-flex justify-center w-full px-2 py-1 text-sm font-medium text-white bg-gray-700 rounded-md hover:bg-gray-600">
        <FaEllipsisV />
      </MenuButton>

      <MenuItems className="absolute right-0 z-[9999] mt-2 w-48 origin-top-right bg-gray-800 divide-y divide-gray-700 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ">
        <div className="py-1">
          <MenuItem>
            {({ focus }) => (
              <button
                onClick={() => onEdit()}
                className={`${focus ? "bg-gray-700" : ""} w-full text-left px-4 py-2 text-sm text-gray-200`}
              >
                ✏️ Editar
              </button>
            )}
          </MenuItem>
        </div>
      </MenuItems>
    </Menu>
  );
}
