import {CloseRounded} from "@material-ui/icons";
import PropTypes from "prop-types";
import React, {Component} from "react";

class MetaInfoWrapper extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cursorOverClose: false,
    };
  }

  makeAuthor = () => {
    const image = this.props.image;
    const authorAndLinkSpecified = image.savedFrom && image.author;

    return authorAndLinkSpecified ?
        <React.Fragment>Author <a href={image.savedFrom}
                                  target="_blank"
                                  style={{color: this.props.accentColor}}>{image.author}</a></React.Fragment>
        : <React.Fragment/>
  };

  render() {
    return (
        <div ref={this.props.refSpec}
             className="meta-info-wrapper position-absolute w-100"
             style={{display: "none"}}
        >
          <div className="d-table w-100 text-white">
            <div className="pl-4 d-table-cell align-middle text-left mr-auto"
                 style={{color: this.props.secondaryColor}}>
              {this.makeAuthor()}
            </div>
            <div className="pr-4 d-table-cell align-middle text-right">
              <CloseRounded
                  onClick={this.props.onCloseClick}
                  style={this.props.makeHoverStyle(this.state.cursorOverClose)}
                  onMouseEnter={() => this.setState({cursorOverClose: true})}
                  onMouseLeave={() => this.setState({cursorOverClose: false})}/>
            </div>
          </div>
        </div>
    );
  }
}

MetaInfoWrapper.propTypes = {
  refSpec: PropTypes.object.isRequired,
  image: PropTypes.exact({
    src: PropTypes.string.isRequired,
    author: PropTypes.string,
    savedFrom: PropTypes.string
  }).isRequired,
  onCloseClick: PropTypes.func.isRequired,
  secondaryColor: PropTypes.string,
  accentColor: PropTypes.string,
  makeHoverStyle: PropTypes.func.isRequired,
};

export default MetaInfoWrapper;