import { SideNavItem } from "@/types/types";
import {
  IconHome,
  IconCheck,
  IconClipboardCheck,
  IconListCheck,
  IconUser,
  IconSettings,
  IconPaperclip,
} from "@tabler/icons-react";

export const SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: "Dashboard",
    path: "/voter/dashboard",
    icon: <IconHome width="24" height="24" />,
  },
  {
    title: "Cast Vote",
    path: "/voter/cast-vote",
    icon: <IconCheck width="24" height="24" />,
  },
];
