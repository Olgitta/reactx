import React from 'react';

interface PageTitleProps {
    title: string;
}

const PageTitle: React.FC<PageTitleProps> = ({ title }) => {
    return (
        <div className="row">
            <div className="col">
                <div className="page-header">
                    <h2 className="page-title">{title}</h2>
                </div>
            </div>
        </div>
    )
}

export default PageTitle