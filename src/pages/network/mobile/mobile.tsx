import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Avatar } from 'src/components/atoms/avatar/avatar';
import { Card } from 'src/components/atoms/card/card';
import { Search } from 'src/components/atoms/search/search';
import { OrgMeta, UserMeta } from 'src/core/api';
import { useNetworkShared } from 'src/pages/network/network.shared';
import { visibility } from 'src/store/reducers/menu.reducer';

import css from './mobile.module.scss';

export const Mobile: React.FC = () => {
  const { navigateNetwork, identity } = useNetworkShared();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const avatarImg = (identity?.meta as UserMeta).avatar || (identity?.meta as OrgMeta).image || '';

  function openSidebar() {
    dispatch(visibility(true));
  }

  const onSearchEnter = (value: string) => {
    navigate(`/search?q=${value}&type=projects&page=1`);
  };
  return (
    <div className={css.container}>
      <div className={css.header}>
        <div className={css.menu}>
          {identity && <Avatar size="2.25rem" type={identity.type} img={avatarImg} onClick={openSidebar} />}
          <Search placeholder="Search network" onEnter={onSearchEnter} />
          <div>
            <img className={css.logo} src="icons/chat-white.svg" />
          </div>
        </div>
        <div>
          <div className={css.title}>People</div>
          <div className={css.tagline}>Connect with skilled professionals</div>
        </div>
      </div>
      <Card className={css.network}>
        <div className={css.network__item} onClick={() => navigateNetwork('connections')}>
          <div className={css.network__logo}>
            <img src="/icons/network.svg" />
          </div>
          Connections
        </div>
        <div className={css.network__item} onClick={() => navigateNetwork('followings')}>
          <div className={css.network__logo}>
            <img src="/icons/followers-blue.svg" />
          </div>
          Following
        </div>
      </Card>
      <div className={css.recommand}>
        <div className={css.recommand__noItem}>No recommendations</div>
      </div>
    </div>
  );
};
