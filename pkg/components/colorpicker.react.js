'use strict';

var React = require('../util/react');
var Colr = require('colr');
var classnames = require('classnames');

var Details = require('./details.react');
var Map = require('./map.react');
var Sample = require('./sample.react');
var Slider = require('./slider.react');
var OnChangeMixin = require('../mixin/onchange.react');

var ColorPicker = React.createClass({displayName: "ColorPicker",

  mixins: [OnChangeMixin],

  propTypes: {
    color: React.PropTypes.string,
    opacity: React.PropTypes.number
  },

  // default color
  getDefaultProps: function () {
    return {
      color: '#000000',
      opacity: 100
    };
  },

  // compare props against state using hex strings
  // only use the new props if the color is different
  // this prevents data loss when converting between RGB and HSV
  componentWillReceiveProps: function(nextProps) {
    var nextColor = nextProps.color.toLowerCase();
    var currentColor = Colr.fromHsvObject(this.state.hsv).toHex();

    if (nextColor !== currentColor || nextProps.opacity !== this.state.colorOpacity) {
      this.setState(this.getStateFrom(nextProps.color, nextProps.opacity,
          nextProps.opacity));
    }
  },

  // create the initial state using props.color
  getInitialState: function () {
    return this.getStateFrom(this.props.color, this.props.opacity,
        this.props.opacity);
  },

  // generate state object from a hex string
  getStateFrom: function (color, colorOpacity, originOpacity) {
    color = Colr.fromHex(color);
    return {
      color: color,
      colorOpacity: colorOpacity,
      origin: color.clone(),
      originOpacity: originOpacity,
      hsv: color.toRawHsvObject()
    };
  },

  render: function () {
    var hue = this.getBackgroundHue();
    var luminosity = this.state.color.toGrayscale();

    var classes = classnames({
      dark: luminosity <= 128,
      light: luminosity > 128,
    });

    return (
      /* jshint ignore: start */
      React.createElement("div", {className: "colorpicker"}, 
        React.createElement("div", {className: "vbox"}, 
          React.createElement(Map, {
            x: this.state.hsv.s, 
            y: this.state.hsv.v, 
            max: 100, 
            backgroundColor: hue, 
            className: classes, 
            onChange: this.setSaturationAndValue}
          ), 
          React.createElement("div", {className: "hbox"}, 
            React.createElement("div", {className: "vbox sliders-container"}, 
              React.createElement("div", {className: "hue-slider"}, 
                React.createElement(Slider, {
                  vertical: false, 
                  value: this.state.hsv.h, 
                  max: 360, 
                  onChange: this.setHue}
                )
              ), 
              React.createElement("div", {className: "opacity-slider"}, 
                React.createElement(Slider, {
                  vertical: false, 
                  value: this.state.colorOpacity, 
                  max: 100, 
                  onChange: this.setOpacity, 
                  background: this.buildOpacityGradient(this.state.color)}
                )
              )
            ), 
            React.createElement(Sample, {
              color: this.state.color.toHex(), 
              colorOpacity: this.state.colorOpacity, 
              origin: this.state.origin.toHex(), 
              originOpacity: this.state.originOpacity, 
              onChange: this.loadColor}
            )
          )
        ), 
        /*<Details
          color={this.state.color}
          hsv={this.state.hsv}
          onChange={this.loadColor}
        />*/
        this.props.children
      )
      /* jshint ignore: end */
    );
  },

  buildOpacityGradient: function (color) {
    var rgbString = this.state.color.toRgbArray().join(',');
    return 'linear-gradient(to left,' +
      'rgba(' + rgbString + ',1) 0%,' +
      'rgba(' + rgbString + ',0) 100%' +
    ')';
  },

  // replace current color with another one
  loadColor: function (color, colorOpacity) {
    colorOpacity = typeof colorOpacity === 'undefined' ? 100 : colorOpacity;
    this.setState(this.getStateFrom(color, colorOpacity, colorOpacity));
    this.props.onChange(Colr.fromHex(color), colorOpacity);
  },

  // update the current color using the raw hsv values
  update: function () {
    var color = Colr.fromHsvObject(this.state.hsv);
    this.setState({ color: color });
    this.props.onChange(color, this.state.colorOpacity);
  },

  // set the hue
  setHue: function (hue) {
    this.state.hsv.h = hue;
    this.update();
  },

  // set the saturation
  setSaturation: function (saturation) {
    this.state.hsv.s = saturation;
    this.update();
  },

  // set the value
  setValue: function (value) {
    this.state.hsv.v = value;
    this.update();
  },

  // set the saturation and the value
  setSaturationAndValue: function (saturation, value) {
    this.state.hsv.s = saturation;
    this.state.hsv.v = value;
    this.update();
  },

  getBackgroundHue : function() {
    return Colr.fromHsv(this.state.hsv.h, 100, 100).toHex();
  },

  // set the opacity
  setOpacity: function (colorOpacity) {
    this.state.colorOpacity = Math.round(colorOpacity);
    this.update();
  }

});

module.exports = ColorPicker;
