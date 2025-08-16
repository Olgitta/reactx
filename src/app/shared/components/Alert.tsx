import React from 'react';

interface AlertProps {
    title: string;
}

const Alert: React.FC<AlertProps> = ({ title }) => {
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

export default Alert