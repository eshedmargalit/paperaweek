import React, { Component } from "react";
import { Icon, DatePicker, Button, Input, Form, PageHeader, Steps } from "antd";
import { connect } from "react-redux";
import { exit_form } from "../../actions/index";
import moment from "moment";
import "./ReviewForm.css";

const { Step } = Steps;
const { MonthPicker } = DatePicker;

var id = 3;

class ReviewForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      step: 0
    };
  }

  componentDidMount() {
    // To disable submit button at outset
    this.props.form.validateFields();
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log("Received values of form: ", values);
      }
    });
  };

  next_step() {
    this.setState({
      step: this.state.step + 1
    });
  }

  prev_step() {
    this.setState({
      step: this.state.step - 1
    });
  }

  removeAuthor = k => {
    const { form } = this.props;
    // can use data-binding to get
    const authors = form.getFieldValue("authors");
    // We need at least one passenger
    if (authors.length === 1) {
      return;
    }

    // can use data-binding to set
    form.setFieldsValue({
      authors: authors.filter(author => author !== k)
    });
  };

  addAuthor = () => {
    const { form } = this.props;
    // can use data-binding to get
    const authors = form.getFieldValue("authors");
    const nextAuthors = authors.concat(id++);
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      authors: nextAuthors
    });
  };

  removeInstitution = k => {
    const { form } = this.props;
    // can use data-binding to get
    const institutions = form.getFieldValue("institutions");
    // We need at least one passenger
    if (institutions.length === 1) {
      return;
    }

    // can use data-binding to set
    form.setFieldsValue({
      institutions: institutions.filter(institution => institution !== k)
    });
  };

  addInstitution = () => {
    const { form } = this.props;
    // can use data-binding to get
    const institutions = form.getFieldValue("institutions");
    const nextInstitutions = institutions.concat(id++);
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      institutions: nextInstitutions
    });
  };

  remove = k => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue("keys");
    // We need at least one passenger
    if (keys.length === 1) {
      return;
    }

    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key !== k)
    });
  };

  add = () => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue("keys");
    const nextKeys = keys.concat(id++);
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys
    });
  };

  renderForm() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 4 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 }
      }
    };
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 18, offset: 4 }
      }
    };
    getFieldDecorator("keys", { initialValue: [0, 1, 2] });
    getFieldDecorator("names[0]", { initialValue: "ah" });
    getFieldDecorator("names[1]", { initialValue: "uh" });
    getFieldDecorator("names[2]", { initialValue: "ooh" });
    const keys = getFieldValue("keys");
    const formItems = keys.map((k, index) => (
      <Form.Item
        {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
        label={index === 0 ? "Passengers" : ""}
        required={false}
        key={k}
      >
        {getFieldDecorator(`names[${k}]`, {
          validateTrigger: ["onChange", "onBlur"],
          rules: [
            {
              required: true,
              whitespace: true,
              message: "Please input passenger's name or delete this field."
            }
          ]
        })(
          <Input
            placeholder="passenger name"
            style={{ width: "60%", marginRight: 8 }}
          />
        )}
        {keys.length > 1 ? (
          <Icon
            className="dynamic-delete-button"
            type="minus-circle-o"
            onClick={() => this.remove(k)}
          />
        ) : null}
      </Form.Item>
    ));
    return (
      <Form onSubmit={this.handleSubmit}>
        {formItems}
        <Form.Item {...formItemLayoutWithOutLabel}>
          <Button type="dashed" onClick={this.add} style={{ width: "60%" }}>
            <Icon type="plus" /> Add field
          </Button>
        </Form.Item>
        <Form.Item {...formItemLayoutWithOutLabel}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    );
  }

  render() {
    return (
      <div>
        <div>
          <PageHeader
            title="Write a Review"
            subTitle="Search online for papers"
            onBack={() => {
              this.props.dispatch(exit_form());
            }}
          />
          <Steps current={this.state.step}>
            <Step title="Enter Paper Metadata" />
            <Step title="Write Review" />
            <Step title="Submit" subTitle="🎉" />
          </Steps>
        </div>
        <br />
        <div>{this.renderForm()}</div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    data: state
  };
};

export default connect(
  mapStateToProps,
  null
)(ReviewForm);
