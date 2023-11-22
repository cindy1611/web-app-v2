import { yupResolver } from '@hookform/resolvers/yup';
import { debounce } from 'lodash';
import { useEffect } from 'react';
import { useContext, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createOrganization, Location, preRegister, searchLocation } from 'src/core/api';
import { CurrentIdentity, uploadMedia } from 'src/core/api';
import { isTouchDevice } from 'src/core/device-type-detector';
import { removeValuesFromObject } from 'src/core/utils';
import { useUser } from 'src/Nowruz/modules/Auth/contexts/onboarding/sign-up-user-onboarding.context';
import { RootState } from 'src/store';
import * as yup from 'yup';

type Inputs = {
  email: string;
  username: string;
};
const schema = yup.object().shape({
  email: yup
    .string()
    .matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, 'Enter a correct email')
    .required('Email is required'),
  username: yup.string().required('username is required'),
});

const companySizeOptions = [
  { value: 'A', label: 'Self-employed' },
  { value: 'B', label: '1-10 employees' },
  { value: 'C', label: '11-50 employees' },
  { value: 'D', label: '51-200 employees' },
  { value: 'E', label: '201-500 employees' },
  { value: 'F', label: '501-1000 employees' },
  { value: 'G', label: '1001-5000 employees' },
  { value: 'H', label: '5001-10,000 employees' },
  { value: 'I', label: '10,001+ employees' },
];
export const useOrganizationContact = () => {
  const { state, updateUser } = useUser();
  const [isUsernameValid, setIsusernameValid] = useState(false);
  const isMobile = isTouchDevice();

  const currentIdentity = useSelector<RootState, CurrentIdentity>((state) => {
    const current = state.identity.entities.find((identity) => identity.current);
    return current as CurrentIdentity;
  });
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    control,
    clearErrors,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const { orgName, orgType, social_causes, bio, image, city, country, email, website, size, username } = state;
    console.log({
      name: orgName,
      type: orgType.value,
      size: size.value,
      social_causes,
      bio,
      email,
      website,
      city,
      country,
    });
    try {
      const response = await createOrganization(
        removeValuesFromObject(
          {
            name: orgName,
            type: orgType.value,
            size: size.value,
            social_causes,
            bio,
            email,
            website,
            city,
            country,
            username,
          },
          ['', null],
        ),
      );
      if (isMobile) navigate(`sign-up/user/notification`);
      else navigate(`/profile/users/${currentIdentity.meta?.username}/view`);
    } catch (error) {}
  };
  const username = watch('username');

  const searchCities = async (searchText: string, cb) => {
    console.log(searchText);
    try {
      if (searchText) {
        const response = await searchLocation(searchText);
        cb(cityToOption(response.items));
      }
    } catch (error) {
      console.error('Error fetching city data:', error);
    }
  };
  const cityToOption = (cities: Location[]) => {
    return cities.map((city) => ({
      label: `${city.name}, ${city.region_name}`,
      value: city.country_code,
    }));
  };
  useEffect(() => {
    if (username) {
      debouncedCheckUsername(username);
    } else clearErrors('username');
  }, [username]);
  const onSelectCity = (location) => {
    console.log(location);
    updateUser({ ...state, city: location.label, country: location.value });
  };
  const checkUsernameAvailability = async (shortname: string) => {
    const checkUsername = await preRegister({ shortname });
    if (checkUsername.shortname === null) {
      console.log(checkUsername);
      setIsusernameValid(true);
      clearErrors('username');
    } else {
      setIsusernameValid(false);
      setError('username', {
        type: 'manual',
        message: 'Username is not available',
      });
    }
  };
  const debouncedCheckUsername = debounce(checkUsernameAvailability, 800);

  const onSelectSize = (size) => {
    updateUser({ ...state, size });
  };

  const updateEmail = (email: string) => updateUser({ ...state, email });
  const updateUsername = (username: string) => updateUser({ ...state, username });

  const updateWebsite = (website: string) => {
    console.log(errors);
    updateUser({ ...state, website: 'https://' + website });
  };
  const isFormValid = state.city !== '' && state.size !== null && state.emali !== '';
  return {
    register,
    handleSubmit,
    errors,
    onSubmit,
    companySizeOptions,
    control,
    setValue,
    searchCities,
    updateEmail,
    updateWebsite,
    onSelectCity,
    onSelectSize,
    isFormValid,
    isUsernameValid,
    updateUsername,
  };
};
