import {
  NavigateBeforeRounded,
  NavigateNextRounded,
  PauseRounded,
  PlayArrowRounded,
  ReplayRounded,
  StarBorder
} from "@material-ui/icons";
import PropTypes from "prop-types";
import React, {Component} from "react";

class Footer extends Component {
  constructor(props) {
    super(props);
  }

  image2Dot = (image, index) => {
    const id = "dot-" + index;
    const currentImage = this.props.currentImage;
    const viewed = (index < currentImage ? "dot-viewed" : "");
    const currentOrViewed = (index === currentImage ? "dot-current" : viewed);

    return <span id={id} key={id} className={"dot " + currentOrViewed}/>;
  };

  image2Square = (image, index) => {
    const id = "square-" + index;
    const currentImage = this.props.currentImage;
    const current = (index === currentImage ? "square-current" : "");
    const backgroundImage = index <= currentImage
        ? `url(${this.props.images[index].src})` : "";
    const cursor = index < currentImage ? "pointer" : "";
    const onClick = index < currentImage ? this.props.squareClickHandler
        : () => false;

    return <span id={id} key={id} className={"square " + current}
                 style={{backgroundImage: backgroundImage, cursor: cursor}}
                 onClick={onClick}/>;
  };

  render() {
    const dots = this.props.images.map(this.image2Dot);
    const squares = this.props.images.map(this.image2Square);

    return (
        <div className="footer position-absolute w-100">
          <div ref={this.props.squaresRefSpec} className="w-100 mb-3"
               style={{display: "none"}}>{squares}</div>
          <div ref={this.props.dotsRefSpec} className="w-100 mb-3">{dots}</div>

          <div className="progress rounded-0">
            <div className="progress-bar" role="progressbar"
                 style={{
                   width: `${this.props.progressBarValue}%`,
                   backgroundColor: this.props.progressBarColor
                 }}
                 aria-valuenow={this.props.progressBarValue}
                 aria-valuemin="0" aria-valuemax="100"/>
          </div>
          <div ref={this.props.controlsWrapperRefSpec} className="w-100"
               style={{display: "none"}}
          >
            <div className="player-controls w-100 text-white d-table">
              <div className="pl-4 brand-text d-table-cell align-middle w-25 text-left font-weight-bold font-italic"
              >{this.props.brandText}</div>
              <div className="d-table-cell align-middle w-50">
                <NavigateBeforeRounded onClick={this.props.prev}/>
                {this.props.paused ? <PlayArrowRounded
                    onClick={this.props.pausePlay}/> : <PauseRounded
                    onClick={this.props.pausePlay}/>}
                <NavigateNextRounded onClick={this.props.next}/>
                <ReplayRounded onClick={this.props.replay}/>
                <span className="time ml-3">
                  {this.props.timeLeftStr} / {this.props.maxTimeMinStr}
                </span>
              </div>
              <div
                  className="pr-4 d-table-cell w-25 align-middle text-right">
                <StarBorder/>
              </div>
            </div>
          </div>
        </div>
    );
  }
}

Footer.propTypes = {
  images: PropTypes.arrayOf(PropTypes.exact({
    src: PropTypes.string.isRequired,
    author: PropTypes.string,
    savedFrom: PropTypes.string
  })).isRequired,
  currentImage: PropTypes.number.isRequired,
  progressBarColor: PropTypes.string.isRequired,
  progressBarValue: PropTypes.number.isRequired,
  brandText: PropTypes.string.isRequired,
  paused: PropTypes.bool.isRequired,
  timeLeftStr: PropTypes.string.isRequired,
  maxTimeMinStr: PropTypes.string.isRequired,
  squareClickHandler: PropTypes.func.isRequired,
  prev: PropTypes.func.isRequired,
  pausePlay: PropTypes.func.isRequired,
  next: PropTypes.func.isRequired,
  replay: PropTypes.func.isRequired,
  dotsRefSpec: PropTypes.object.isRequired,
  squaresRefSpec: PropTypes.object.isRequired,
  controlsWrapperRefSpec: PropTypes.object.isRequired,
};

export default Footer;