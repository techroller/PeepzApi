import React from 'react';
import get from 'lodash/get';
import range from 'lodash/range';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import PropTypes from 'prop-types';

export const Paginate = ({payload, onNext, onPrevious, onGoTo}) => {

  let page = get(payload, 'page', {number: -1, totalPages: 0});

  let pages = range(page.totalPages).map(i => (
      <PaginationItem active={page.number === i} key={i} disabled={page.number === i}>
        <PaginationLink onClick={() => onGoTo(i)}>{i + 1}</PaginationLink>
      </PaginationItem>
  ));

  return (
      <Pagination>
        <PaginationItem disabled={page.number < 1}>
          <PaginationLink previous onClick={onPrevious}/>
        </PaginationItem>
        {pages}
        <PaginationItem disabled={page.number >= (page.totalPages - 1)}>
          <PaginationLink next onClick={onNext}/>
        </PaginationItem>
      </Pagination>
  );
};

Paginate.propTypes = {
  payload: PropTypes.object.isRequired,
  onNext: PropTypes.func.isRequired,
  onPrevious: PropTypes.func.isRequired,
  onGoTo: PropTypes.func.isRequired,
};

export default Paginate;