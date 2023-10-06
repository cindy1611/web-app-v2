import { useSelector } from 'react-redux';
import { Avatar } from 'src/components/atoms/avatar/avatar';
import { Card } from 'src/components/atoms/card/card';
import { IdentityReq } from 'src/core/types';
import { RootState } from 'src/store';

import css from './profile-card.module.scss';
import { useNavigate } from 'react-router-dom';

export const ProfileCard: React.FC = () => {
  const navigate = useNavigate();
  const identity = useSelector<RootState, IdentityReq>((state) => {
    return state.identity.entities.find((identity) => identity.current) as IdentityReq;
  });

  function navigateToProfile() {
    if (identity.type === 'users') {
      navigate(`/profile/users/${identity.meta.username}/view`);
    } else {
      navigate(`/profile/organizations/${identity.meta.shortname}/view`);
    }
  }

  function getAvatarUrl(identity: IdentityReq) {
    if (identity.type === 'organizations') {
      return identity.meta.image;
    } else {
      return identity.meta.avatar;
    }
  }

  return (
    <Card>
      <div className={css.profileHeader}>
        <Avatar img={getAvatarUrl(identity)} type={identity.type} />
        <div>
          <div className={css.username}>{identity.meta.name}</div>
          <div onClick={navigateToProfile} className={css.profileLink}>
            View my profile
          </div>
        </div>
      </div>
      <div className={css.profileFooter}>
        <div className={css.connections}>Connections</div>
        <div className={css.followers}>Followers</div>
      </div>
    </Card>
  );
};
