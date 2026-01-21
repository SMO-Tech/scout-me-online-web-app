import React from 'react';

export interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  isOpen: boolean;
  active?: boolean;
  href?: string;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, isOpen, active, href = "#" }) => {
  return (
    <a
      href={href}
      className={`
        relative flex items-center py-3 px-3.5 my-1
        font-medium rounded-md cursor-pointer
        transition-colors group
        ${active
          ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800"
          : "hover:bg-indigo-50 text-gray-600"
        }
      `}
    >
      {/* Icon */}
      <div className="flex items-center justify-center min-w-[20px]">
        {icon}
      </div>

      {/* Label (Hidden when collapsed) */}
      <span
        className={`
          overflow-hidden transition-all duration-300 ease-in-out
          ${isOpen ? "w-52 ml-3 opacity-100" : "w-0 opacity-0"}
        `}
      >
        {label}
      </span>

      {/* Tooltip (Only visible when collapsed) */}
      {!isOpen && (
        <div
          className={`
            absolute left-full rounded-md px-2 py-1 ml-6
            bg-indigo-100 text-indigo-800 text-sm
            invisible opacity-20 -translate-x-3 transition-all
            group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
            whitespace-nowrap z-50
          `}
        >
          {label}
        </div>
      )}
    </a>
  );
};

export default NavItem;