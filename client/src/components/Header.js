import React from 'react'
import '../Header.css'


function Header() {
  return (
    <div className='Header'>
      <div className='Header-title'>
        <h4>Make Pixel LED Art</h4>
      </div>
      <p><i className="fa fa-magic"></i> Pick colors, click squares, & send a design to my Raspberry Pi!</p>
    </div>
  );
}
export default Header;
