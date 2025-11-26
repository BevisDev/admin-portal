import { Image, Layout, Menu } from "antd";
import React from "react";
import logo from "@/assets/logo/cat-logo.png";
import "@/styles/sidebar.css";
import { useLocation } from "react-router-dom";
import { GetMenu } from "@/menu/GetMenu.tsx";
import { MenuConfig } from "@/menu/MenuConfig.ts";
import { useTheme } from "@/hooks/useTheme.ts";
import { darkColors, lightColors } from "@/types/theme.ts";

const { Sider } = Layout;

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  const { themeMode } = useTheme();
  const location = useLocation();
  const palette = themeMode === "light" ? lightColors : darkColors;

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={setCollapsed}
      trigger={null}
      width={220}
      theme={themeMode}
      style={{
        minHeight: "100vh",
        background: palette.sidebarBg,
        borderRight: `1px solid ${palette.sidebarBorder}`,
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
        theme={themeMode}
        mode="inline"
        className={themeMode === "dark" ? "glow-menu" : "glow-menu-light"}
        selectedKeys={[location.pathname]}
        items={GetMenu(MenuConfig)}
        style={{
          background: palette.sidebarBg,
        }}
      />
    </Sider>
  );
};

export default Sidebar;
