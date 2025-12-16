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

const Sidebar = ({ collapsed, setCollapsed }: SidebarProps) => {
  const location = useLocation();
  const { theme, palette } = useTheme();
  const me = useMeStore((s) => s.me);

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
        style={{
          height: 64,
          margin: 24,
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "flex-start",
          paddingLeft: collapsed ? 0 : 12,
          gap: collapsed ? 0 : 12,
          transition: "all 0.3s ease",
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

      {/* Copyright */}
      <div
        style={{
          position: "absolute",
          bottom: 16,
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: 12,
          opacity: 0.6,
          whiteSpace: "nowrap",
          transition: "all 0.3s ease",
          pointerEvents: "none",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          lineHeight: 1.4,
        }}
      >
        <span>From BevisDev with ❤️</span>
        <span style={{ fontSize: 11, opacity: 0.8 }}>
          v{SysConfig.appVersion}
        </span>
      </div>
    </Sider>
  );
};

export default Sidebar;
