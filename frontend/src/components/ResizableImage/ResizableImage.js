import React from 'react';
import PropTypes from 'prop-types';
import './ResizableImage.css';
import {Rnd} from "react-rnd";
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';


class ResizableImage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Rnd
                className="resizeable-image-container"
                default={{
                    x: this.props.x,
                    y: this.props.y,
                    width: this.props.width,
                    height: this.props.height,
                }}
                bounds={this.props.bounds}
            >
                <IconButton color="secondary" aria-label="close" className="resizeable-image-container-close-button">
                    <CloseIcon/>
                </IconButton>
            </Rnd>
        );
    }
}

ResizableImage.propTypes = {};

ResizableImage.defaultProps = {};

export default ResizableImage;
