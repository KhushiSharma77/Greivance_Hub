import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import { CheckIcon, ChevronRightIcon } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*                                   Root                                     */
/* -------------------------------------------------------------------------- */

function DropdownMenu({ ...props }: MenuPrimitive.Root.Props) {
  return <MenuPrimitive.Root data-slot="dropdown-menu" {...props} />;
}

function DropdownMenuPortal({ ...props }: MenuPrimitive.Portal.Props) {
  return <MenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />;
}

function DropdownMenuTrigger({ ...props }: MenuPrimitive.Trigger.Props) {
  return <MenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props} />;
}

/* -------------------------------------------------------------------------- */
/*                                  Content                                   */
/* -------------------------------------------------------------------------- */

function DropdownMenuContent({
  align = "start",
  alignOffset = 0,
  side = "bottom",
  sideOffset = 8,
  className,
  ...props
}: MenuPrimitive.Popup.Props &
  Pick<MenuPrimitive.Positioner.Props, "align" | "alignOffset" | "side" | "sideOffset">) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner
        className="isolate z-50 outline-none"
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
      >
        <MenuPrimitive.Popup
          data-slot="dropdown-menu-content"
          className={cn(
            [
              /* Animations */
              "data-open:animate-in data-closed:animate-out",
              "data-open:fade-in-0 data-closed:fade-out-0",
              "data-open:zoom-in-95 data-closed:zoom-out-95",
              "data-[side=bottom]:slide-in-from-top-2",
              "data-[side=top]:slide-in-from-bottom-2",
              "data-[side=left]:slide-in-from-right-2",
              "data-[side=right]:slide-in-from-left-2",

              /* Glassmorphism */
              "bg-white/70 backdrop-blur-xl",
              "border border-white/40",

              /* Shape & shadow */
              "rounded-2xl",
              "shadow-[0_20px_50px_rgba(140,120,255,0.18)]",

              /* Layout */
              "min-w-44 p-1",
              "text-sm text-gray-800",

              /* Scroll */
              "max-h-(--available-height)",
              "overflow-x-hidden overflow-y-auto",
              "origin-(--transform-origin)",
              "outline-none",
            ].join(" "),
            className,
          )}
          {...props}
        />
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  );
}

/* -------------------------------------------------------------------------- */
/*                                   Group                                    */
/* -------------------------------------------------------------------------- */

function DropdownMenuGroup({ ...props }: MenuPrimitive.Group.Props) {
  return <MenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />;
}

/* -------------------------------------------------------------------------- */
/*                                   Label                                    */
/* -------------------------------------------------------------------------- */

function DropdownMenuLabel({
  className,
  inset,
  ...props
}: MenuPrimitive.GroupLabel.Props & { inset?: boolean }) {
  return (
    <MenuPrimitive.GroupLabel
      data-slot="dropdown-menu-label"
      data-inset={inset}
      className={cn(
        [
          "px-3 py-2",
          "text-xs font-semibold uppercase tracking-wide",
          "text-purple-500",
          "data-[inset]:pl-9",
        ].join(" "),
        className,
      )}
      {...props}
    />
  );
}

/* -------------------------------------------------------------------------- */
/*                                   Item                                     */
/* -------------------------------------------------------------------------- */

function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}: MenuPrimitive.Item.Props & {
  inset?: boolean;
  variant?: "default" | "destructive";
}) {
  return (
    <MenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        [
          "relative flex items-center gap-2",
          "cursor-default select-none",

          /* Shape & spacing */
          "rounded-xl px-3 py-2 text-sm",
          "data-[inset]:pl-9",

          /* Icons */
          "[&_svg:not([class*='size-'])]:size-4",
          "[&_svg]:shrink-0 [&_svg]:pointer-events-none",

          /* Hover / focus */
          "transition-colors duration-150",
          "focus:bg-purple-100/60 focus:text-purple-900",

          /* Destructive */
          "data-[variant=destructive]:text-red-600",
          "data-[variant=destructive]:focus:bg-red-500/10",

          /* Disabled */
          "data-disabled:pointer-events-none data-disabled:opacity-50",
        ].join(" "),
        className,
      )}
      {...props}
    />
  );
}

/* -------------------------------------------------------------------------- */
/*                                 Submenu                                    */
/* -------------------------------------------------------------------------- */

function DropdownMenuSub({ ...props }: MenuPrimitive.SubmenuRoot.Props) {
  return <MenuPrimitive.SubmenuRoot data-slot="dropdown-menu-sub" {...props} />;
}

function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: MenuPrimitive.SubmenuTrigger.Props & { inset?: boolean }) {
  return (
    <MenuPrimitive.SubmenuTrigger
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset}
      className={cn(
        [
          "flex items-center gap-2",
          "rounded-xl px-3 py-2 text-sm",
          "data-[inset]:pl-9",

          "transition-colors",
          "focus:bg-purple-100/60 focus:text-purple-900",
          "data-open:bg-purple-100/60 data-open:text-purple-900",

          "[&_svg:not([class*='size-'])]:size-4",
        ].join(" "),
        className,
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto opacity-70" />
    </MenuPrimitive.SubmenuTrigger>
  );
}

function DropdownMenuSubContent({
  align = "start",
  alignOffset = -4,
  side = "right",
  sideOffset = 8,
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuContent>) {
  return (
    <DropdownMenuContent
      data-slot="dropdown-menu-sub-content"
      className={cn(
        [
          "min-w-40",
          "rounded-2xl",
          "shadow-[0_20px_50px_rgba(140,120,255,0.22)]",
        ].join(" "),
        className,
      )}
      align={align}
      alignOffset={alignOffset}
      side={side}
      sideOffset={sideOffset}
      {...props}
    />
  );
}

/* -------------------------------------------------------------------------- */
/*                            Checkbox / Radio Items                           */
/* -------------------------------------------------------------------------- */

function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  ...props
}: MenuPrimitive.CheckboxItem.Props) {
  return (
    <MenuPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      checked={checked}
      className={cn(
        [
          "relative flex items-center gap-2",
          "rounded-xl px-3 py-2 text-sm",

          "transition-colors",
          "focus:bg-purple-100/60 focus:text-purple-900",

          "data-disabled:pointer-events-none data-disabled:opacity-50",
        ].join(" "),
        className,
      )}
      {...props}
    >
      <span className="pointer-events-none absolute right-3">
        <MenuPrimitive.CheckboxItemIndicator>
          <CheckIcon className="size-4 text-purple-700" />
        </MenuPrimitive.CheckboxItemIndicator>
      </span>
      {children}
    </MenuPrimitive.CheckboxItem>
  );
}

function DropdownMenuRadioGroup({ ...props }: MenuPrimitive.RadioGroup.Props) {
  return <MenuPrimitive.RadioGroup data-slot="dropdown-menu-radio-group" {...props} />;
}

function DropdownMenuRadioItem({
  className,
  children,
  ...props
}: MenuPrimitive.RadioItem.Props) {
  return (
    <MenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
      className={cn(
        [
          "relative flex items-center gap-2",
          "rounded-xl px-3 py-2 text-sm",

          "transition-colors",
          "focus:bg-purple-100/60 focus:text-purple-900",

          "data-disabled:pointer-events-none data-disabled:opacity-50",
        ].join(" "),
        className,
      )}
      {...props}
    >
      <span className="pointer-events-none absolute right-3">
        <MenuPrimitive.RadioItemIndicator>
          <CheckIcon className="size-4 text-purple-700" />
        </MenuPrimitive.RadioItemIndicator>
      </span>
      {children}
    </MenuPrimitive.RadioItem>
  );
}

/* -------------------------------------------------------------------------- */
/*                                 Separator                                  */
/* -------------------------------------------------------------------------- */

function DropdownMenuSeparator({ className, ...props }: MenuPrimitive.Separator.Props) {
  return (
    <MenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={cn("my-1 h-px bg-purple-200/40", className)}
      {...props}
    />
  );
}

/* -------------------------------------------------------------------------- */
/*                                  Shortcut                                  */
/* -------------------------------------------------------------------------- */

function DropdownMenuShortcut({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn(
        "ml-auto text-xs tracking-widest text-gray-400",
        className,
      )}
      {...props}
    />
  );
}

/* -------------------------------------------------------------------------- */
/*                                   Export                                   */
/* -------------------------------------------------------------------------- */

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
};
