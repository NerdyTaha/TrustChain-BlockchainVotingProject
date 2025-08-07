import { SideNavItem } from "@/types/types";
import {
  IconHome,
  IconUsers,
  IconUserPlus,
  IconSettings,
  IconUserBitcoin,
} from "@tabler/icons-react";

export const SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: "Dashboard",
    path: "/super-admin/dashboard",
    icon: <IconHome width="24" height="24" />,
  },
  {
    title: "Manage Admins",
    path: "/super-admin/manage-admins",
    icon: <IconUserBitcoin width="24" height="24" />,
  },
  {
    title: "Add Voter",
    path: "/super-admin/add-voter",
    icon: <IconUserPlus width="24" height="24" />,
  },
  {
    title: "Manage Voters",
    path: "/super-admin/manage-voters",
    icon: <IconUsers width="24" height="24" />,
  },
];
