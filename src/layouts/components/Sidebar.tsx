import { Image, Layout, Menu, type MenuProps } from "antd";
import logo from "@/assets/logo/cat-logo.png";
import "@/styles/sidebar.css";
import { Link, useLocation } from "react-router-dom";
import { SysConfig } from "@/config/SysConfig";
import { useMemo } from "react";
import { useMeStore } from "@/store/useMeStore";
import useTheme from "@/hooks/useTheme";
import { IconMenuMap } from "@/components/icons/IconMenuMap";
import { Routes, type RouteItem } from "@/router/routes";
import { hasAccessRoute } from "@/utils/auth";

const { Sider } = Layout;

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: () => void;
  collapsedWidth: number;
}

const buildMenuItems = (
  items: RouteItem[],
  userPerms: string[]
): MenuProps["items"] => {
  return items
    .filter((item) => hasAccessRoute(item, userPerms))
    .map((item) => {
      const children = item.children
        ? buildMenuItems(item.children, userPerms)
        : undefined;

      return {
        key: item.path,
        icon: item.icon ? IconMenuMap[item.icon] : undefined,
        label: item.children ? (
          item.label
        ) : (
          <Link to={item.path}>{item.label}</Link>
        ),
        children: children && children.length > 0 ? children : undefined,
      };
    });
};

const Sidebar = ({ collapsed, setCollapsed, collapsedWidth }: SidebarProps) => {
  const location = useLocation();
  const { theme, palette } = useTheme();
  const me = useMeStore((s) => s.me);
  const footerTitle = collapsed ? "BevisDev ❤️" : "From BevisDev with ❤️";

  const menuItems = useMemo(() => {
    return buildMenuItems(Routes, me?.permissions ?? []);
  }, [me]);

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={setCollapsed}
      trigger={null}
      width={220}
      collapsedWidth={collapsedWidth}
      theme={theme}
      style={{
        minHeight: "100vh",
        background: palette.sidebarBg,
        borderRight: `1px solid ${palette.sidebarBorder}`,
        position: "relative",
      }}
    >
      {/* Logo */}
      <div
        onClick={() => window.location.assign("/dashboard")}
        style={{
          height: 64,
          margin: 24,
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "flex-start",
          paddingLeft: collapsed ? 0 : 12,
          gap: collapsed ? 0 : 12,
          transition: "all 0.3s ease",
          cursor: "pointer",
        }}
      >
        <Image
          src={logo}
          preview={false}
          style={{
            width: collapsed ? 64 : 180,
            height: "auto",
            objectFit: "contain",
            transition: "all 0.3s ease",
          }}
        />
      </div>

      <Menu
        theme={theme}
        mode="inline"
        className={theme === "dark" ? "glow-menu" : "glow-menu-light"}
        selectedKeys={[location.pathname]}
        items={menuItems}
        style={{
          background: palette.sidebarBg,
        }}
      />

      {!collapsed && (
        <div className="sidebar-footer">
          <span className="sidebar-footer-text">{footerTitle}</span>
          <span className="sidebar-footer-version">v{SysConfig.appVersion}</span>
        </div>
      )}
    </Sider>
  );
};

export default Sidebar;
