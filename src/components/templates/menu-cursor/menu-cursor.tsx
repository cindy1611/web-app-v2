import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Avatar } from 'src/components/atoms/avatar/avatar';
import { Search } from 'src/components/atoms/search/search';
import { IdentityReq } from 'src/core/types';
import { RootState } from 'src/store/store';

import { SwitchAccount } from './components/switch-account/switch-account';
import css from './menu-cursor.module.scss';
import { Menu, getAvatar, menuList } from './menu-cursor.services';

export const MenuCursor = (): JSX.Element => {
  const navigate = useNavigate();
  const route = useLocation();
  const currentIdentity = useSelector<RootState, IdentityReq | undefined>((state) => {
    return state.identity.entities.find((identity) => identity.current);
  });

  const [accListVisibility, setAccListVisibility] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  function navigateToSearch(q: string) {
    navigate(
      '/search',
      // search: (p: PayloadModel) => {
      //   const type = p.type ?? 'projects';
      //   const page = p.page ?? 1;
      //   return { type, q, page };
      // },
    );
  }

  function onMenuItemClick(menu: Menu) {
    if (route.pathname !== menu.link) {
      setSearchValue('');
    }
    navigate(menu.link);
  }

  function filterIfNotLoggedIn(item: Menu) {
    const userIsLoggedIn = !!currentIdentity;

    if (userIsLoggedIn || item.public) {
      return item;
    }
  }

  return (
    <div className={css.container}>
      <div className={css.menu}>
        <div className={css.menuItems}>
          <div className={css.logo} onClick={() => navigate('/jobs')}>
            <img style={{ minWidth: 32 }} height={32} src="/icons/logo-white.svg" />
          </div>
          <Search
            onEnter={navigateToSearch}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            marginRight="auto"
            placeholder="Search"
          />
          <ul className={css.navContainer}>
            {menuList.filter(filterIfNotLoggedIn).map((item) => (
              <li key={item.label} className={css.navItem} onClick={() => onMenuItemClick(item)}>
                <img className={css.navIcon} height={24} src={item.icons.nonActive.desktop} />
                <div className={css.navLabel}>{item.label}</div>
              </li>
            ))}
          </ul>
          <div className={css.avatar}>
            <Avatar
              onClick={() => {
                setAccListVisibility(!accListVisibility);
              }}
              size="2rem"
              type={currentIdentity?.type || 'users'}
              img={getAvatar(currentIdentity)}
            />
            <div className={css.switchAccountMenu}>
              <SwitchAccount
                identity={currentIdentity}
                open={accListVisibility}
                onClose={() => setAccListVisibility(false)}
              />
            </div>
          </div>
        </div>
      </div>
      <div className={css.body}>
        <Outlet />
      </div>
    </div>
  );
};
