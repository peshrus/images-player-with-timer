import "bootstrap/dist/css/bootstrap.min.css"
import $ from 'jquery';
import PropTypes from 'prop-types';
import React, {Component} from "react";
import {HotKeys} from 'react-hotkeys';
import Footer from "./components/Footer";
import MetaInfoWrapper from "./components/MetaInfoWrapper";
import "./index.css";

const hiddenControlsShowTimeout = 3000;
const keyMap = {
  "prev": "left",
  "pause": "space",
  "next": "right"
};

class ImagesPlayerWithTimer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentImageNum: 0,
      extraElementsHidingTimeout: null,
    };

    this.footer = React.createRef();
    this.metaInfoWrapper = React.createRef();
    this.dots = React.createRef();
    this.squares = React.createRef();
    this.controlsWrapper = React.createRef();
  }

  setCurrentImageNum = (newCurrentImageNum) => {
    this.setState({currentImageNum: newCurrentImageNum});
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
    clearTimeout(this.state.extraElementsHidingTimeout);

    this.showExtraElements();
    this.setState({
      extraElementsHidingTimeout: setTimeout(this.hideExtraElements,
          hiddenControlsShowTimeout)
    });
  };

  makeHoverStyle = (cursorOverElement) => {
    return {
      color: cursorOverElement ?
          this.props.accentColor :
          this.props.secondaryColor
    };
  };

  componentDidMount() {
    this._container.focus();
  }

  render() {
    const {images} = this.props;
    const currentImage = images[this.state.currentImageNum];
    const handlers = {
      "prev": () => {
        this.showHiddenControls();
        this.footer.current.goPrev();
      },
      "pause": () => {
        this.showHiddenControls();
        this.footer.current.pausePlay();
      },
      "next": () => {
        this.showHiddenControls();
        this.footer.current.goNext();
      }
    };

    return (
        <HotKeys keyMap={keyMap} handlers={handlers}>
          <div className="images-player container-fluid position-relative p-0"
               style={{
                 width: this.props.width,
                 height: this.props.height,
                 backgroundColor: this.props.primaryColor,
               }}
               onMouseMove={this.showHiddenControls}
               ref={(c) => this._container = c}
               tabIndex={0}
          >
            <div className="image-holder position-absolute w-100 h-100"
                 style={{backgroundImage: `url(${currentImage.src})`}}/>

            <MetaInfoWrapper refSpec={this.metaInfoWrapper}
                             image={currentImage}
                             onCloseClick={this.props.onCloseClick}
                             secondaryColor={this.props.secondaryColor}
                             accentColor={this.props.accentColor}
                             makeHoverStyle={this.makeHoverStyle}/>
            <img className="position-relative h-100"
                 src={currentImage.src}
                 alt=""/>
            <Footer ref={this.footer}
                    images={images}
                    currentImageNum={this.state.currentImageNum}
                    primaryColor={this.props.primaryColor}
                    secondaryColor={this.props.secondaryColor}
                    accentColor={this.props.accentColor}
                    inactiveColor={this.props.inactiveColor}
                    brandText={this.props.brandText}
                    dotsRefSpec={this.dots}
                    squaresRefSpec={this.squares}
                    controlsWrapperRefSpec={this.controlsWrapper}
                    maxTimeSec={this.props.maxTimeSec}
                    setCurrentImageNum={this.setCurrentImageNum}
                    showHiddenControls={this.showHiddenControls}
                    onStarClick={this.props.onStarClick}
                    makeHoverStyle={this.makeHoverStyle}/>
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
  primaryColor: PropTypes.string,
  secondaryColor: PropTypes.string,
  accentColor: PropTypes.string,
  inactiveColor: PropTypes.string,
  brandText: PropTypes.string.isRequired,
  onCloseClick: PropTypes.func.isRequired,
  onStarClick: PropTypes.func.isRequired,
};

ImagesPlayerWithTimer.defaultProps = {
  maxTimeSec: 120,
  width: "100vw",
  height: "100vh",
  primaryColor: "black",
  secondaryColor: "white",
  accentColor: "yellow",
  inactiveColor: "lightgrey",
  onCloseClick: () => console.log("Close Clicked"),
  onStarClick: () => console.log("Star Clicked"),
};

export default ImagesPlayerWithTimer;