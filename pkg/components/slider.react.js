'use strict';

var React = require('../util/react');
var ReactDOM = require('../util/react-dom');
var PureRenderMixin = require('react/lib/ReactComponentWithPureRenderMixin');
var classnames = require('classnames');

var clamp = require('../util/clamp');
var DraggableMixin = require('../mixin/draggable.react');
var OnChangeMixin = require('../mixin/onchange.react');

var Slider = React.createClass({displayName: "Slider",

  mixins: [
    DraggableMixin,
    OnChangeMixin,
    PureRenderMixin,
  ],

  propTypes: {
    vertical: React.PropTypes.bool.isRequired,
    value: React.PropTypes.number.isRequired,
  },

  updatePosition: function (clientX, clientY) {
    var el = ReactDOM.findDOMNode(this.refs.root);
    var rect = el.getBoundingClientRect();

    var value;
    if (this.props.vertical) {
      value = (rect.bottom - clientY) / rect.height;
    } else {
      value = (clientX - rect.left) / rect.width;
    }

    value = this.getScaledValue(value);
    this.props.onChange(value);
  },

  render: function () {
    var classes = classnames({
      slider: true,
      vertical: this.props.vertical,
      horizontal: ! this.props.vertical
    });

    var styles = {};
    var attr = this.props.vertical ? 'bottom' : 'left';
    styles[attr] = this.getPercentageValue(this.props.value);

    var trackStyles = {};
    if (this.props.background) {
      trackStyles.background = this.props.background;
    }

    return (
      /* jshint ignore: start */
      React.createElement("div", {
        className: classes, 
        onMouseDown: this.startUpdates, 
        onTouchStart: this.startUpdates, 
        ref: 'root'
      }, 
        React.createElement("div", {className: "track", style: trackStyles}), 
        React.createElement("div", {className: "pointer", style: styles})
      )
      /* jshint ignore: end */
    );
  }

});

module.exports = Slider;
