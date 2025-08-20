import React from 'react';

interface PageTitleProps {
    title: string;
    text: string;
}

const PageTitle: React.FC<PageTitleProps> = ({ title, text }) => {
    return (
        <div className="row">
            <div className="col">
                <div className="page-header">
                    <h2 className="page-title">
                        {title}
                    </h2>
                    <h4 className="page-subtitle text-body-secondary">{text}</h4>
                </div>
            </div>
        </div>
    )
}

export default PageTitle