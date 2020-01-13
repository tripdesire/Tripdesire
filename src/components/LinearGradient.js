import RNLinearGradient from "react-native-linear-gradient";
import React from "react";

class LinearGradient extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <RNLinearGradient
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
        colors={this.props.colors}
        style={this.props.style}>
        {this.props.children}
      </RNLinearGradient>
    );
  }
}

export default LinearGradient;
