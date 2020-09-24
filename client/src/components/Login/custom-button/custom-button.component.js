import React from 'react';

import './custom-buttom.styles.scss';

const CustomButton = ({ children, ...otherProps }) => (
  <button className="custom-button ui white button" {...otherProps}>
    {children}
  </button>
);

export default CustomButton;