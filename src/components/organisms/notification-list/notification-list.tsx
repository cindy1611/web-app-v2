import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { NotificationItem } from 'src/components/molecules/notification-item/notification-item';
import { CurrentIdentity, Notification } from 'src/core/api';
import { dialog } from 'src/core/dialog/dialog';
import { RootState } from 'src/store';

import css from './notification-list.module.scss';
import { NotificationListProps } from './notification-list.types';

export const NotificationList = ({
  list,
  onMorePageClick,
  showSeeMore,
  switchAccount,
}: NotificationListProps): JSX.Element => {
  const navigate = useNavigate();
  const identities = useSelector<RootState, CurrentIdentity[]>((state) => {
    return state.identity.entities;
  });
  const currentIdentity = useSelector<RootState, CurrentIdentity | undefined>((state) => {
    return state.identity.entities.find((identity) => identity.current);
  });

  const mapTypeToRoute = (
    notifType: string,
    originIdentityId: string,
    notifRefId: string,
    notifIdentityType: string,
    username?: string,
  ) => {
    if (!originIdentityId || !identities.find((i) => i.id === originIdentityId)) {
      dialog.alert({ message: 'This is an old notification' });
      return;
    }
    if (originIdentityId !== currentIdentity?.id) switchAccount(originIdentityId);
    let path = '';
    switch (notifType) {
      case 'FOLLOWED':
        path = `/profile/${notifIdentityType}/${username}/view`;
        break;
      case 'COMMENT_LIKE':
        path = `/feeds/${notifRefId}`;
        break;
      case 'POST_LIKE':
        path = `/feeds/${notifRefId}`;
        break;
      case 'CHAT':
        path = `/chats/contacts/${notifRefId}`;
        break;
      case 'SHARE_POST':
        path = '';
        break;
      case 'SHARE_PROJECT':
        path = '';
        break;
      case 'COMMENT':
        path = `/feeds/${notifRefId}`;
        break;
      case 'APPLICATION':
        path = `/jobs/created/${notifRefId}/overview?tab=Applicants`;
        break;
      case 'OFFER':
        path = `/jobs/received-offer/${notifRefId}`;
        break;
      case 'REJECT':
        path = `/jobs/applied/${notifRefId}?tab=Applied`;
        break;
      case 'APPROVED':
        path = `/jobs/created/${notifRefId}/overview?tab=Offered`;
        break;
      case 'HIRED':
        path = `/jobs/applied/${notifRefId}?tab=Hired`;
        break;
      case 'PROJECT_COMPLETE':
        path = `/jobs/created/${notifRefId}/overview?tab=Hired`;
        break;
      case 'ASSIGNEE_CANCELED':
        path = `/jobs/created/${notifRefId}/overview?tab=Offered`;
        break;
      case 'ASSIGNER_CANCELED':
        path = `/jobs/applied/${notifRefId}?tab=Applied`;
        break;
      case 'ASSIGNER_CONFIRMED':
        path = `/jobs/applied/${notifRefId}?tab=Hired`;
        break;
      case 'CONNECT':
        path = `/profile/${notifIdentityType}/${username}/view`;
        break;
      case 'ACCEPT_CONNECT':
        path = `/profile/${notifIdentityType}/${username}/view`;
        break;
      case 'MEMBERED':
        path = ''; // FIXME: later for member feature
        break;
    }
    navigate(path);
  };

  const avatarImage = (item: Notification): string =>
    item.data.identity.meta.avatar || item.data.identity.meta.image || '';

  return (
    <div>
      {list.map((item) => (
        <NotificationItem
          onClick={() =>
            mapTypeToRoute(
              item.data.type,
              item.data.orgin ? item.data.orgin.id || '' : '',
              item.data.type === 'OFFER' ? item.data.refId : item.data.parentId,
              item.data.identity.type,
              item.data.identity.meta.username || item.data.identity.meta.shortname,
            )
          }
          key={item.id}
          body={item.data.body.body?.toString() || ''}
          type={item.data.identity.type}
          date={item.created_at.toString()}
          img={avatarImage(item)}
        />
      ))}

      {showSeeMore && (
        <div className={css.seeMore} onClick={() => onMorePageClick()}>
          See more
        </div>
      )}
    </div>
  );
};
