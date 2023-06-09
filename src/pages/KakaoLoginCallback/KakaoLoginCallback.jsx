import React, { useEffect } from 'react';
import * as S from './KakaoLoginCallback.style';
import { useCookies } from 'react-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  useGetUserTokenInfoQuery,
  useGetUserTokenMutation,
} from '../../redux/features/kakaoLogin';
import { setUserInfo } from '../../redux/features/userSlice';
import { message, Spin } from 'antd';

function KakaoLoginCallback() {
  const [, setCookie] = useCookies();
  const navigate = useNavigate();
  const { activeUser } = useSelector((state) => state.userInfo);

  const dispatch = useDispatch();

  const [
    getToken,
    {
      data: tokenData,
      isLoading: getTokenLoading,
      error: getTokenError,
      isSuccess: getTokenSuccess,
    },
  ] = useGetUserTokenMutation();
  const {
    data: tokenInfoData,
    isLoading: getTokenInfoLoading,
    error: getTokenInfoError,
    isSuccess: getTokenInfoSuccess,
  } = useGetUserTokenInfoQuery(tokenData?.access_token);

  let code = new URL(window.location.href).searchParams.get('code');

  useEffect(() => {
    if (code) {
      getToken(code);
    }
  }, [code]);

  useEffect(() => {
    dispatch(setUserInfo(code));
  }, [code]);

  const userId = tokenInfoData?.id;

  useEffect(() => {
    if (getTokenSuccess && tokenData?.access_token && getTokenInfoSuccess) {
      const { access_token } = tokenData;
      setCookie(
        'airoverflow',
        { access_token, userId },
        {
          path: '/',
          sameSite: 'lax',
          secure: true,
        }
      );
      navigate('/');
      // message
      //   .success('로그인에 성공했습니다. 원을 클릭해서 즐겨찾기에 저장해보세요.')
      //   .then(() => navigate('/'));
      // navigate('/');
    }
  }, [tokenData, tokenInfoData]);

  if (getTokenError && getTokenInfoError) {
    message
      .error('로그인에 문제가 발생했습니다.\n잠시 후 다시 시도해 주세요 :(')
      .then(() => navigate('/'));
  }

  if (getTokenInfoLoading) {
    return <div>토큰 정보 받는중</div>;
  }
  return (
    <S.Container>
      {(getTokenInfoLoading || getTokenLoading) && <Spin size="large" />}
    </S.Container>
  );
}

export default KakaoLoginCallback;
