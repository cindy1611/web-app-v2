import { Button } from 'src/components/atoms/button/button';
import { Input } from 'src/components/atoms/input/input';
import { Link } from 'src/components/atoms/link/link';
import { Typography } from 'src/components/atoms/typography/typography';
import { BottomStatic } from 'src/components/templates/bottom-static/bottom-static';
import { REGEX } from 'src/constants/REGEX';

import css from './desktop.module.scss';
import { useSignUpUserEmailShared } from '../sign-up-user-email.shared';

export const Desktop = (): JSX.Element => {
  const { form, onSubmit, navigateToSignIn } = useSignUpUserEmailShared();

  return (
    <BottomStatic>
      <div className={css.top}>
        <div className={css.header}>
          <Typography marginBottom=".5rem" type="heading" size="l">
            Join Socious
          </Typography>
          <Typography color="var(--color-gray-01)" type="body">
            Create an account and start
          </Typography>
        </div>
        <Input
          register={form}
          name="email"
          validations={{ pattern: REGEX.email }}
          label="Enter your email address"
          placeholder="Email"
        />
      </div>
      <div>
        <div className={css.bottom}>
          <Button disabled={!form.isValid} onClick={onSubmit}>
            Continue
          </Button>
          <Typography marginTop="1rem">
            <span>Already a member? </span>
            <Link onClick={navigateToSignIn}>Sign in</Link>
          </Typography>
        </div>
      </div>
    </BottomStatic>
  );
};
