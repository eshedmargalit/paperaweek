import React, { Component } from "react";
import { Row, Col, Button, FormGroup, Input } from "reactstrap";
import { FaTimesCircle } from "react-icons/fa";

class ExpandableList extends Component {
  addNewHandler = () => {
    this.props.itemUpdateHandler("", this.props.items.length);
  };

  render() {
    const n_items = this.props.items.length;
    let items_list = this.props.items.map((item, i) => {
      let close_button_render = (
        <Col lg="1" xs="1">
          <Button
            outline
            color="link"
            onClick={() => this.props.itemUpdateHandler("_DELETE", i)}
          >
            <FaTimesCircle />
          </Button>
        </Col>
      );

      if (n_items === 1) {
        close_button_render = null;
      }

      return (
        <Row key={item + i} style={{ marginBottom: "5px" }}>
          <Col lg="9" xs="9">
            <Input
              type="text"
              autoFocus
              key={"input_num" + i}
              value={item}
              onChange={e => this.props.itemUpdateHandler(e.target.value, i)}
              onKeyPress={event => {
                if (event.key === "Enter") {
                  this.addNewHandler();
                }
              }}
            />
          </Col>
          {close_button_render}
        </Row>
      );
    });

    let list_render = <FormGroup>{items_list}</FormGroup>;

    // new button
    let new_button = (
      <Button outline size="sm" color="primary" onClick={this.addNewHandler}>
        Add {this.props.item_name}
      </Button>
    );

    return (
      <div>
        {list_render}
        {new_button}
        <br />
      </div>
    );
  }
}
export default ExpandableList;
