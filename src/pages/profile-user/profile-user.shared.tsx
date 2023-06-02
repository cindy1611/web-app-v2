import { useMatch, useNavigate } from '@tanstack/react-location';
import { useSelector } from 'react-redux';
import { IdentityReq } from 'src/core/types';
import { RootState } from 'src/store/store';
import { hapticsImpactLight } from 'src/core/haptic/haptic';
import { ProfileReq } from './profile-user.types';
import { skillsToCategory, socialCausesToCategory } from 'src/core/adaptors';
import { COUNTRIES_DICT } from 'src/constants/COUNTRIES';
import { useState } from 'react';
import { endpoint } from 'src/core/endpoints';
import { PostUpdateProfileResp } from 'src/core/endpoints/index.types';

export const useProfileUserShared = () => {
  const resolver = useMatch().data as { user: ProfileReq; badges: { badges: unknown[] } };
  const [user, setUser] = useState<ProfileReq>(resolver.user);
  const socialCauses = socialCausesToCategory(user.social_causes);
  const navigate = useNavigate();
  const avatarImage = user.avatar?.url ? user.avatar?.url : user.image?.url;
  const skills = skillsToCategory(user.skills);
  const [following, setFollowing] = useState<boolean>();

  function getCountryName(shortname?: keyof typeof COUNTRIES_DICT | undefined) {
    if (shortname && COUNTRIES_DICT[shortname]) {
      return COUNTRIES_DICT[shortname];
    } else {
      return shortname;
    }
  }

  function updateUser(params: PostUpdateProfileResp) {
    setUser((prev) => ({
      ...prev,
      avatar: params.avatar,
      first_name: params.first_name,
      last_name: params.last_name,
      username: params.username,
      bio: params.bio,
      social_causes: params.social_causes,
      city: params.city,
      country: params.country,
      cover_image: params.cover_image,
      mission: params.mission,
      skills: params.skills,
    }));
  }

  const address = `${user.city}, ${getCountryName(user.country as keyof typeof COUNTRIES_DICT | undefined)}`;

  const currentIdentity = useSelector<RootState, IdentityReq | undefined>((state) => {
    return state.identity.entities.find((identity) => identity.current);
  });

  const profileBelongToCurrentUser = currentIdentity?.id === user.id;

  function onClose() {
    hapticsImpactLight();
    navigate({ to: '/jobs' });
  }

  async function follow(id: string) {
    return endpoint.post.follows['{identity_id}'](id).then(() => setFollowing(true));
  }

  async function unfollow(id: string) {
    return endpoint.post.follows['{identity_id}/unfollow'](id).then(() => setFollowing(false));
  }

  function gotToDesktopAchievement() {
    const connectId = user.proofspace_connect_id ? user.proofspace_connect_id : null;
    navigate({ to: `/achievements/d?proofspace_connect_id=${connectId}` });
  }

  function gotToMobileAchievement() {
    hapticsImpactLight();
    const connectId = user.proofspace_connect_id ? user.proofspace_connect_id : null;
    navigate({ to: `/achievements/m?proofspace_connect_id=${connectId}` });
  }

  function navigateToEdit() {
    navigate({ to: '../edit' });
  }

  return {
    user,
    updateUser,
    address,
    badges: resolver.badges,
    socialCauses,
    avatarImage,
    skills,
    currentIdentity,
    profileBelongToCurrentUser,
    onClose,
    gotToDesktopAchievement,
    gotToMobileAchievement,
    navigateToEdit,
    follow,
    unfollow,
  };
};
