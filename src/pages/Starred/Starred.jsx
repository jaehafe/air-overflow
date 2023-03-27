import React from 'react';
import * as S from './Starred.style';
import { useCookies } from 'react-cookie';
import { useGetStarOfCurrentLoggedInUserQuery } from '../../redux/features/starred';
import DisplayStarredOnMap from '../../components/DisplayStarredOnMap/DisplayStarredOnMap';

function Starred() {
  const [cookie] = useCookies(['airoverflow']);
  console.log('cookie.airoverflow?.userId', cookie?.airoverflow?.userId);

  const loggedInUserId = cookie?.airoverflow?.userId;

  const {
    data: starredData,
    isLoading: isLoadingGetStarred,
    isError: isErrGetStarred,
  } = useGetStarOfCurrentLoggedInUserQuery();

  if (isLoadingGetStarred) {
    return <div>Loading...</div>;
  }

  if (isErrGetStarred) {
    return <div>Error loading starred data.</div>;
  }

  const starredDataEntries = starredData ? Object.entries(starredData) : [];
  const allStarredDataArr = starredDataEntries.map(([key, value]) => {
    return { id: key, value };
  });

  const loggedInUserData = allStarredDataArr.filter(
    (data) => data.value.userId === loggedInUserId
  );

  console.log('loggedInUserData', loggedInUserData);

  // console.log('starredDataEntries', starredDataEntries);

  // console.log('starredDataArr', starredDataArr);

  //////////////////////////////////////

  return (
    <>
      <DisplayStarredOnMap
        allStarredDataArr={allStarredDataArr}
        loggedInUserData={loggedInUserData}
      />
    </>
  );
}

export default Starred;