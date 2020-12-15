import React, { Component } from 'react';
import { connect, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { RootState } from '../../reducers';
import Drafts from '../Drafts';

function DraftPageRedux(): JSX.Element {
  const auth = useSelector((state: RootState) => state.auth);

  if (!auth) return <Redirect to="/" push />;

  return (
    <div className="width80">
      <Drafts />
    </div>
  );
}

export default DraftPageRedux;
