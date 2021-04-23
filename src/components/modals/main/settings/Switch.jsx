import React from 'react';

import EventBus from '../../../../modules/helpers/eventbus';
import SettingsFunctions from '../../../../modules/helpers/settings';

import SwitchUI from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';

export default class Switch extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      checked: (localStorage.getItem(this.props.name) === 'true')
    };
  }

  handleChange = () => {
    SettingsFunctions.setItem(this.props.name);

    this.setState({
      checked: (this.state.checked === true) ? false : true
    });

    if (this.props.element) {
      if (!document.querySelector(this.props.element)) {
        document.querySelector('.reminder-info').style.display = 'block';
        return localStorage.setItem('showReminder', true);
      }
    }

    EventBus.dispatch('refresh', this.props.category);
  }

  render() {
    let text = this.props.text;

    if (this.props.newFeature) {
      text = <>{this.props.text} <span className='newFeature'> NEW</span></>;
    } else if (this.props.betaFeature) {
      text = <>{this.props.text} <span className='newFeature'> BETA</span></>;
    }

    return (
      <>
        <FormControlLabel
          control={<SwitchUI name={this.props.name} color='primary' checked={this.state.checked} onChange={this.handleChange} />}
          label={text}
          labelPlacement='start'
        />
        <br/>
      </>
    );
  }
}