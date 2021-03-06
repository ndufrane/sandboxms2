import React, { PropTypes } from 'react';
var {ButtonGroup, Button} = require('react-bootstrap');
var _ = require('lodash');
const Message = require('../../../MapStore2/web/client/plugins/locale/Message');

class BrugisPagination extends React.Component {

    static propTypes = {
        items: PropTypes.array.isRequired,
        onChangePage: PropTypes.func.isRequired,
        initialPage: PropTypes.number,
        surveyUpdate: PropTypes.number
    };

    static defaultProps = {
        initialPage: 1
    };

    constructor(props) {
        super(props);
        this.state = { pager: {} };
    }

    componentWillMount() {
        this.setPage(this.props.initialPage);
    }

    componentWillReceiveProps(newProps) {
        if ( this.props.surveyUpdate < newProps.surveyUpdate ) {
            this.updatePage(this.state.pager.currentPage);
        }
    }

    getPager(totalItems, currentPageParam, pageSizeParam) {
        var totalPages;
        var startPage;
        var endPage;
        var startIndex;
        var endIndex;
        var pages;
        var currentPage;
        var pageSize;

        // default to first page
        currentPage = currentPageParam || 1;

        // default page size is 10
        pageSize = pageSizeParam || 5;

        // calculate total pages
        totalPages = Math.ceil(totalItems / pageSize);


        if (totalPages <= 10) {
            // less than 10 total pages so show all
            startPage = 1;
            endPage = totalPages;
        } else {
            // more than 10 total pages so calculate start and end pages
            if (currentPage <= 6) {
                startPage = 1;
                endPage = 10;
            } else if (currentPage + 4 >= totalPages) {
                startPage = totalPages - 9;
                endPage = totalPages;
            } else {
                startPage = currentPage - 5;
                endPage = currentPage + 4;
            }
        }

        // calculate start and end item indexes
        startIndex = (currentPage - 1) * pageSize;
        endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);
        pages = _.range(startPage, endPage + 1);
        // create an array of pages to ng-repeat in the pager control

        // return object with all pager properties required by the view
        return {
            totalItems: totalItems,
            currentPage: currentPage,
            pageSize: pageSize,
            totalPages: totalPages,
            startPage: startPage,
            endPage: endPage,
            startIndex: startIndex,
            endIndex: endIndex,
            pages: pages
        };
    }

    render() {
        var pager = this.state.pager;

        return (
          <ButtonGroup block>
            <Button disabled={pager.currentPage === 1 ? true : false} onClick={() => this.setPage(1)}>
              <Message msgId="brugisSurvey.first"/>
            </Button>
            <Button disabled={pager.currentPage === 1 ? true : false} onClick={() => this.setPage(pager.currentPage - 1)}>
              <Message msgId="brugisSurvey.prev"/>
            </Button>
            {pager.pages.map((page, index) =>
                <Button active={pager.currentPage === page ? true : false} onClick={() => this.setPage(page)} >{index + 1}</Button>
            )}
            <Button disabled={pager.currentPage === pager.totalPages ? true : false} onClick={() => this.setPage(pager.currentPage + 1)}>
              <Message msgId="brugisSurvey.next"/>
            </Button>
            <Button disabled={pager.currentPage === pager.totalPages ? true : false} onClick={() => this.setPage(pager.totalPages)}>
              <Message msgId="brugisSurvey.last"/>
            </Button>
          </ButtonGroup>
        );
    }

    updatePage(page) {
        var items = this.props.items;
        var pager = this.state.pager;
        var pageOfItems = items.slice(pager.startIndex, pager.endIndex + 1);

        // get new pager object for specified page
        pager = this.getPager(items.length, page);

        // get new page of items from items array

        // update state
        this.setState({ pager: pager });

        // call change page function in parent component
        this.props.onChangePage(pageOfItems);
    }

    setPage(page) {
        var items = this.props.items;
        var pager = this.state.pager;
        var pageOfItems = items.slice(pager.startIndex, pager.endIndex + 1);

        if (page < 1 || page > pager.totalPages) {
            return;
        }

        // get new pager object for specified page
        pager = this.getPager(items.length, page);

        // get new page of items from items array

        // update state
        this.setState({ pager: pager });

        // call change page function in parent component
        this.props.onChangePage(pageOfItems);
    }
}

module.exports = BrugisPagination;
