import React, { Component } from 'react';
import { connect, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { RootState } from '../../reducers';
import Drafts from '../Drafts';

function DraftPageRedux(): JSX.Element {
  const auth = useSelector((state: RootState) => state.auth);

  return auth ? (
    <div className="width80">
      <Drafts />
    </div>
  ) : (
    <Redirect to="/" push />
  );
}

export default DraftPageRedux;
