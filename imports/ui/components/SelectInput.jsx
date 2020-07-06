import { Form } from "react-bootstrap";
import React from "react";

export class SelectInput extends React.Component {
  constructor(props) {
    super(props);
  }
  
  getOptions() {
    let res = [];
    
    for (const [key, value] of Object.entries(this.props.items)) {
      res.push(<option key={key} value={key}>{value}</option>);
    }

    return res;
  }
  
  render() {
    return (
      <Form>
        <Form.Control 
          as="select" 
          onChange={this.props.onChangeHandler}
          className={"selectInput " + this.props.className}
        >
        {this.getOptions()}
        </Form.Control>
      </Form>
      )
    }
  }
