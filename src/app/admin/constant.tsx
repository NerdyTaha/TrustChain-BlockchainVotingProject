import { SideNavItem } from "@/types/types";
import {
  IconBuilding,
  IconSquareX,
  IconTrophy,
  IconUserCheck,
  IconUsers,
  IconSettings,
  IconStackFront,
  IconHome,
} from "@tabler/icons-react";

export const SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: "Dashboard",
    path: "/admin/dashboard",
    icon: <IconHome width="24" height="24" />,
  },
  {
    title: "Manage Institutions",
    path: "/admin/institutions",
    icon: <IconBuilding width="24" height="24" />,
  },
  {
    title: "Manage Election",
    path: "/admin/start-election",
    icon: <IconStackFront width="24" height="24" />,
  },
  {
    title: "Declare Results",
    path: "/admin/results",
    icon: <IconTrophy width="24" height="24" />,
  },
  {
    title: "Verify Candidates",
    path: "/admin/verify-candidates",
    icon: <IconUserCheck width="24" height="24" />,
  },
];
