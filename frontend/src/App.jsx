import React, { useState, useEffect } from "react";
import axios from "axios";
import Bargraph from "./bargraph";
import Piechart from "./piechart";

const App = () => {
  const [search, setSearch] = useState("");
  const [month, setMonth] = useState("May");
  const [data, setData] = useState([]);
  const [bargraph, setBargraph] = useState({});
  const [page, setPage] = useState(1);
  const [disableNext, setDisableNext] = useState(false); 

  const server = import.meta.env.VITE_Backend_Url;
  let timeout;


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${server}all?srch=${search}&month=${month}&page=${page}`);
        setData(response.data.data);

       
        const nextPageResponse = await axios.get(`${server}all?srch=${search}&month=${month}&page=${page + 1}`);
        setDisableNext(nextPageResponse.data.data.length === 0);

        console.log("Response from server:", response);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };

    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(fetchData, 1000);

    return () => clearTimeout(timeout);
  }, [search, month, page]);

  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${server}allstat?month=${month}`);
        setBargraph(response.data);
      } catch (error) {
        console.error("Error fetching statistics:", error);
      }
    };

    fetchStats();
  }, [month, server]);


  const handleNextPage = () => {
    setPage(page + 1);
  };


  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  return (
    <div className="flex flex-col bg-blue-200 min-h-screen items-center p-8 cursor-pointer">
      <div className="flex flex-col items-center mb-8">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-4">
          <h1 className="text-lg font-bold text-center">Transaction Dashboard</h1>
        </div>
        <div className="flex justify-between p-4">
          <input
            type="text"
            className="bg-yellow-400 p-2 rounded"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            placeholder="Months"
            onChange={(e) => setMonth(e.target.value)}
            className="bg-yellow-400 m-2"
          >
            <option value="Jan">January</option>
            <option value="Feb">February</option>
            <option value="Mar">March</option>
            <option value="Apr">April</option>
            <option value="May" selected>May</option>
            <option value="Jun">June</option>
            <option value="Jul">July</option>
            <option value="Aug">August</option>
            <option value="Sep">September</option>
            <option value="Oct">October</option>
            <option value="Nov">November</option>
            <option value="Dec">December</option>
          </select>
        </div>
        <table className="bg-[#fdd835]">
          <thead>
            <tr>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Sold</th>
              <th className="px-4 py-2">Image</th>
            </tr>
          </thead>
          <tbody>
            {data.map((val, index) => (
              <tr key={index} className={`hover:bg-gray-100`}>
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">
                  <div className="max-w-[200px] truncate">
                    <span title={val.title}>{val.title}</span>
                  </div>
                </td>
                <td className="px-4 py-2">
                  <div className="max-w-[200px] truncate">
                    <span title={val.description}>{val.description}</span>
                  </div>
                </td>
                <td className="px-4 py-2">{"$" + parseFloat(val.price).toFixed(2)}</td>
                <td className="px-4 py-2">{val.category}</td>
                <td className="px-4 py-2">{val.sold ? "Yes" : "No"}</td>
                <td className="px-4 py-2">
                  <a href={val.image}>
                    <img src={val.image} alt="Placeholder" className="w-12 h-12" />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center space-x-4 mt-8">
        <span className="text-lg">Page {page}</span>
        <button
          className={`bg-yellow-400 px-4 py-2 rounded ${page === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={handlePrevPage}
          disabled={page === 1}
        >
          Previous
        </button>
        <button
          className={`bg-yellow-400 px-4 py-2 rounded ${disableNext ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={handleNextPage}
          disabled={disableNext}
        >
          Next
        </button>
        <span className="text-lg">Per Page: 10</span>
      </div>

      <div className="flex flex-col justify-center items-center mt-8">
        <h1 className="font-bold text-3xl">Statistics - {month}</h1>
        <div className="bg-yellow-200 rounded-2xl p-8">
          {bargraph.Stat ? (
            <>
              <div>Total Amount Sold: ${(bargraph.Stat.AmountSold).toFixed(2)}</div>
              <div>Items Sold: {bargraph.Stat.Itemsold}</div>
              <div>Items Not Sold: {bargraph.Stat.Notsold}</div>
            </>
          ) : (
            <div>Loading statistics...</div>
          )}
        </div>
      </div>

      <div className="mx-auto m-24 w-full text-center p-8">
        <h1 className="text-3xl font-bold mb-4">Bargraph - {month}</h1>
        {bargraph.bargraph ? (
          <Bargraph bardata={bargraph.bargraph} />
        ) : (
          <div className="text-lg font-semibold text-gray-600">Loading bargraph...</div>
        )}
      </div>

      <div className="mx-auto m-24 w-full text-center p-8">
        <h1 className="text-3xl font-bold mb-4">PieChart - {month}</h1>
        {bargraph.piechart ? (
          <Piechart data={bargraph.piechart} />
        ) : (
          <div className="text-lg font-semibold text-gray-600">Loading piechart...</div>
        )}
      </div>

     
    </div>
  );
};

export default App;
