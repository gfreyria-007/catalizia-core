import React from 'react';

interface AppLoaderProps {
  appName: string;
}

const appSlugMap: Record<string, string> = {
  'Techie Tutor': 'techie',
  'Arcade 2099': 'arcade',
  'ScholarSeek': 'scholarseek',
  'BioBrain': 'biorain',
};

/**
 * Loads a sub‑application as an independent micro‑frontend via an iframe.
 * Each app lives under its own folder (e.g., /apps/techie) and handles its own routing,
 * authentication, and subscription checks. The hub only supplies the SSO token via a
 * query parameter so the child app can verify paid access.
 */
const AppLoader: React.FC<AppLoaderProps> = ({ appName }) => {
  const slug = appSlugMap[appName] || '';
  const ssoToken = localStorage.getItem('catalizia_sso_token') || '';
  // Use subdomains instead of folders
  const src = `https://${slug}.catalizia.com?sso=${encodeURIComponent(ssoToken)}`;

  return (
    <iframe
      src={src}
      title={appName}
      style={{
        width: '100%',
        height: '100vh',
        border: 'none',
        backgroundColor: 'transparent',
      }}
      sandbox="allow-scripts allow-same-origin allow-forms"
    />
  );
};

export default AppLoader;
