import { Accordion } from 'src/components/atoms/accordion/accordion';
import { ApplicantList } from 'src/components/molecules/applicant-list/applicant-list';

import css from './applicants.module.scss';
import { applicantToApplicantListAdaptor } from '../../../job-offer-reject.services';
import { ApplicantsProps } from '../applicants/applicants.types';

export const Applicants = (props: ApplicantsProps): JSX.Element => {
  const { toReviewList, declinedList } = props;

  return (
    <div className={css.container}>
      <Accordion id="to-review" title={`To review (${toReviewList.total_count})`}>
        <ApplicantList list={applicantToApplicantListAdaptor(toReviewList.items)} />
      </Accordion>
      <Accordion id="declined" title={`Declined (${declinedList.total_count})`}>
        <ApplicantList list={applicantToApplicantListAdaptor(declinedList.items)} />
      </Accordion>
    </div>
  );
};
