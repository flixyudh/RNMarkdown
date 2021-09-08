import { isArray, isEqual, merge } from 'lodash';
import React, { Component } from 'react';
import { View } from 'react-native';
import SimpleMarkdown from 'simple-markdown';
import styles from './styles';
import { typography } from './utils/typography';

/**
 * @typedef CustomProps
 * @type {object}
 * @property {function} onLoad
 * @property {object} font
 * @property {string} font.default
 * @property {string} font.italic
 * @property {string} font.bold
 * @property {import("react-native").ViewStyle} style
 * 
 * @typedef {CustomProps} Props
 */
/**
 * @extends {React.PureComponent<Props, {}>}}
 */

export default class RNMarkdown extends Component {
  static defaultProps = {
    font:{}
  };
  
  constructor(props) {
    super(props);

    const opts = {
      imageParam: props.imageParam,
      onLink: props.onLink,
      rules: props.rules
    };

    typography(props)

    const mergedStyles = merge({}, styles, props.styles);
    var rules = require('./rules')(mergedStyles, opts);
    rules = merge({}, SimpleMarkdown.defaultRules, rules, opts.rules);

    const parser = SimpleMarkdown.parserFor(rules);
    this.parse = function (source) {
      const blockSource = source + '\n\n';
      return parser(blockSource, {inline: false});
    };
    this.renderer = SimpleMarkdown.outputFor(rules, 'react');
  }

  componentDidMount() {
    if (this.props.onLoad) {
      this.props.onLoad();
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(nextProps.children, this.props.children);
  }

  render() {
    const child = isArray(this.props.children)
      ? this.props.children.join('')
      : this.props.children;

    const tree = this.parse(child);

    return <View style={[styles.container, this.props.style]}>{this.renderer(tree)}</View>
  }
}