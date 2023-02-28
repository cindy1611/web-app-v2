import css from './sign-up-user-email.module.scss';
import { useNavigate } from '@tanstack/react-location';
import { REGEX } from '../../../constants/REGEX';
import { Button } from '../../../components/atoms/button/button';
import { Input } from '../../../components/atoms/input/input';
import { Link } from '../../../components/atoms/link/link';
import { Typography } from '../../../components/atoms/typography/typography';
import { BottomStatic } from '../../../components/templates/bottom-static/bottom-static';
import { register } from './sign-up-user-email.services';
import { formModel } from './sign-up-user-email.form';
import { useForm } from '../../../core/form';
import { getFormValues } from '../../../core/form/customValidators/formValues';
import { handleError } from '../../../core/api';

export const SignUpUserEmail = (): JSX.Element => {
  const form = useForm(formModel);
  const navigate = useNavigate();

  function onSubmit() {
    const formValues = getFormValues(form);
    register(formValues)
      .then(() => localStorage.setItem('email', formValues.email))
      .then(() => navigate({ to: '../verification' }))
      .catch(handleError());
  }

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
            <Link onClick={() => navigate({ to: '/sign-in' })}>Sign in</Link>
          </Typography>
        </div>
      </div>
    </BottomStatic>
  );
};
