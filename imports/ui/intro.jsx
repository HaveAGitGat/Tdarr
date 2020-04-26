import React, { Component } from "react";
import ReactDOM from "react-dom";
import Main from "/imports/ui/App";
import ReactLoading from "react-loading";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  state = {
    loading: true,
  };

  componentDidMount() {
    // this simulates an async action, after which the component will render the content
    // Get the components DOM node
    var elem = ReactDOM.findDOMNode(this);

    // Set the opacity of the element to 0
    elem.style.opacity = 1;
    window.requestAnimationFrame(function () {
      // Now set a transition on the opacity
      elem.style.transition = "opacity 1000ms";
      // and set the opacity to 1
      elem.style.opacity = 0;
    });
    demoAsyncCall().then(() => this.setState({ loading: false }));
  }

  render() {
    const { loading } = this.state;

    if (loading) {
      //return <img  border="0" hspace="0" src={'/images/1.jpg'} alt="logo" />;
      return (
        <div className={"intro"}>
          <div className={"wheel"}>
            <ReactLoading
              type={"spin"}
              color={"#66ccff"}
              height={"100%"}
              width={"100%"}
            />
          </div>
        </div>
      );
    }
    return this.state.isLoading ? "" : <Main />;
  }
}

function demoAsyncCall() {
  return new Promise((resolve) => setTimeout(() => resolve(), 0));
}
