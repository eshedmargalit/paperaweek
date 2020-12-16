import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { RootState } from '../../reducers';
import { User } from '../../types';
import Drafts from '../Drafts';

function DraftPageRedux(): JSX.Element {
  const user: User = useSelector((state: RootState) => state.auth);

  if (!user) return <Redirect to="/" push />;

  return (
    <div className="width80">
      <Drafts />
    </div>
  );
}

export default DraftPageRedux;
