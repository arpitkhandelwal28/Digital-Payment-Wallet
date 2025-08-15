import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const Transaction = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [transactions, setTransactions] = useState([]);
  const [receiverUpi, setReceiverUpi] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      fetchTransactions(user.upi_id);
      fetchBalance(user.upi_id);
    }
  }, [user, navigate]);

  const fetchTransactions = async (upi_id) => {
    try {
      const response = await axios.get(`http://localhost:4003/api/transactions/${upi_id}`);
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const fetchBalance = async (upi_id) => {
    try {
      const response = await axios.get(`http://localhost:4003/api/use/${upi_id}`);
      // Keep balance updated in UI
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const handleTransaction = async () => {
    if (!amount || !receiverUpi) {
      setMessage('Please provide amount and receiver UPI ID.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('http://localhost:4003/api/transactions', {
        sender_upi_id: user.upi_id,
        reciever_upi_id: receiverUpi,
        amount: parseFloat(amount),
      });
      setMessage(response.data.message);

      if (response.status === 200) {
        await fetchTransactions(user.upi_id);
        await fetchBalance(user.upi_id);
        setAmount('');
        setReceiverUpi('');
      }
    } catch (error) {
      console.error('Error making transaction:', error);
      setMessage('Transaction failed');
    } finally {
      setLoading(false);
    }
  };

  const chartData = transactions
    .map((tx) => ({
      timestamp: new Date(tx.timestamp).toLocaleDateString(),
      amount: tx.amount,
    }))
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  return (
    <div className="container my-4">
      {user && (
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">User Information</h5>
            <p className="card-text"><strong>Email:</strong> {user.email}</p>
            <p className="card-text"><strong>UPI ID:</strong> {user.upi_id}</p>
            <p className="card-text"><strong>Balance:</strong> {user.balance}</p>
          </div>
        </div>
      )}

      <div className="mb-4">
        <h3>Initiate Transaction</h3>
        <div className="mb-3">
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            min="1"
            required
            className="form-control"
            onChange={(e) => {
              setAmount(e.target.value);
              setMessage('');
            }}
          />
        </div>
        <div className="mb-3">
          <input
            type="text"
            placeholder="Receiver UPI ID"
            value={receiverUpi}
            required
            className="form-control"
            onChange={(e) => {
              setReceiverUpi(e.target.value);
              setMessage('');
            }}
          />
        </div>
        <button className="btn btn-primary" onClick={handleTransaction} disabled={loading}>
          {loading ? 'Processing...' : 'Send Money'}
        </button>
        {message && <p className="mt-3">{message}</p>}
      </div>

      <div className="mb-4">
        <h3>Transaction History</h3>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Sender</th>
              <th>Receiver</th>
              <th>Amount</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction._id}>
                <td>{transaction.sender_upi_id}</td>
                <td>{transaction.reciever_upi_id}</td>
                <td>{transaction.amount}</td>
                <td>{new Date(transaction.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mb-4">
        <h3>Transaction Graph</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="amount" stroke="#8884d8" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Transaction;
