"use client";

import { GiHamburgerMenu } from "react-icons/gi";

function SidePane({
  isOpen,
  closeSidePane,
  children,
  position = "right",
  padding = "p-4",
  width = "w-[20rem]",
  height = "h-[100dvh]",
  crossIcon = true,
  background = "bg-secondary",
}: {
  isOpen: boolean;
  closeSidePane: () => void;
  children: React.ReactNode;
  position?: "right" | "left" | "top" | "bottom";
  padding?: string;
  width?: string;
  height?: string;
  crossIcon?: boolean;
  background?: string;
}) {
  // Set different flex alignment, size, and item alignment based on position
  let justifyContent = "";
  let sizeClasses = "";
  let alignItems = "";

  switch (position) {
    case "right":
      justifyContent = "justify-end";
      sizeClasses = `h-full ${width} rounded-md`;
      alignItems = "items-center";
      break;
    case "left":
      justifyContent = "justify-start";
      sizeClasses = `h-full ${width} rounded-md`;
      alignItems = "items-center";
      break;
    case "top":
      justifyContent = "justify-center";
      sizeClasses = `${height} w-full rounded-2xl`;
      alignItems = "items-start";
      break;
    case "bottom":
      justifyContent = "justify-center";
      // Add 3.5rem to height to account for footer height
      sizeClasses = `h-[calc(${height}+3.5rem)] sm:${height} w-full rounded-2xl`;
      alignItems = "items-end";
      break;
    default:
      justifyContent = "justify-end";
      sizeClasses = `h-full ${width}`;
      alignItems = "items-center";
  }

  if (!isOpen) return null;

  return (
    <div
      className={`absolute left-0 top-0 z-20 flex size-full bg-gray-600 bg-opacity-50 ${justifyContent} ${alignItems}`}
      onClick={closeSidePane}
    >
      <div
        className={`flex flex-col justify-between ${background} ${sizeClasses}`}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div
          className={`relative flex flex-col justify-between gap-4 ${padding} h-full overflow-y-auto bg-blue-200 rounded-lg`}
        >
          {crossIcon && (
            <GiHamburgerMenu
              className="absolute left-4 top-4 size-6 cursor-pointer text-textPrimary"
              role="button"
              onClick={(e) => {
                e.stopPropagation();
                closeSidePane();
              }}
            />
          )}
          {children}
        </div>
      </div>
    </div>
  );
}

export default SidePane;
