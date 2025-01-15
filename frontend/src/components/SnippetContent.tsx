import React, { useEffect, useState, useRef, useCallback } from 'react';
import { debounce } from 'lodash';
import './SnippetContent.css';
import { RootState } from '../store';
import { updateSnippetContent } from '../store/itemSlice';
import {useAppDispatch, useAppSelector} from "../store/hooks";

const SnippetContent = () => {
    const dispatch = useAppDispatch();
    const snippet = useAppSelector((state: RootState) => state.item.selectedSnippet);
    const uuid = useAppSelector((state) => state.user.uuid) as string;


    const [content, setContent] = useState(snippet?.content || '');
    const contentRef = useRef(content); // useRef to track content state
    contentRef.current = content; // Always keep the ref current with the content state

    const debouncedSave = useCallback(debounce(() => {
        if (snippet?.id && contentRef.current !== snippet.content) {
            dispatch(updateSnippetContent({ snippetId: snippet.id, content: contentRef.current, userId: uuid }));
        }
    }, 1000), [dispatch, snippet]);  // Add dependencies here

    useEffect(() => {
        if (snippet) {
            setContent(snippet.content || '');
        }
    }, [snippet]);

    useEffect(() => {
        return () => debouncedSave.cancel();
    }, [debouncedSave]);


    const handleContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newContent = event.target.value;
        setContent(newContent);
        debouncedSave(); // Trigger debounced save
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Tab') {
            event.preventDefault();
            const target = event.target as HTMLTextAreaElement;
            const start = target.selectionStart;
            const end = target.selectionEnd;
            const newValue = content.substring(0, start) + "    " + content.substring(end);

            setContent(newValue);
            setTimeout(() => {
                target.selectionStart = target.selectionEnd = start + 4;
            }, 0);
        }
    };

    if (!snippet) {
        return <div className="main-content">
            <div className="content-heading-container">
                <h1 className="content-heading">&nbsp;</h1>
            </div>
        </div>;
    }

    return (
        <div className="main-content">
            <div className="content-heading-container">
                <h1 className="content-heading">{snippet.name}</h1>
            </div>
            <hr className="heading-divider" />
            <div className="content-body">
                <textarea
                    className="snippet-editor"
                    value={content}
                    onChange={handleContentChange}
                    onKeyDown={handleKeyDown}
                />
            </div>
        </div>
    );
};

export default SnippetContent;