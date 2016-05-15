var Hello = React.createClass({displayName: "Hello",
  render: function() {
    return React.createElement("div", null, "Hello ", this.props.name);
  }
});

ReactDOM.render(
  React.createElement(Hello, {name: "Wendy"}),
  document.getElementById('example')
);