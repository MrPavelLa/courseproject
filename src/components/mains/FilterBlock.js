import React, { useState } from 'react';
import '../../styles/WLTstyle.css';
import { Button, Typography } from '@mui/material';

const FilterBlock = ({ onSortByDate, onSortByCost, webtype }) => {
  const [sortByDateAsc, setSortByDateAsc] = useState(true);
  const [sortByCostAsc, setSortByCostAsc] = useState(true);

  const handleSortByDate = () => {
    onSortByDate(sortByDateAsc);
    setSortByDateAsc((prev) => !prev);
  };

  const handleSortByCost = () => {
    onSortByCost(sortByCostAsc);
    setSortByCostAsc((prev) => !prev);
  };

  return (
    <div className='Filter'>
  <p style={{ color: 'white' }}>Сортировать по:</p>

  {webtype !== 'lecture' && (
    <Button onClick={handleSortByDate} variant="outlined" style={{ color: 'white', border: 'none' }}>
      {sortByDateAsc ? ' дате ▼' : 'дате ▲'}
    </Button>
  )}

  <Button onClick={handleSortByCost} variant="outlined" style={{ color: 'white', border: 'none' }}>
    {sortByCostAsc ? ' стоимости ▼' : 'стоимости ▲'}
  </Button>
</div>

  );
};

export default FilterBlock;
