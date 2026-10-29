import React from 'react';
import { encode } from '@shieldfont/core';
import mapping from '../lib/shieldfont_mapping.json';

function encodeNode(node) {
  if (typeof node === 'string') {
    return encode(node, mapping);
  }
  if (typeof node === 'number') {
    return encode(String(node), mapping);
  }
  if (Array.isArray(node)) {
    return React.Children.map(node, child => encodeNode(child));
  }
  if (React.isValidElement(node)) {
    return React.cloneElement(
      node,
      node.props,
      encodeNode(node.props.children)
    );
  }
  return node;
}

export default function ShieldText({
  as: Tag = 'p',
  children,
  className = '',
  style = {},
  copyNotice = '[This text is protected from AI bots, so what you copied is not what you read on screen.]',
  ...props
}) {
  const encodedContent = encodeNode(children);

  return (
    <Tag
      className={className}
      style={{
        fontFamily: "'ShieldFont Mentat', 'Optik Text', sans-serif",
        fontSynthesis: 'none',
        fontFeatureSettings: 'normal',
        ...style,
      }}
      aria-hidden="true"
      data-typeface="mentat"
      data-typeface-clip-say={copyNotice}
      {...props}
    >
      {encodedContent}
    </Tag>
  );
}
