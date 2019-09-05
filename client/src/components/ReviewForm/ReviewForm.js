import React, { Component } from "react";
import { Icon, DatePicker, Button, Input, Form, PageHeader, Steps } from "antd";
import { connect } from "react-redux";
import { exit_form } from "../../actions/index";
import moment from "moment";
const { Step } = Steps;
const { MonthPicker } = DatePicker;

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
    const authors = form.getFieldValue("authors");
    if (authors.length === 1) {
      return;
    }

    // can use data-binding to set
    const nextAuthors = authors.filter(author => author !== k);
    console.log(nextAuthors);

    form.setFieldsValue({
      authors: nextAuthors
    });
  };

  addAuthor = () => {
    const { form } = this.props;
    const authors = form.getFieldValue("authors");
    const nextAuthors = authors.concat("");
    form.setFieldsValue({
      authors: nextAuthors
    });
  };

  renderForm() {
    const { title, journal, doi, url, date } = this.props.data.review.metadata;

    const { getFieldDecorator, getFieldValue } = this.props.form;
    const default_author_names = this.props.data.review.metadata.authors.map(
      author => {
        return author.name;
      }
    );

    getFieldDecorator("authors", { initialValue: default_author_names });
    const authors = getFieldValue("authors");

    const author_fields = authors.map((author, index) => (
      <Form.Item key={author + index} label={index === 0 ? "Author Names" : ""}>
        {getFieldDecorator(`names[${index}]`, {
          rules: [
            {
              required: true,
              whitespace: true,
              message: "Field cannot be blank"
            }
          ],
          initialValue: author
        })(
          <Input
            placeholder="author_name"
            style={{ width: "50%", marginRight: 8 }}
          />
        )}
        {authors.length > 1 ? (
          <Icon
            className="dynamic-delete-button"
            type="minus-circle-o"
            onClick={() => this.removeAuthor(author)}
          />
        ) : null}
      </Form.Item>
    ));

    const author_render = (
      <div>
        {author_fields}
        <Button type="dashed" onClick={this.addAuthor} style={{ width: "60%" }}>
          <Icon type="plus" /> Add field
        </Button>
      </div>
    );

    const step0_content = (
      <Form layout="vertical" onSubmit={this.handleSubmit}>
        <Form.Item label="Paper Title">
          {getFieldDecorator("title", {
            rules: [{ required: true, message: "Paper title required" }],
            initialValue: title
          })(<Input />)}
        </Form.Item>

        {author_render}

        <Form.Item label="Journal">
          {getFieldDecorator("journal", {
            rules: [{ required: true, message: "rname!" }],
            initialValue: journal
          })(<Input />)}
        </Form.Item>

        <Form.Item label="DOI">
          {getFieldDecorator("DOI", {
            rules: [{ required: true, message: "Please input your username!" }],
            initialValue: doi
          })(<Input />)}
        </Form.Item>

        <Form.Item label="URL">
          {getFieldDecorator("url", {
            rules: [{ required: true, message: "Please input your username!" }],
            initialValue: url
          })(<Input />)}
        </Form.Item>

        <Form.Item label="Publication Date">
          {getFieldDecorator("month-picker", {
            rules: [
              {
                required: true
              }
            ],
            initialValue: moment(date, "YYYY-MM")
          })(<MonthPicker />)}
        </Form.Item>

        <Form.Item>
          <Button type="primary" onClick={() => this.next_step()}>
            Write Review
          </Button>
        </Form.Item>
      </Form>
    );

    const step1_content = (
      <Form layout="vertical" onSubmit={this.handleSubmit}>
        <Form.Item>
          <Button type="primary" onClick={() => this.next_step()}>
            Submit Review
          </Button>
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={() => this.prev_step()}>
            Edit Metadata
          </Button>
        </Form.Item>
      </Form>
    );

    const step2_content = <div>S3</div>;

    const content_blocks = [step0_content, step1_content, step2_content];

    return content_blocks[this.state.step];
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
