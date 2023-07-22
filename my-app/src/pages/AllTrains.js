import React, { useState, useEffect } from "react";
import axios from "axios";

const TrainList = () => {
  const [trains, setTrains] = useState([]);
  const [sortingOrder, setSortingOrder] = useState({
    sortBy: "price", 
    ascending: true, 
  });

  useEffect(() => {
    const fetchTrainsData = async () => {
      try {
        const response = await axios.post('http://20.244.56.144/train/register');
        setTrains(response.data);
      } catch (error) {
        console.error('Error fetching train data:', error);
      }
    };

    fetchTrainsData();

    const interval = setInterval(fetchTrainsData, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleSortingChange = (event) => {
    const selectedRule = event.target.value;
    const isAscending =
      sortingOrder.sortBy === selectedRule ? !sortingOrder.ascending : true;
    setSortingOrder({ sortBy: selectedRule, ascending: isAscending });
  };

  
  const sortedTrains = [...trains].sort((a, b) => {
    const compareValue = sortingOrder.ascending ? 1 : -1;

    switch (sortingOrder.sortBy) {
      case "price":
        return (a.price - b.price) * compareValue;
      case "tickets":
        return (b.tickets - a.tickets) * compareValue;
      case "departureTime":
        return (
          (new Date(b.departureTime) - new Date(a.departureTime)) * compareValue
        );
      default:
        return 0;
    }
  });

  return (
    <div>
      <h1>All Trains</h1>
      <div>
        <label>
          Sort by:
          <select value={sortingOrder.sortBy} onChange={handleSortingChange}>
            <option value="price">Price</option>
            <option value="tickets">Tickets</option>
            <option value="departureTime">Departure Time</option>
          </select>
        </label>
      </div>
      <ul>
        {sortedTrains.map((train) => (
          <li key={train.id}>
            <strong>{train.name}</strong>
            <p>Route: {train.route}</p>
            {/* Add more details if needed */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TrainList;
