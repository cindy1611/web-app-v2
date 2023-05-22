import { BottomStatic } from 'src/components/templates/bottom-static/bottom-static';
import css from './desktop.module.scss';
import { Input } from 'src/components/atoms/input/input';
import { Button } from 'src/components/atoms/button/button';
import { useChangePasswordShared } from '../change-password.shared';
import { Header } from 'src/components/atoms/header-v2/header';
import { printWhen } from 'src/core/utils';
import { Card } from 'src/components/atoms/card/card';

export const Desktop = (): JSX.Element => {
  const { form, onSubmit, formIsValid, notMatchingPasswords } = useChangePasswordShared();
  return (
    <div className={css.container}>
      <Card>
        <Header title="Change Password" />
        <form className={css.form}>
          <Input
            autoComplete="password"
            register={form}
            name="current_password"
            label="Current password"
            type="password"
            placeholder="Current password"
          />
          <Input
            autoComplete="new-password"
            register={form}
            name="password"
            label="New password"
            type="password"
            placeholder="New password"
          />
          <Input
            autoComplete="new-password"
            register={form}
            name="confirm_new_password"
            label="Confirm new password"
            type="password"
            placeholder="Confirm new password"
          />
          {printWhen(<p className={css.passNotMatch}>- Passwords do not match</p>, notMatchingPasswords)}
        </form>
        <div>
          <div className={css.bottom}>
            <Button disabled={!formIsValid} onClick={onSubmit()} color="blue">
              Change your password
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
