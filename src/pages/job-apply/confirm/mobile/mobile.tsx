import { useNavigate, useParams } from 'react-router-dom';
import { Button } from 'src/components/atoms/button/button';

import css from './mobile.module.scss';

export const Mobile = (): JSX.Element => {
  const navigate = useNavigate();
  const { company } = useParams();
  return (
    <div className={css.container}>
      <div className={css.main}>
        <div className={css.title}>Application sent!</div>
        <p className={css.message}>
          <span className={css.companyName}>{company}</span> has received your application to review. Wait for them to
          respond to you.
        </p>
      </div>
      <div className={css.btnContainer}>
        <Button onClick={() => navigate('/jobs')}>Back to jobs</Button>
      </div>
    </div>
  );
};
