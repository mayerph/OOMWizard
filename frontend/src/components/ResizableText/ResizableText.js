import React from 'react';
import './ResizableText.css';
import {Rnd} from "react-rnd";
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import {connect} from "react-redux";


class ResizableText extends React.Component {
    handleRemoveText(text) {
        this.props.dispatch({type: 'REMOVE_ELEMENT', id: text.props.id})
    }

    render() {
        return (
            <Rnd
                className="resizeable-text-container"
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
                            className="resizeable-text-container-close-button"
                            onClick={() => this.handleRemoveText(this)}
                >
                    <CloseIcon/>
                </IconButton>
                {this.props.id} Text
            </Rnd>
        );
    }
}

ResizableText.propTypes = {};

ResizableText.defaultProps = {};




export default connect()(ResizableText);
