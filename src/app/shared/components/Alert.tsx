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

        <div className="row">
            <div className="col">
                <div className="p-3 mb-sm-4 p-lg-5">
                    <div className={`alert ${alertType}`}>
                        {text}
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Alert