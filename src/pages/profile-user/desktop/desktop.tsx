import css from './desktop.module.scss';
import { Avatar } from '../../../components/atoms/avatar/avatar';
import { Divider } from '../../../components/templates/divider/divider';
import { CategoriesClickable } from '../../../components/atoms/categories-clickable/categories-clickable';
import { printWhen } from '../../../core/utils';
import { badgesList } from '../profile-user.services';
import { Button } from 'src/components/atoms/button/button';
import { ImpactBadge } from 'src/components/atoms/impact-badge/impact-badge';
import { TwoColumnCursor } from 'src/components/templates/two-column-cursor/two-column-cursor';
import { Card } from 'src/components/atoms/card/card';
import { useProfileUserShared } from '../profile-user.shared';
import { Edit } from './edit/edit';
import { useState } from 'react';

export const Desktop = (): JSX.Element => {
  const {
    user,
    updateUser,
    address,
    badges,
    socialCauses,
    avatarImage,
    skills,
    profileBelongToCurrentUser,
    gotToDesktopAchievement,
  } = useProfileUserShared();

  const [editOpen, setEditOpen] = useState(false);

  const cityLinkJSX = (
    <div className={css.contactItem}>
      <img height={22} src="/icons/pin-green.svg" />
      <div className={css.contactData}>{address}</div>
    </div>
  );

  const contactLinkJSX = (
    <div className={css.contactItem}>
      <img height={22} src="/icons/phone-green.svg" />
      <a href={`tel:${user.mobile_country_code}${user.phone}`} className={css.contactData}>
        {user.mobile_country_code} {user.phone}
      </a>
    </div>
  );

  const emailLinkJSX = (
    <div className={css.contactItem}>
      <img height={22} src="/icons/email-green.svg" />
      <a href={`mailto:${user.email}`} className={css.contactData}>
        {user.email}
      </a>
    </div>
  );

  const websiteLinkJSX = (
    <div className={css.contactItem}>
      <img height={22} src="/icons/email-green.svg" />
      <a href={`mailto:${user.email}`} className={css.contactData}>
        {user.email}
      </a>
    </div>
  );

  const bioJSX = (
    <Divider>
      <div className={css.bio}>{user.bio}</div>
    </Divider>
  );

  const userFullNameJSX = (
    <div className={css.name}>
      {user?.first_name} {user?.last_name}
    </div>
  );

  const missionJSX = (
    <Divider title="Mission">
      <div className={css.mission}>{user.mission}</div>
    </Divider>
  );

  const cultureJSX = (
    <Divider title="Culture">
      <div className={css.culture}>{user.culture}</div>
    </Divider>
  );

  const skillsJSX = (
    <Divider title="Skills">
      <CategoriesClickable list={skills} />
    </Divider>
  );

  const editButtonJSX = (
    <Button onClick={() => setEditOpen(true)} color="white" width="6.5rem">
      Edit
    </Button>
  );

  const orgNameJSX = <div className={css.name}>{user?.name}</div>;
  const usernameJSX = <div className={css.username}>@{user?.username}</div>;

  return (
    <TwoColumnCursor>
      <div className={css.sidebar}>
        <Card cursor="pointer" onClick={() => history.back()}>
          <div className={css.back}>
            <img src="/icons/chevron-left.svg" />
            <div>Jobs</div>
          </div>
        </Card>
      </div>

      <Card className={css.card} padding={0}>
        <div className={css.header}>
          <div style={{ backgroundImage: `url(${user.cover_image?.url})` }} className={css.cover}>
            <div className={css.avatarContainer}>
              <Avatar img={avatarImage} size="8rem" type="users" />
            </div>
          </div>
          <div className={css.menu}>
            <div className={css.btnContainer}>
              {/* <Button width="6.5rem">Connect</Button> */}
              {printWhen(editButtonJSX, profileBelongToCurrentUser)}
            </div>
            <div className={css.userConnections}>
              <div>{user.followings} connections</div>
              <div>{user.followers} Followers</div>
            </div>
          </div>
        </div>
        <div>
          <Divider>
            {printWhen(orgNameJSX, !!user?.name)}
            {printWhen(userFullNameJSX, !!user?.first_name || !!user?.last_name)}
            {printWhen(usernameJSX, !!user?.username)}
          </Divider>
          <Divider>
            <div className={css.achievements} onClick={gotToDesktopAchievement}>
              <div className={css.badges}>
                {badgesList(badges.badges).map((item) => {
                  return <ImpactBadge key={item.color} size="2.75rem" {...item} />;
                })}
              </div>
              <div className={css.achievementsLink}>Achievements</div>
            </div>
          </Divider>

          {printWhen(bioJSX, !!user.bio)}
          <Divider title="Social Causes">
            <CategoriesClickable list={socialCauses} />
          </Divider>
          <Divider title="Contact">
            {printWhen(contactLinkJSX, !!user.mobile_country_code)}
            {printWhen(emailLinkJSX, !!user.email)}
            {printWhen(websiteLinkJSX, !!user.website)}
            {printWhen(cityLinkJSX, !!user.city)}
          </Divider>
          {printWhen(missionJSX, !!user.mission)}
          {printWhen(cultureJSX, !!user.culture)}
          {printWhen(skillsJSX, user.skills && user.skills.length > 0)}
          {printWhen(
            <Divider title="Culture">
              <div className={css.culture}>{user.culture}</div>
            </Divider>,
            !!user.culture
          )}
        </div>
        <Edit updateUser={updateUser} width="31rem" height="75vh" open={editOpen} onClose={() => setEditOpen(false)} />
      </Card>
    </TwoColumnCursor>
  );
};
