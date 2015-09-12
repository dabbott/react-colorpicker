var Colr = require('colr');
var React = require('react');
var ColorPicker = require('../lib/index');

window.React = React;
// React.initializeTouchEvents(true);

var App = React.createClass({

  getInitialState: function () {
    return {
      color: '#000000',
      opacity: 100
    };
  },

  setColor: function () {
    var color = Colr.fromRgb(
      Math.random() * 255,
      Math.random() * 255,
      Math.random() * 255
    );

    // replace current color and origin color
    this.setState({
      color: color.toHex(),
      opacity: Math.round(Math.random() * 100)
    });
  },

  handleChange: function (color, opacity) {
    this.setState({
      color: color.toHex(),
      opacity: opacity
    });
  },

  render: function () {
    /* jshint ignore: start */
    return (
      <div>
        <button onClick={this.setColor}>Load Random Color</button>
        <div>Active: {this.state.color + ' ' + this.state.opacity}</div>

        <div id='container'>
          <ColorPicker
            color={this.state.color}
            opacity={this.state.opacity}
            onChange={this.handleChange}
          />
        </div>
      </div>
    );
    /* jshint ignore: end */
  },

});

document.addEventListener('DOMContentLoaded', function () {
  React.render(React.createFactory(App)(), document.body);
});
