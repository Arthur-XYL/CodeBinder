import { useRef } from 'react';
import { useAppSelector } from '../store/hooks';

import BinderSidebar from './BinderSidebar';
import SnippetContent from './SnippetContent';
import './Section.css';
import {RootState} from "../store";

const Section = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const activeMenu = useAppSelector((state: RootState) => state.menu.activeMenu);

    return activeMenu === 'binder' ? (
        <div ref={sectionRef} className="section-container">
            <BinderSidebar parentRef={sectionRef} />
            <SnippetContent />
        </div>
    ) : null;
};

export default Section;
