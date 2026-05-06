import { ChevronDown, Clock3, Cloud, Folder as FolderIcon, KeyRound, Lock, LogOut, Send as SendIcon, Settings as SettingsIcon, ShieldUser } from 'lucide-preact';
import type { ComponentChildren } from 'preact';
import { useState } from 'preact/hooks';
import { Link } from 'wouter';
import AppMainRoutes from '@/components/AppMainRoutes';
import ThemeSwitch from '@/components/ThemeSwitch';
import type { AppMainRoutesProps } from '@/components/AppMainRoutes';
import { t } from '@/lib/i18n';
import type { Profile } from '@/lib/types';

interface AppAuthenticatedShellProps {
  profile: Profile | null;
  location: string;
  mobilePrimaryRoute: string;
  currentPageTitle: string;
  showSidebarToggle: boolean;
  sidebarToggleTitle: string;
  settingsAccountRoute: string;
  importRoute: string;
  isImportRoute: boolean;
  darkMode: boolean;
  themeToggleTitle: string;
  onLock: () => void;
  onLogout: () => void;
  onToggleTheme: () => void;
  onToggleMobileSidebar: () => void;
  mainRoutesProps: AppMainRoutesProps;
}

function isAdminProfile(profile: Profile | null): boolean {
  return String(profile?.role || '').toLowerCase() === 'admin';
}

export default function AppAuthenticatedShell(props: AppAuthenticatedShellProps) {
  const routeAnimationKey = props.isImportRoute ? props.importRoute : props.location;
  const isAdmin = isAdminProfile(props.profile);
  const vaultActive = props.location === '/vault' || props.location === '/vault/totp';
  const settingsActive = props.location === props.settingsAccountRoute || props.location === '/settings/domain-rules';
  const dataActive = props.location === '/backup' || props.isImportRoute;
  const managementActive = props.location === '/admin' || props.location === '/security/devices';
  const [expandedGroups, setExpandedGroups] = useState({
    vault: true,
    settings: false,
    data: false,
    management: false,
  });

  function toggleGroup(group: keyof typeof expandedGroups): void {
    setExpandedGroups((current) => ({ ...current, [group]: !current[group] }));
  }

  function groupOpen(group: keyof typeof expandedGroups, active: boolean): boolean {
    return expandedGroups[group] || active;
  }

  function renderNavGroup(
    group: keyof typeof expandedGroups,
    title: string,
    icon: ComponentChildren,
    active: boolean,
    children: ComponentChildren
  ) {
    const open = groupOpen(group, active);
    return (
      <div className={`side-nav-group ${open ? 'open' : ''}`}>
        <button
          type="button"
          className={`side-group-trigger ${active ? 'active' : ''}`}
          aria-expanded={open}
          onClick={() => toggleGroup(group)}
        >
          {icon}
          <span>{title}</span>
          <ChevronDown size={15} className="side-group-chevron" />
        </button>
        <div className={`side-subnav ${open ? 'open' : ''}`}>
          <div className="side-subnav-inner">
            {children}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-page">
      <div className="app-shell">
        <header className="topbar">
          <div className="brand">
            <img src="/nodewarden-logo.svg" alt="NodeWarden logo" className="brand-logo" />
            <span className="brand-wordmark" role="img" aria-label="NodeWarden" />
            <span className="mobile-page-title">{props.currentPageTitle}</span>
          </div>
          <div className="topbar-actions">
            <div className="user-chip">
              <ShieldUser size={16} />
              <span>{props.profile?.email}</span>
            </div>
            <ThemeSwitch checked={props.darkMode} title={props.themeToggleTitle} onToggle={props.onToggleTheme} />
            <button type="button" className="btn btn-secondary small" onClick={props.onLock}>
              <Lock size={14} className="btn-icon" /> {t('txt_lock')}
            </button>
            {props.showSidebarToggle && (
              <button
                type="button"
                className="btn btn-secondary small mobile-sidebar-toggle"
                aria-label={props.sidebarToggleTitle}
                title={props.sidebarToggleTitle}
                onClick={props.onToggleMobileSidebar}
              >
                <FolderIcon size={16} className="btn-icon" />
              </button>
            )}
            <div className="mobile-theme-btn">
              <ThemeSwitch checked={props.darkMode} title={props.themeToggleTitle} onToggle={props.onToggleTheme} />
            </div>
            <button type="button" className="btn btn-secondary small mobile-lock-btn" aria-label={t('txt_lock')} title={t('txt_lock')} onClick={props.onLock}>
              <Lock size={14} className="btn-icon" />
            </button>
            <button type="button" className="btn btn-secondary small" onClick={props.onLogout}>
              <LogOut size={14} className="btn-icon" /> {t('txt_sign_out')}
            </button>
          </div>
        </header>

        <div className="app-main">
          <aside className="app-side">
            {renderNavGroup(
              'vault',
              t('nav_my_vault'),
              <KeyRound size={16} />,
              vaultActive,
              <>
                <Link href="/vault" className={`side-sub-link ${props.location === '/vault' ? 'active' : ''}`}>
                  <span>{t('nav_vault_items')}</span>
                </Link>
                <Link href="/vault/totp" className={`side-sub-link ${props.location === '/vault/totp' ? 'active' : ''}`}>
                  <span>{t('txt_verification_code')}</span>
                </Link>
              </>
            )}
            <Link href="/sends" className={`side-link ${props.location === '/sends' ? 'active' : ''}`}>
              <SendIcon size={16} />
              <span>{t('nav_sends')}</span>
            </Link>
            {renderNavGroup(
              'settings',
              t('txt_settings'),
              <SettingsIcon size={16} />,
              settingsActive,
              <>
                <Link href={props.settingsAccountRoute} className={`side-sub-link ${props.location === props.settingsAccountRoute ? 'active' : ''}`}>
                  <span>{t('nav_account_settings')}</span>
                </Link>
                <Link href="/settings/domain-rules" className={`side-sub-link ${props.location === '/settings/domain-rules' ? 'active' : ''}`}>
                  <span>{t('nav_domain_rules')}</span>
                </Link>
              </>
            )}
            {renderNavGroup(
              'data',
              t('nav_group_data_backup'),
              <Cloud size={16} />,
              dataActive,
              <>
                {isAdmin && (
                  <Link href="/backup" className={`side-sub-link ${props.location === '/backup' ? 'active' : ''}`}>
                    <span>{t('nav_backup_strategy')}</span>
                  </Link>
                )}
                <Link href={props.importRoute} className={`side-sub-link ${props.isImportRoute ? 'active' : ''}`}>
                  <span>{t('nav_import_export')}</span>
                </Link>
              </>
            )}
            {renderNavGroup(
              'management',
              t('nav_group_management'),
              <ShieldUser size={16} />,
              managementActive,
              <>
                {isAdmin && (
                  <Link href="/admin" className={`side-sub-link ${props.location === '/admin' ? 'active' : ''}`}>
                    <span>{t('nav_admin_panel')}</span>
                  </Link>
                )}
                <Link href="/security/devices" className={`side-sub-link ${props.location === '/security/devices' ? 'active' : ''}`}>
                  <span>{t('nav_device_management')}</span>
                </Link>
              </>
            )}
          </aside>
          <main className="content">
            <div key={routeAnimationKey} className={`route-stage ${props.location === '/settings/domain-rules' ? 'route-stage-fixed' : ''}`}>
              <AppMainRoutes {...props.mainRoutesProps} />
            </div>
          </main>
        </div>

        <nav className="mobile-tabbar" aria-label={t('txt_menu')}>
          <Link href="/vault" className={`mobile-tab ${props.mobilePrimaryRoute === '/vault' ? 'active' : ''}`}>
            <KeyRound size={18} />
            <span>{t('nav_my_vault')}</span>
          </Link>
          <Link href="/vault/totp" className={`mobile-tab ${props.mobilePrimaryRoute === '/vault/totp' ? 'active' : ''}`}>
            <Clock3 size={18} />
            <span>{t('txt_verification_code')}</span>
          </Link>
          <Link href="/sends" className={`mobile-tab ${props.mobilePrimaryRoute === '/sends' ? 'active' : ''}`}>
            <SendIcon size={18} />
            <span>{t('nav_sends')}</span>
          </Link>
          <Link href="/settings" className={`mobile-tab ${props.mobilePrimaryRoute === '/settings' ? 'active' : ''}`}>
            <SettingsIcon size={18} />
            <span>{t('txt_settings')}</span>
          </Link>
        </nav>
      </div>
    </div>
  );
}
