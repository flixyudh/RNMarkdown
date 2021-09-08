import React from 'react'
import { Text } from 'react-native'

export const typography = (props) => {
  hasDefaultFont = props?.font?.default
  const oldTextRender = Text.render
  Text.render = function(...args) {
    const origin = oldTextRender.call(this, ...args)
    return React.cloneElement(origin, {
      style: [hasDefaultFont && {fontFamily: props.font.default}, origin.props.style],
    })
  }
}