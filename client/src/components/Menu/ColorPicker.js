import React, { Component } from 'react';

const ColorPicker = props => {
  let lastActive = null;
  let currentActive = null;

  const colorsArrays = [
    ['#fad390', '#f8c291', '#6a89cc', '#82ccdd', '#b8e994'],
    ['#f6b93b', '#e55039', '#4a69bd', '#60a3bc', '#78e08f'],
    ['#fa983a', '#eb2f06', '#1e3799', '#3c6382', '#38ada9'],
    ['#e58e26', '#b71540', '#0c2461', '#0a3d62', '#079992'],
  ];
  const colors = [
    '#fad390',
    '#f8c291',
    '#6a89cc',
    '#82ccdd',
    '#b8e994',
    '#f6b93b',
    '#e55039',
    '#4a69bd',
    '#60a3bc',
    '#78e08f',
    '#fa983a',
    '#eb2f06',
    '#1e3799',
    '#3c6382',
    '#38ada9',
    '#e58e26',
    '#b71540',
    '#0c2461',
    '#0a3d62',
    '#079992',
  ];

  const handleClose = () => {
    props.toggle();
  };
  const handleColorChoose = e => {
    if (!currentActive) {
      currentActive = e;
    } else {
      lastActive = currentActive;
      lastActive.target.setAttribute(
        'style',
        `background-color: ${lastActive.style.backgroundColor}`,
      );
      currentActive = e;
    }
    e.target.setAttribute(
      'style',
      `background-color: ${e.target.id};border-style: solid !important; border-color: white !important; border: 3px !important`,
    );
    props.handleColorPick(e.target.id);
    handleClose();
  };
  return (
    <div className="modalPopUp">
      <div className="modal_content">
        <span className="close" onClick={e => handleClose(e)}>
          &times;
        </span>
        <form>
          <h3>בחר צבע</h3>
          {/* <div className="row bg-light text-dark">
            {colors.map((color, i) => (
              <div
                className="col border border-dark text-center colPick"
                style={{ backgroundColor: `${color}` }}
                //  onClick = {(e) => }
              ></div>
            ))}
          </div> */}
          {console.log(colorsArrays)}
          {colorsArrays.map(innerArray => (
            <div className="row bg-light text-dark">
              {innerArray.map(color => (
                <div
                  id={color}
                  className="col border border-dark text-center colPick"
                  style={{ backgroundColor: `${color}` }}
                  onClick={e => handleColorChoose(e)}
                ></div>
              ))}
            </div>
          ))}
          <br />
        </form>
      </div>
    </div>
  );
};

export default ColorPicker;
