import React, {Component} from 'react';

import { CircularSlider } from 'circular-slider';



class RotateSlider extends Component {

  constructor(){

    super();

      this.state = {

      angle: 0

    }

  }

  

  logAngle(angle){

    if(angle => 360){

      angle = angle - 360;

    }

    if(angle <= -360){

      angle = angle + 360;

    }

    this.props.setValue(angle);

    this.setState(

    {angle : angle}

    )

    // console.log("the angle is: "+angle);

  }





  render() {

    return (

      <div className="Slider">

      <CircularSlider

        angle={this.state.angle} 

        showArc= {true}

        r={50}

        arcStart= {0}

        arcEnd={360}

        showNeedle={true}

        onMove={(angle) => {this.logAngle(angle)}}

      />

        </div>

    );

  }

}

export default RotateSlider