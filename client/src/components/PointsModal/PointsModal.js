import React, { Component } from 'react';
import { Modal } from 'antd';
import { connect } from 'react-redux';
import { hidePointsModal } from '../../actions';

class Login extends Component {
  closeModal = () => {
    this.props.dispatch(hidePointsModal());
  };

  componentDidMount() {}

  render() {
    let { increment, reason, points, displayModal } = this.props.points;
    const incrementString = increment === 1 ? 'point' : 'points';
    const currentPointsString = points === 1 ? 'point' : 'points';
    return (
      <Modal title="Congratulations! 🎉" visible={displayModal} onOk={this.closeModal} onCancel={this.closeModal}>
        <h3>
          You just earned {increment} {incrementString}!
        </h3>
        <p>
          That brings you up to {points} {currentPointsString}, nice!{' '}
        </p>
        <div dangerouslySetInnerHTML={{ __html: reason }}></div>
      </Modal>
    );
  }
}

const mapStateToProps = ({ points }) => {
  return { points };
};

export default connect(
  mapStateToProps,
  null
)(Login);
