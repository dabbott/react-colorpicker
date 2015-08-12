'use strict';

var React = require('../util/react');

var clamp = require('../util/clamp');

var DraggableMixin = {

  propTypes: {
    max: React.PropTypes.number
  },

  getDefaultProps: function () {
    return {
      max: 1
    };
  },

  getInitialState: function () {
    return {
      active: false
    };
  },

  startUpdates: function (e) {
    var coords = this.getPosition(e);
    this.setState({ active: true });
    this.updatePosition(coords.x, coords.y);

    document.addEventListener('mousemove', this.handleUpdate);
    document.addEventListener('touchmove', this.handleUpdate);
    document.addEventListener('mouseup', this.stopUpdates);
    document.addEventListener('touchend', this.stopUpdates);
  },

  handleUpdate: function (e) {
    if (this.state.active) {
      e.preventDefault();
      var coords = this.getPosition(e);
      this.updatePosition(coords.x, coords.y);
    }
  },

  stopUpdates: function () {
    if (this.state.active) {
      this.setState({ active: false });

      document.removeEventListener('mousemove', this.handleUpdate);
      document.removeEventListener('touchmove', this.handleUpdate);
      document.removeEventListener('mouseup', this.stopUpdates);
      document.removeEventListener('touchend', this.stopUpdates);
    }
  },

  getPosition : function (e) {
    if (e.touches) {
      e = e.touches[0];
    }

    return {
      x : e.clientX,
      y : e.clientY
    };
  },

  getPercentageValue : function (value) {
    return (value / this.props.max) * 100 + "%";
  },

  getScaledValue : function (value) {
    return clamp(value, 0, 1) * this.props.max;
  }

};

module.exports = DraggableMixin;
