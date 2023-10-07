import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { IdentityReq } from 'src/core/types';
import { RootState } from 'src/store';

import { getOrganizationJobs } from './jobs-index.service';

export const useJobsIndexShared = () => {
  const { data } = useLoaderData();
  const [jobList, setJobList] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1 });
  const navigate = useNavigate();
  const identities = useSelector<RootState, IdentityReq | undefined>((state) => state.identity.entities);
  useEffect(() => {
    getOrganizationJobs({ identityId: data.user.id, page: pagination.page }).then((resp) => {
      setJobList((list) => [...list, ...resp.items]);
      setPagination({ ...pagination, total: resp.total_count });
    });
  }, []);

  function onMorePage() {
    getOrganizationJobs({ identityId: data.user.id, page: pagination.page + 1 }).then((resp) => {
      setPagination((v) => ({ ...pagination, page: pagination.page + 1 }));
      setJobList((list) => [...list, ...resp.items]);
    });
  }

  function goToJobDetail(id: string) {
    navigate(`/jobs/${id}`);
  }

  const showMorePageBtn = jobList.length < pagination.total;

  return { jobList, identities, goToJobDetail, data, showMorePageBtn, onMorePage };
};
