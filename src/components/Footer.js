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
import Timer from "tm-timer";

class Footer extends Component {
  constructor(props) {
    super(props);

    let maxTimeMillis = this.calcMaxTimeMillis();
    const timer = new Timer(maxTimeMillis, () => this.goNext(false));
    this.maxTimeMinStr = this.makeTimeLeftStr(maxTimeMillis);

    this.state = {
      timer: timer,
      timeLeftStr: this.maxTimeMinStr,
      progressBarValue: 0,
      paused: false,
      cycleFinished: false,
      cursorOverPrev: false,
      cursorOverPausePlay: false,
      cursorOverNext: false,
      cursorOverReplay: false,
      cursorOverStar: false,
    };

    timer.onTick((isBigTick, timeLeft) => {
      if (isBigTick) {
        const timeLeftStr = this.makeTimeLeftStr(timeLeft);
        this.setState({timeLeftStr: timeLeftStr});
      }

      const progressBarValue = 100 - timeLeft / (this.props.maxTimeSec * 10);
      this.setState({progressBarValue: progressBarValue});
    });
  }

  calcMaxTimeMillis = () => {
    return this.props.maxTimeSec * 1000;
  };

  makeTimeLeftStr = (timeLeft) => {
    const minutesLeft = Math.floor(timeLeft / 60000);
    const secondsLeftNum = Math.floor(timeLeft % 60000 / 1000);
    const secondsLeftStr = secondsLeftNum.toString().padStart(2, "0");

    return `${minutesLeft}:${secondsLeftStr}`;
  };

  restartTimer = (restartCondition = true) => {
    if (restartCondition) {
      const timer = this.state.timer;

      timer.stop();
      timer.reset();
      timer.start();

      this.setState({paused: false});
    }
  };

  goPrev = () => {
    const newCurrentImageNum = Math.max(this.props.currentImageNum - 1, 0);
    let firstImage = newCurrentImageNum === this.props.currentImageNum;

    this.restartTimer(!firstImage);
    this.setState({cycleFinished: false});
    this.props.setCurrentImageNum(newCurrentImageNum);
  };

  pausePlay = () => {
    if (!this.state.cycleFinished) {
      const timer = this.state.timer;

      if (timer.isRunning) {
        timer.stop();
        this.setState({paused: true});
      } else {
        timer.start();
        this.setState({paused: false});
      }
    } else {
      console.log("pausePlay: The Cycle Finished");
    }
  };

  goNext = (manualCall = true) => {
    const newCurrentImageNum = Math.min(this.props.currentImageNum + 1,
        this.props.images.length - 1);
    const lastImage = newCurrentImageNum === this.props.currentImageNum;

    if (!manualCall || !lastImage) {
      this.restartTimer(!lastImage);
      this.setState({cycleFinished: lastImage});
      this.props.setCurrentImageNum(newCurrentImageNum);
    }
  };

  replay = () => {
    this.setState({cycleFinished: false});
    this.props.setCurrentImageNum(0);
    this.restartTimer();
  };

  onSquareClick = (event) => {
    if (event) {
      const newCurrentImageNum = parseInt(
          event.target.id.replace(/^square-/g, ""),
          10);
      const lastImage = newCurrentImageNum === this.props.currentImageNum;

      this.restartTimer(!lastImage);
      this.setState({cycleFinished: lastImage});
      this.props.setCurrentImageNum(newCurrentImageNum);
    } else {
      console.log("onSquareClick: No Event");
    }
  };

  image2Dot = (image, index) => {
    const id = "dot-" + index;
    const currentImageNum = this.props.currentImageNum;
    const viewed = (index < currentImageNum
        ? {backgroundColor: this.props.primaryColor}
        : {backgroundColor: this.props.inactiveColor});
    const currentOrViewed = (index === currentImageNum
        ? {backgroundColor: this.props.accentColor} : viewed);

    return <span id={id} key={id} className="dot" style={currentOrViewed}/>;
  };

  image2Square = (image, index) => {
    const id = "square-" + index;
    const currentImageNum = this.props.currentImageNum;
    const currentClass = (index === currentImageNum ? "square-current" : "");
    const currentStyle = (index === currentImageNum
        ? {outlineColor: this.props.accentColor} : {});
    const backgroundImage = index <= currentImageNum
        ? `url(${this.props.images[index].src})` : "";
    const cursor = index < currentImageNum ? "pointer" : "";
    const onClick = index < currentImageNum ? this.onSquareClick
        : () => false;

    return <span id={id}
                 key={id}
                 className={"square " + currentClass}
                 style={{
                   backgroundColor: this.props.inactiveColor,
                   backgroundImage: backgroundImage,
                   cursor: cursor,
                   ...currentStyle
                 }}
                 onClick={onClick}/>;
  };

  makePlayPauseButton = () => {
    return this.state.paused ?
        <PlayArrowRounded
            onClick={this.pausePlay}
            style={this.props.makeHoverStyle(this.state.cursorOverPausePlay)}
            onMouseEnter={() => this.setState({cursorOverPausePlay: true})}
            onMouseLeave={() => this.setState({cursorOverPausePlay: false})}/> :
        <PauseRounded
            onClick={this.pausePlay}
            style={this.props.makeHoverStyle(this.state.cursorOverPausePlay)}
            onMouseEnter={() => this.setState({cursorOverPausePlay: true})}
            onMouseLeave={() => this.setState({cursorOverPausePlay: false})}/>;
  };

  componentDidMount() {
    if (this.props.images.length > 0) {
      this.state.timer.start();
    } else {
      console.log("componentDidMount: No Images");
    }
  }

  render() {
    const dots = this.props.images.map(this.image2Dot);
    const squares = this.props.images.map(this.image2Square);

    return (
        <div className="footer position-absolute w-100">
          <div ref={this.props.squaresRefSpec} className="w-100 mb-3"
               style={{display: "none"}}>{squares}</div>
          <div ref={this.props.dotsRefSpec}
               className="w-100 mb-3">{dots}</div>

          <div className="progress rounded-0">
            <div className="progress-bar" role="progressbar"
                 style={{
                   width: `${this.state.progressBarValue}%`,
                   backgroundColor: this.props.accentColor
                 }}
                 aria-valuenow={this.state.progressBarValue}
                 aria-valuemin="0" aria-valuemax="100"/>
          </div>
          <div ref={this.props.controlsWrapperRefSpec} className="w-100"
               style={{display: "none"}}
          >
            <div className="player-controls w-100 text-white d-table"
                 style={{
                   color: this.props.primaryColor,
                   backgroundColor: this.props.primaryColor
                 }}
            >
              <div
                  className="pl-4 brand-text d-table-cell align-middle w-25 text-left font-weight-bold font-italic"
                  style={{color: this.props.accentColor}}
              >{this.props.brandText}</div>
              <div className="d-table-cell align-middle w-50"
                   style={{color: this.props.secondaryColor}}>
                <NavigateBeforeRounded
                    onClick={this.goPrev}
                    style={this.props.makeHoverStyle(this.state.cursorOverPrev)}
                    onMouseEnter={() => this.setState({cursorOverPrev: true})}
                    onMouseLeave={() => this.setState(
                        {cursorOverPrev: false})}/>
                {this.makePlayPauseButton()}
                <NavigateNextRounded
                    onClick={this.goNext}
                    style={this.props.makeHoverStyle(this.state.cursorOverNext)}
                    onMouseEnter={() => this.setState({cursorOverNext: true})}
                    onMouseLeave={() => this.setState(
                        {cursorOverNext: false})}/>
                <ReplayRounded
                    onClick={this.replay}
                    style={this.props.makeHoverStyle(
                        this.state.cursorOverReplay)}
                    onMouseEnter={() => this.setState({cursorOverReplay: true})}
                    onMouseLeave={() => this.setState(
                        {cursorOverReplay: false})}/>
                <span className="time ml-3">
                  {this.state.timeLeftStr} / {this.maxTimeMinStr}
                </span>
              </div>
              <div className="pr-4 d-table-cell w-25 align-middle text-right"
                   style={{color: this.props.secondaryColor}}>
                <StarBorder
                    onClick={this.props.onStarClick}
                    style={this.props.makeHoverStyle(this.state.cursorOverStar)}
                    onMouseEnter={() => this.setState({cursorOverStar: true})}
                    onMouseLeave={() => this.setState(
                        {cursorOverStar: false})}/>
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
  currentImageNum: PropTypes.number.isRequired,
  primaryColor: PropTypes.string,
  secondaryColor: PropTypes.string,
  accentColor: PropTypes.string,
  inactiveColor: PropTypes.string,
  brandText: PropTypes.string.isRequired,
  dotsRefSpec: PropTypes.object.isRequired,
  squaresRefSpec: PropTypes.object.isRequired,
  controlsWrapperRefSpec: PropTypes.object.isRequired,
  maxTimeSec: PropTypes.number.isRequired,
  setCurrentImageNum: PropTypes.func.isRequired,
  showHiddenControls: PropTypes.func.isRequired,
  onStarClick: PropTypes.func.isRequired,
  makeHoverStyle: PropTypes.func.isRequired,
};

export default Footer;