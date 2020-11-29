import React from 'react';
import './ResizableImage.css';
import {Rnd} from "react-rnd";
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import {connect} from "react-redux";


class ResizableImage extends React.Component {
    handleRemoveImage(image) {
        this.props.dispatch({type: 'REMOVE_ELEMENT', id: image.props.id})
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
                <IconButton color="secondary"
                            aria-label="close"
                            className="resizeable-image-container-close-button"
                            onClick={() => this.handleRemoveImage(this)}
                >
                    <CloseIcon/>
                </IconButton>
                {this.props.id}
            </Rnd>
        );
    }
}

ResizableImage.propTypes = {};

ResizableImage.defaultProps = {};




export default connect()(ResizableImage);
