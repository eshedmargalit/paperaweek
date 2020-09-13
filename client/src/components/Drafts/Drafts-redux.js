import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { updateDraftId, updateDrafts, setReview } from '../../actions';
import SearchableReviewDisplay from '../SearchableReviewDisplay';

class DraftsRedux extends Component {
  constructor(props) {
    super(props);

    this.state = {
      redirectHome: false,
    };
  }

  deleteDraft = draftToDelete => {
    let { drafts } = this.props;
    let newDrafts = drafts.filter(draft => {
      return draft !== draftToDelete;
    });
    this.props.dispatch(updateDrafts(newDrafts));

    axios.delete(`/api/drafts/${draftToDelete._id}`);
  };

  handleModalEdit = draft => {
    const draftId = draft._id;
    const draftContent = {
      paper: draft.paper,
      review: draft.review,
    };
    this.props.dispatch(updateDraftId(draftId));
    this.props.dispatch(setReview(null, draftContent));
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
        handleModalCopy={null}
        pageHeaderProps={pageHeaderProps}
        itemName="Draft"
      />
    );
  }
}

const mapStateToProps = ({ drafts, activeReview }) => {
  return {
    activeReview,
    drafts,
  };
};

export default connect(mapStateToProps, null)(DraftsRedux);
