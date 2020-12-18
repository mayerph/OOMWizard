import React from 'react';
import './ResizableText.css';
import {Rnd} from "react-rnd";
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import {connect} from "react-redux";
import {Editor, EditorState, Modifier, ContentState} from 'draft-js';

class ResizableText extends React.Component {
    constructor(props) {
        super(props);
        const initialContent = ContentState.createFromText("Meme texxtt");
        this.state = {editorState: EditorState.createWithContent(initialContent)};
        this.onChange = editorState => this.setState({editorState});
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.editorStateId === this.props.id) {
            if (typeof this.props.editorState !== 'undefined' && typeof prevProps.editorState !== 'undefined'
                && !this.props.inlineStyles.equals(prevProps.inlineStyles)) {

                let currentContent = prevState.editorState.getCurrentContent();

                // Remove old inline styles
                for (let style of prevState.editorState.getCurrentInlineStyle()) {
                    const selection = prevState.editorState.getSelection()
                    currentContent = Modifier.removeInlineStyle(currentContent, selection, style);
                }

                let editorState = EditorState.push(this.props.editorState, currentContent, 'change-inline-style');

                // add new inline styles
                for (let style of this.props.inlineStyles) {
                    const selection = editorState.getSelection().merge({
                        anchorKey: currentContent.getFirstBlock().getKey(),
                        anchorOffset: 0,
                        focusOffset: currentContent.getLastBlock().getText().length,
                        focusKey: currentContent.getLastBlock().getKey()
                    });
                    currentContent = Modifier.applyInlineStyle(currentContent, selection, style);
                    editorState = EditorState.push(editorState, currentContent, 'change-inline-style');
                }
                this.setState({editorState: editorState})
            }
        }
    }

    handleRemoveText(e, text) {
        this.props.dispatch({type: 'REMOVE_ELEMENT', id: text.props.id})
        this.props.dispatch({type: 'UNFOCUS_EDITOR_STATE'})
    }

    changeFocus(e, editorState) {
        if (e.target.tagName !== 'path' && e.target.tagName !== 'svg') {
            this.props.dispatch({
                editorStateId: this.props.id,
                type: 'FOCUS_EDITOR_STATE',
                editorState: editorState,
                inlineStyles: editorState.getCurrentInlineStyle()
            })
        }
    }


    render() {
        let focusedBorderColor = this.props.id === this.props.editorStateId ? 'red' : 'inherit'
        return (
            <Rnd
                style={{borderColor: focusedBorderColor}}
                className="resizeable-text-container"
                default={{
                    x: this.props.x,
                    y: this.props.y,
                }}
                bounds={this.props.bounds}
                onClick={(e) => this.changeFocus(e, this.state.editorState)}
                disableDragging={false}
            >
                <Editor
                    editorState={this.state.editorState}
                    customStyleMap={ResizableText.colorStyleMap}
                    onChange={this.onChange}
                />
                <IconButton color="secondary"
                            aria-label="close"
                            className="resizeable-text-container-close-button"
                            onClick={(e) => this.handleRemoveText(e, this)}
                >
                    <CloseIcon/>
                </IconButton>
            </Rnd>
        );
    }
}

ResizableText.propTypes = {};

ResizableText.defaultProps = {};

ResizableText.colorStyleMap = {
    black: {
        color: 'rgba(0, 0, 0, 1.0)',
    },
    red: {
        color: 'rgba(255, 0, 0, 1.0)',
    },
    orange: {
        color: 'rgba(255, 127, 0, 1.0)',
    },
    yellow: {
        color: 'rgba(180, 180, 0, 1.0)',
    },
    green: {
        color: 'rgba(0, 180, 0, 1.0)',
    },
    blue: {
        color: 'rgba(0, 0, 255, 1.0)',
    },
    indigo: {
        color: 'rgba(75, 0, 130, 1.0)',
    },
    violet: {
        color: 'rgba(127, 0, 255, 1.0)',
    },
};

function mapStateToProps(state) {
    return {
        editorStateId: state.focusEditorState.editorStateId,
        editorState: state.focusEditorState.editorState,
        inlineStyles: state.focusEditorState.inlineStyles
    }
}


export default connect(mapStateToProps)(ResizableText);
