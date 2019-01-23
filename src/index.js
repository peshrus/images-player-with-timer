import {
  CloseRounded,
  NavigateBeforeRounded,
  NavigateNextRounded,
  PauseRounded,
  PlayArrowRounded,
  ReplayRounded,
  StarBorder
} from "@material-ui/icons";
import "bootstrap/dist/css/bootstrap.min.css"
import $ from 'jquery';
import PropTypes from 'prop-types';
import React, {Component} from "react";
import {HotKeys} from 'react-hotkeys';
import Timer from 'tm-timer';
import "./index.css";

const keyMap = {
  "prev": "left",
  "pause": "space",
  "next": "right"
};

class ImagesPlayerWithTimer extends Component {
  constructor(props) {
    super(props);

    const timer = new Timer(this.maxTimeMillis(), this.next);

    this.state = {
      currentImage: 0,
      timer: timer,
      timeLeftStr: this.calcTimeLeftStr(this.maxTimeMillis()),
      progressBarValue: 0,
      paused: false,
      cycleFinished: false,
      timeout: null
    };

    timer.onTick((isBigTick, timeLeft) => {
      if (isBigTick) {
        const timeLeftStr = this.calcTimeLeftStr(timeLeft);
        this.setState({timeLeftStr: timeLeftStr});
      }

      const progressBarValue = 100 - timeLeft / (this.props.maxTimeSec * 10);
      this.setState({progressBarValue: progressBarValue});
    });
  }

  maxTimeMillis = () => {
    return this.props.maxTimeSec * 1000;
  };

  calcTimeLeftStr = (timeLeft) => {
    const minutesLeft = Math.floor(timeLeft / 60000);
    const secondsLeftNum = Math.floor(timeLeft % 60000 / 1000);
    const secondsLeftStr = secondsLeftNum.toString().padStart(2, "0");

    return `${minutesLeft}:${secondsLeftStr}`;
  };

  restartTimer = (restartCondition = true) => {
    if (restartCondition) {
      this.state.timer.stop();
      this.state.timer.reset();
      this.state.timer.start();
      this.setState({paused: false});
    }
  };

  prev = () => {
    const newCurrentImage = Math.max(this.state.currentImage - 1, 0);
    let firstImage = newCurrentImage === this.state.currentImage;

    this.restartTimer(!firstImage);
    this.setState({currentImage: newCurrentImage, cycleFinished: false});
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

  next = (manualCall = false) => {
    const newCurrentImage = Math.min(this.state.currentImage + 1,
        this.props.images.length - 1);
    const lastImage = newCurrentImage === this.state.currentImage;

    if (!manualCall || !lastImage) {
      this.restartTimer(!lastImage);
      this.setState({currentImage: newCurrentImage, cycleFinished: lastImage});
    }
  };

  replay = () => {
    this.setState({currentImage: 0, cycleFinished: false});
    this.restartTimer();
  };

  squareClickHandler = (event) => {
    if (event) {
      const newCurrentImage = parseInt(event.target.id.replace(/^square-/g, ""),
          10);
      const lastImage = newCurrentImage === this.state.currentImage;

      this.restartTimer(!lastImage);
      this.setState({currentImage: newCurrentImage, cycleFinished: lastImage});
    } else {
      console.log("squareClickHandler: No Event");
    }
  };

  showExtraElements = () => {
    $('#metaInfoWrapper').fadeIn();
    $('#dots').fadeOut("fast", () => $('#squares').fadeIn());
    $('#controlsWrapper').slideDown();
  };

  hideExtraElements = () => {
    $('#metaInfoWrapper').fadeOut();
    $('#squares').fadeOut("fast", () => $('#dots').fadeIn());
    $('#controlsWrapper').slideUp();
  };

  showHiddenControls = () => {
    clearTimeout(this.state.timeout);

    this.showExtraElements();
    this.setState({
      timeout: setTimeout(this.hideExtraElements, 2000)
    });
  };

  makeImage = (images) => {
    return images.length > 0 ?
        <img className="position-relative"
             src={images[this.state.currentImage].src} alt="" height="100%"/> :
        <div className="position-relative">No Images</div>
  };

  image2Dot = (image, index) => {
    const id = "dot-" + index;
    const currentImage = this.state.currentImage;
    const viewed = (index < currentImage ? "dot-viewed" : "");
    const currentOrViewed = (index === currentImage ? "dot-current" : viewed);

    return <span id={id} key={id} className={"dot " + currentOrViewed}/>;
  };

  image2Square = (image, index) => {
    const id = "square-" + index;
    const currentImage = this.state.currentImage;
    const current = (index === currentImage ? "square-current" : "");
    const backgroundImage = index <= currentImage
        ? `url(${this.props.images[index].src})` : "";
    const cursor = index < currentImage ? "pointer" : "";
    const onClick = index < currentImage ? this.squareClickHandler
        : () => false;

    return <span id={id} key={id} className={"square " + current}
                 style={{backgroundImage: backgroundImage, cursor: cursor}}
                 onClick={onClick}/>;
  };

  author = (images) => {
    const image = images[this.state.currentImage];
    const authorAndLinkSpecified = image.savedFrom && image.author;

    return authorAndLinkSpecified ?
        <React.Fragment>Author <a href={image.savedFrom}
                                  target="_blank">{image.author}</a></React.Fragment>
        : <React.Fragment/>
  };

  componentDidMount() {
    this._container.focus();

    if (this.props.images.length > 0) {
      this.state.timer.start();
    } else {
      console.log("componentDidMount: No Images");
    }
  }

  render() {
    const {width, height, backgroundColor, progressBarColor, images, brandText} = this.props;

    const image = this.makeImage(images);
    const dots = images.map(this.image2Dot);
    const squares = images.map(this.image2Square);
    const maxTimeMinStr = this.calcTimeLeftStr(this.maxTimeMillis());
    const handlers = {
      "prev": () => {
        this.showHiddenControls();
        this.prev();
      },
      "pause": () => {
        this.showHiddenControls();
        this.pausePlay();
      },
      "next": () => {
        this.showHiddenControls();
        this.next();
      }
    };

    return (
        <HotKeys keyMap={keyMap} handlers={handlers}>
          <div id="mainContainer"
               className="container-fluid position-relative p-0"
               style={{
                 width: width,
                 height: height,
                 backgroundColor: backgroundColor,
               }}
               onMouseMove={this.showHiddenControls}
               ref={(c) => this._container = c}
               tabIndex={0}
          >
            <div className="image-holder position-absolute w-100 h-100"
                 style={{backgroundImage: `url(${this.props.images[this.state.currentImage].src})`}}/>

            <div id="metaInfoWrapper"
                 className="meta-info position-absolute w-100"
                 style={{display: "none"}}
            >
              <div className="w-100 text-white d-table">
                <div
                    className="pl-4 d-table-cell align-middle text-left mr-auto">
                  {this.author(images)}
                </div>
                <div className="pr-4 d-table-cell align-middle text-right">
                  <CloseRounded className="close"/>
                </div>
              </div>
            </div>
            {image}
            <div className="footer position-absolute w-100">
              <div id="squares" className="w-100 mb-3"
                   style={{display: "none"}}>{squares}</div>
              <div id="dots" className="w-100 mb-3">{dots}</div>

              <div className="progress rounded-0">
                <div className="progress-bar" role="progressbar"
                     style={{
                       width: `${this.state.progressBarValue}%`,
                       backgroundColor: progressBarColor
                     }}
                     aria-valuenow={this.state.progressBarValue}
                     aria-valuemin="0" aria-valuemax="100"/>
              </div>
              <div id="controlsWrapper" className="w-100"
                   style={{display: "none"}}
              >
                <div className="player-controls w-100 text-white d-table">
                  <div
                      className="pl-4 brandText d-table-cell align-middle w-25 text-left font-weight-bold font-italic"
                  >{brandText}</div>
                  <div className="d-table-cell align-middle w-50">
                    <NavigateBeforeRounded onClick={this.prev}/>
                    {this.state.paused ? <PlayArrowRounded
                        onClick={this.pausePlay}/> : <PauseRounded
                        onClick={this.pausePlay}/>}
                    <NavigateNextRounded onClick={() => this.next(true)}/>
                    <ReplayRounded onClick={this.replay}/>
                    <span className="time ml-3"><span
                        className="timeLeft">{this.state.timeLeftStr}</span> / {maxTimeMinStr}</span>
                  </div>
                  <div
                      className="pr-4 d-table-cell w-25 align-middle text-right">
                    <StarBorder/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </HotKeys>
    );
  }
}

ImagesPlayerWithTimer.propTypes = {
  images: PropTypes.arrayOf(PropTypes.exact({
    src: PropTypes.string.isRequired,
    author: PropTypes.string,
    savedFrom: PropTypes.string
  })).isRequired,
  maxTimeSec: PropTypes.number.isRequired,
  width: PropTypes.string,
  height: PropTypes.string,
  backgroundColor: PropTypes.string,
  progressBarColor: PropTypes.string,
  brandText: PropTypes.string.isRequired
};

ImagesPlayerWithTimer.defaultProps = {
  maxTimeSec: 120,
  width: "100vw",
  height: "100vh",
  backgroundColor: "black",
  progressBarColor: "yellow"
};

export default ImagesPlayerWithTimer;