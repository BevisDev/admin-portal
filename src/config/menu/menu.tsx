import { Link } from "react-router-dom";
import type { MenuProps } from "antd";
import type { MenuItem } from "./MenuConfig";
import { MenuIcon } from "./menuIcon";

export const GetMenu = (items: MenuItem[]): MenuProps["items"] => {
  return items.map((item) => ({
    key: item.key,
    icon: item.icon ? MenuIcon[item.icon] : undefined,
    label: item.children ? item.label : <Link to={item.key}>{item.label}</Link>,
    children: item.children ? GetMenu(item.children) : undefined,
  }));
};
