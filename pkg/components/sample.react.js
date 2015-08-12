'use strict';

var React = require('../util/react');
var Colr = require('colr');
var PureRenderMixin = require('react/lib/ReactComponentWithPureRenderMixin');

var OnChangeMixin = require('../mixin/onchange.react');

var Sample = React.createClass({displayName: "Sample",

  mixins: [
    OnChangeMixin,
    PureRenderMixin,
  ],

  propTypes: {
    color: React.PropTypes.string.isRequired,
    origin: React.PropTypes.string.isRequired,
  },

  loadOrigin: function () {
    this.props.onChange(this.props.origin);
  },

  render: function () {
    var colors = Colr.fromHex(this.props.color).toRgbArray(),
        colorString;

    colors.push(this.props.colorOpacity / 100);
    colorString = 'rgba(' + colors.join(',') + ')';

    return (
      /* jshint ignore: start */
      React.createElement("div", {className: "sample"}, 
        React.createElement("div", {
          className: "current", 
          style: {background: colorString}}
        )
        /*<div
          className='origin'
          style={{background: this.props.origin, opacity: this.props.originOpacity / 100}}
          onClick={this.loadOrigin}
        />*/
      )
      /* jshint ignore: end */
    );
  }

});

module.exports = Sample;
