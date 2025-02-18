import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { Accordion } from 'src/components/atoms/accordion/accordion';
import { Button } from 'src/components/atoms/button/button';
import { Card } from 'src/components/atoms/card/card';
import { BackLink } from 'src/components/molecules/back-link';
import { CardMenu } from 'src/components/molecules/card-menu/card-menu';
import { JobCardList } from 'src/components/organisms/job-card-list/job-card-list';
import { ProfileCard } from 'src/components/templates/profile-card';
import { TwoColumnCursor } from 'src/components/templates/two-column-cursor/two-column-cursor';
import { printWhen } from 'src/core/utils';
import { useAuth } from 'src/hooks/use-auth';
import { SocialCausesModal } from 'src/pages/job-create/social-causes/social-causes-modal';

import css from './desktop.module.scss';
import { useMyJobShared } from '../my-job.shared';
import { getActiveJobs, jobListToJobCardListAdaptor } from '../my-jobs.services';
import { MyJobs } from '../my-jobs.types';

export const Desktop: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const {
    onGoingTitle,
    activeJobList,
    setActiveJobList,
    navigateToOverview,
    activeJobs,
    updateActiveJobList,
    draftTitle,
    draftJobList,
    draftJobs,
    updateDraftJobList,
    archivedTitle,
    archivedJobs,
    archivedJobList,
    updateArchivedJobList,
  } = useMyJobShared();
  const [myJobsMode, setMyJobsMode] = useState<MyJobs>('Created');
  const [openSocialCausesModal, setOpenSocialCausesModal] = useState(false);
  const [onGoingTitleUpdate, setOnGoingTitleUpdate] = useState(onGoingTitle);

  const NetworkMenuList = [
    { label: 'Connections', icon: '/icons/connection.svg', link: () => navigate('/network/connections') },
    { label: 'Following', icon: '/icons/followers.svg', link: () => navigate('/network/followings') },
  ];

  const JobsMenuList = [
    { label: 'Created', icon: '/icons/folder-black.svg', link: () => setMyJobsMode('Created') },
    { label: 'Archived', icon: '/icons/archived.svg', link: () => setMyJobsMode('Archived') },
  ];

  async function onCreateJob() {
    const identityId = id;
    const payload = { identityId, page: 1 };
    getActiveJobs(payload).then((data) => {
      setActiveJobList({ ...data, items: jobListToJobCardListAdaptor(data.items) });
      setOnGoingTitleUpdate(`On-Going (${data.total_count})`);
    });
  }

  const myJobsCreatedJSX = (
    <>
      <Button color="blue" className={css.createJobBtn} onClick={() => setOpenSocialCausesModal(true)}>
        <img src="/icons/plus.svg" height={16} width={16} />
        Create job
      </Button>
      <Card className={css.webCard}>
        <Accordion id="on-going" title={onGoingTitleUpdate}>
          {printWhen(
            <div className={css.listContainer}>
              <JobCardList
                list={activeJobList.items}
                onItemClick={navigateToOverview}
                showMore={activeJobList.items.length < activeJobs.total_count}
                onSeeMoreClick={updateActiveJobList}
              />
            </div>,
            !!activeJobList.items.length,
          )}
        </Accordion>
        <Accordion id="drafts" title={draftTitle} no_border>
          {printWhen(
            <div className={css.listContainer}>
              <JobCardList
                list={draftJobList.items}
                onItemClick={navigateToOverview}
                showMore={draftJobList.items.length < draftJobs.total_count}
                onSeeMoreClick={updateDraftJobList}
              />
            </div>,
            !!draftJobList.items.length,
          )}
        </Accordion>
      </Card>
    </>
  );

  const myJobsArchivedJSX = (
    <Card className={css.webCard}>
      <Accordion id="archived" title={archivedTitle}>
        {printWhen(
          <div className={css.listContainer}>
            <JobCardList
              list={archivedJobList.items}
              onItemClick={navigateToOverview}
              showMore={archivedJobList.items.length < archivedJobs.total_count}
              onSeeMoreClick={updateArchivedJobList}
            />
          </div>,
          !!archivedJobList.items.length,
        )}
      </Accordion>
    </Card>
  );

  return (
    <>
      <TwoColumnCursor visibleSidebar={isLoggedIn}>
        <div className={css.leftContainer}>
          <BackLink title="Jobs" onBack={() => navigate('/jobs')} />
          <ProfileCard />
          <CardMenu title="Network" list={NetworkMenuList} />
          <CardMenu title="My Jobs" list={JobsMenuList} />
        </div>
        <div className={css.rightContainer}>
          <Card className={css.created}>{myJobsMode}</Card>
          {printWhen(myJobsCreatedJSX, myJobsMode === 'Created')}
          {printWhen(myJobsArchivedJSX, myJobsMode === 'Archived')}
        </div>
      </TwoColumnCursor>
      <SocialCausesModal
        open={openSocialCausesModal}
        onClose={() => setOpenSocialCausesModal(false)}
        onDone={onCreateJob}
        onOpen={() => setOpenSocialCausesModal(true)}
      />
    </>
  );
};
