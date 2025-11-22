import { Link } from "react-router-dom";
import type { MenuProps } from "antd";
import { MenuIcon } from "./MenuIcon";
import type { MenuItem } from "./MenuConfig";

export const GetMenu = (items: MenuItem[]): MenuProps["items"] => {
  return items.map((item) => ({
    key: item.key,
    icon: item.icon ? MenuIcon[item.icon] : undefined,
    label: item.children ? item.label : <Link to={item.key}>{item.label}</Link>,
    children: item.children ? GetMenu(item.children) : undefined,
  }));
};
