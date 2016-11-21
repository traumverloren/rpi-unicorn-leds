import React, {PropTypes} from 'react'
import '../css/Button.css'

function Button({ isSubmitted, piConnected, name, onClick }) {
  if (!piConnected) {
    var submitButton = 'submit-button-disabled'
    var resetButton = 'reset-button-disabled'
  } else if (isSubmitted) {
    submitButton = 'submit-button-disabled'
    resetButton = 'reset-button'
  } else {
    submitButton = 'submit-button'
    resetButton = 'reset-button'
  }

  return (
    <button
      className={(name === 'Submit' ? submitButton : resetButton)}
      disabled={(name === 'Submit' && isSubmitted) || !piConnected}
      onClick={onClick}>
      {name}
    </button>
  )
}

Button.PropTypes = {
  name: PropTypes.string.isRequired,
  piConnected: PropTypes.bool.isRequired,
  isSubmitted: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
}

export default Button;
