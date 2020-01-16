import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { updateDraftId, updateDrafts, startReview } from '../../actions';
import SearchableReviewDisplay from '../SearchableReviewDisplay';

class DraftsRedux extends Component {
  constructor(props) {
    super(props);

    this.state = {
      redirectHome: false,
    };
  }

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
    this.props.dispatch(updateDraftId(draftId));
    this.props.dispatch(startReview(null, draftContent));
  };

  redirectHome = () => {
    this.setState({ redirectHome: true });
  };

  render() {
    const pageHeaderProps = {
      pageHeaderTitle: 'Read Your Drafts',
      onPageBack: this.redirectHome,
    };
    const { activeReview, drafts } = this.props;
    let { showForm } = activeReview;

    if (showForm) {
      return <Redirect to="/form" push />;
    }

    if (this.state.redirectHome) {
      return <Redirect to="/dashboard" push />;
    }

    return (
      <SearchableReviewDisplay
        reviews={drafts}
        deleteReview={this.deleteDraft}
        handleModalEdit={this.handleModalEdit}
        pageHeaderProps={pageHeaderProps}
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
