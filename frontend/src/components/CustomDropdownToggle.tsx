import React, { MouseEventHandler, ReactNode } from 'react';

interface CustomDropdownToggleProps {
    children: ReactNode;
    onClick: MouseEventHandler<HTMLSpanElement>;
}

const CustomDropdownToggle = React.forwardRef<HTMLSpanElement, CustomDropdownToggleProps>(
    ({ children, onClick }, ref) => (
        <span
            ref={ref}
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClick(e);
            }}
            className="kebab-menu"
        >
            {children}
        </span>
    )
);

export default CustomDropdownToggle;
