import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { updateDrafts, startReview } from '../../actions';
import SearchableReviewDisplay from '../SearchableReviewDisplay';

class DraftsRedux extends Component {
  deleteDraft = draftToDelete => {
    let { drafts, user } = this.props;
    let newDrafts = drafts.filter(draft => {
      return draft !== draftToDelete;
    });
    this.props.dispatch(updateDrafts(newDrafts));

    let headers = {
      'content-type': 'application/json',
      userid: user.userid,
    };

    fetch('/api/drafts', {
      method: 'delete',
      headers: headers,
      body: JSON.stringify(draftToDelete),
    }).then(response => response.json());
  };

  handleModalEdit = draft => {
    const draftId = draft._id;
    const draftContent = {
      paper: draft.paper,
      review: draft.review,
    };
    this.props.dispatch(startReview(null, draftId, draftContent));
  };

  render() {
    const { activeReview, drafts } = this.props;
    let { showForm } = activeReview;
    const formRedirect = <Redirect to="/form" push />;
    return showForm ? (
      formRedirect
    ) : (
      <SearchableReviewDisplay
        reviews={drafts}
        deleteReview={this.deleteDraft}
        handleModalEdit={this.handleModalEdit}
      />
    );
  }
}

const mapStateToProps = ({ user, drafts, activeReview }) => {
  return {
    activeReview,
    user,
    drafts,
  };
};

export default connect(
  mapStateToProps,
  null
)(DraftsRedux);
