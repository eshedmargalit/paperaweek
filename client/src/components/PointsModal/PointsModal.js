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
    return (
      <Modal title="Congratulations! 🎉" visible={displayModal} onOk={this.closeModal} onCancel={this.closeModal}>
        <h3>You just earned {increment} points!</h3>
        <p>That brings you up to {points} points, nice! </p>
        <p>{reason}</p>
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
