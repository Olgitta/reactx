import React from "react";

interface IPaginationProps {
    totalPages: number;
    onPageChange: (page: string) => void;
    nextPageUrl: string | null;
    prevPageUrl: string | null;
}

/*
If a component only depends on props and doesn’t need state,
you can use React.PureComponent to optimize unnecessary re-renders.
 */
class Pagination extends React.PureComponent<IPaginationProps> {
    render() {
        const { totalPages, onPageChange, nextPageUrl, prevPageUrl } = this.props;

        const handleNavigation = (url: string | null) => {
            if (!url) return;
            onPageChange(url);
        };

        return (
            <nav className="mt-3">
                <ul className="pagination justify-content-center">
                    <li className={`page-item ${!prevPageUrl ? "disabled" : ""}`}>
                        <button
                            className="page-link"
                            onClick={() => handleNavigation(prevPageUrl)}
                            disabled={!prevPageUrl}
                        >
                            Previous
                        </button>
                    </li>
                    <li className="page-item disabled">
            <span className="page-link">
              Total pages {totalPages}
            </span>
                    </li>
                    <li className={`page-item ${!nextPageUrl ? "disabled" : ""}`}>
                        <button
                            className="page-link"
                            onClick={() => handleNavigation(nextPageUrl)}
                            disabled={!nextPageUrl}
                        >
                            Next
                        </button>
                    </li>
                </ul>
            </nav>
        );
    }
}

export default Pagination;
