import React from 'react';
import { useAuth } from '@site/src/context/AuthContext';
import { useHistory } from '@docusaurus/router';
import type { NavbarItemConfig } from '@docusaurus/theme-common'; // Adjust path if necessary

interface CustomLogoutNavbarItemProps extends NavbarItemConfig {
  // You can add custom props here if needed
}

export default function CustomLogoutNavbarItem(props: CustomLogoutNavbarItemProps): JSX.Element | null {
  const { user, logout } = useAuth();
  const history = useHistory();

  if (!user) {
    return null; // Don't render anything if the user is not logged in
  }

  const handleLogout = () => {
    if (logout) { // Defensive check
      logout();
      history.push('/'); // Redirect to homepage after logout
    }
  };

  return (
    <li className="navbar__item">
      <button className="navbar__link button button--secondary" onClick={handleLogout}>
        Logout ({user.email})
      </button>
    </li>
  );
}
