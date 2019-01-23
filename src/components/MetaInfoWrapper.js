import {CloseRounded} from "@material-ui/icons";
import PropTypes from "prop-types";
import React, {Component} from "react";

class MetaInfoWrapper extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
        <div ref={this.props.refSpec}
             className="meta-info-wrapper position-absolute w-100"
             style={{display: "none"}}
        >
          <div className="d-table w-100 text-white">
            <div className="pl-4 d-table-cell align-middle text-left mr-auto">
              {this.props.author}
            </div>
            <div className="pr-4 d-table-cell align-middle text-right">
              <CloseRounded className="close"/>
            </div>
          </div>
        </div>
    );
  }
}

MetaInfoWrapper.propTypes = {
  refSpec: PropTypes.object.isRequired,
  author: PropTypes.object.isRequired
};

export default MetaInfoWrapper;