// CounterCard.js
import React from 'react';
import CountUp from 'react-countup';

const CounterCard = ({ count, symbol, speed }) => {
  return (
    <div className="text-center">
      <h2 className="text-4xl font-semibold">
        <CountUp end={count} duration={speed} />
        {symbol}
      </h2>
    </div>
  );
};

export default CounterCard;
