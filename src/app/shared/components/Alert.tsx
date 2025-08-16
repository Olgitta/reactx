import React from 'react';

export interface AlertProps {
    text: string;
    loading?: boolean;
    error?: boolean;
}

const Alert: React.FC<AlertProps> = ({text, loading, error}) => {

    let alertType = '';

    if (loading) {
        alertType = 'alert-primary';
    } else if (error) {
        alertType = 'alert-danger';
    }

    return (

        <div className="d-flex align-items-center justify-content-center min-vh-100">
            <div className={`alert ${alertType}`}>
                {text}
            </div>
        </div>

    )
}

export default Alert