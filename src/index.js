import "bootstrap/dist/css/bootstrap.min.css"
import $ from 'jquery';
import PropTypes from 'prop-types';
import React, {Component} from "react";
import {HotKeys} from 'react-hotkeys';
import Timer from 'tm-timer';
import Footer from "./components/Footer";
import MetaInfoWrapper from "./components/MetaInfoWrapper";
import "./index.css";

const keyMap = {
  "prev": "left",
  "pause": "space",
  "next": "right"
};

class ImagesPlayerWithTimer extends Component {
  constructor(props) {
    super(props);

    const timer = new Timer(this.maxTimeMillis(), () => this.next(false));
    this.maxTimeMinStr = this.calcTimeLeftStr(this.maxTimeMillis());

    this.state = {
      currentImage: 0,
      timer: timer,
      timeLeftStr: this.maxTimeMinStr,
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

    this.metaInfoWrapper = React.createRef();
    this.dots = React.createRef();
    this.squares = React.createRef();
    this.controlsWrapper = React.createRef();
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
      const timer = this.state.timer;

      timer.stop();
      timer.reset();
      timer.start();

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

  next = (manualCall = true) => {
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
    $(this.metaInfoWrapper.current).fadeIn();
    $(this.dots.current).fadeOut("fast",
        () => $(this.squares.current).fadeIn());
    $(this.controlsWrapper.current).slideDown();
  };

  hideExtraElements = () => {
    $(this.metaInfoWrapper.current).fadeOut();
    $(this.squares.current).fadeOut("fast",
        () => $(this.dots.current).fadeIn());
    $(this.controlsWrapper.current).slideUp();
  };

  showHiddenControls = () => {
    clearTimeout(this.state.timeout);

    this.showExtraElements();
    this.setState({
      timeout: setTimeout(this.hideExtraElements, 2000)
    });
  };

  makeImage = (images) => {
    const src = images[this.state.currentImage].src;

    return <img className="position-relative" src={src} alt="" height="100%"/>;
  };

  makeAuthor = (images) => {
    const image = images[this.state.currentImage];
    const authorAndLinkSpecified = image.savedFrom && image.makeAuthor;

    return authorAndLinkSpecified ?
        <React.Fragment>Author <a href={image.savedFrom}
                                  target="_blank">{image.makeAuthor}</a></React.Fragment>
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
    const {images} = this.props;
    const image = this.makeImage(images);
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
          <div className="images-player container-fluid position-relative p-0"
               style={{
                 width: this.props.width,
                 height: this.props.height,
                 backgroundColor: this.props.backgroundColor,
               }}
               onMouseMove={this.showHiddenControls}
               ref={(c) => this._container = c}
               tabIndex={0}
          >
            <div className="image-holder position-absolute w-100 h-100"
                 style={{backgroundImage: `url(${images[this.state.currentImage].src})`}}/>

            <MetaInfoWrapper refSpec={this.metaInfoWrapper}
                             author={this.makeAuthor(images)}/>
            {image}
            <Footer images={images}
                    currentImage={this.state.currentImage}
                    progressBarColor={this.props.progressBarColor}
                    progressBarValue={this.state.progressBarValue}
                    brandText={this.props.brandText}
                    paused={this.state.paused}
                    timeLeftStr={this.state.timeLeftStr}
                    maxTimeMinStr={this.maxTimeMinStr}
                    squareClickHandler={this.squareClickHandler}
                    prev={this.prev}
                    pausePlay={this.pausePlay}
                    next={this.next}
                    replay={this.replay}
                    dotsRefSpec={this.dots}
                    squaresRefSpec={this.squares}
                    controlsWrapperRefSpec={this.controlsWrapper}/>
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