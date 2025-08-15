const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(
  'mongodb+srv://akhandelwal1228:uraop9B3ZSV39lxW@cluster0.x12q5.mongodb.net/fastpay?retryWrites=true&w=majority&appName=Cluster0',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
)
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error(err));

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },  // hashed password
  upi_id: { type: String, unique: true },
  balance: { type: Number, default: 1000 },
});

const User = mongoose.model('User', userSchema);

const transactionSchema = new mongoose.Schema({
  sender_upi_id: { type: String, required: true },
  reciever_upi_id: { type: String, required: true },
  amount: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },  // fixed lowercase 'timestamp'
});

const Transaction = mongoose.model('Transaction', transactionSchema);

const generateUPI = () => {
  const randomId = crypto.randomBytes(4).toString('hex');
  return `${randomId}@fastpay`;
};

// Signup route with password hashing
app.post('/api/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).send({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const upi_id = generateUPI();
    const balance = 1000;

    user = new User({ name, email, password: hashedPassword, upi_id, balance });
    await user.save();

    res.status(201).send({ message: 'User registered successfully', upi_id });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Server error' });
  }
});

// Get user by UPI ID
app.get('/api/user/:upi_id', async (req, res) => {
  try {
    const { upi_id } = req.params;
    const user = await User.findOne({ upi_id });

    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    // Exclude password in response
    const { password, ...userData } = user.toObject();

    res.status(200).send(userData);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).send({ message: 'Server error' });
  }
});

// Login route with password verification
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send({ message: 'Invalid credentials' });
    }

    res.status(200).send({
      message: 'Login successful',
      upi_id: user.upi_id,
      balance: user.balance,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Server error' });
  }
});

// Transaction route with balance check
app.post('/api/transactions', async (req, res) => {
  try {
    const { sender_upi_id, reciever_upi_id, amount } = req.body;

    if (amount <= 0) {
      return res.status(400).send({ message: 'Invalid amount' });
    }

    const sender = await User.findOne({ upi_id: sender_upi_id });
    const reciever = await User.findOne({ upi_id: reciever_upi_id });

    if (!sender) {
      return res.status(404).send({ message: 'Sender not found' });
    }
    if (!reciever) {
      return res.status(404).send({ message: 'Receiver not found' });
    }

    if (sender.balance < amount) {
      return res.status(400).send({ message: 'Insufficient balance' });
    }

    sender.balance -= amount;
    reciever.balance += amount;

    await sender.save();
    await reciever.save();

    const transaction = new Transaction({
      sender_upi_id,
      reciever_upi_id,
      amount,
    });
    await transaction.save();

    res.status(200).send({ message: 'Transaction successful' });
  } catch (error) {
    console.error('Transaction error:', error);
    res.status(500).send({ message: 'Server error' });
  }
});

// Get transactions by UPI ID (sent or received)
app.get('/api/transactions/:upi_id', async (req, res) => {
  try {
    const { upi_id } = req.params;

    const transactions = await Transaction.find({
      $or: [{ sender_upi_id: upi_id }, { reciever_upi_id: upi_id }],
    }).sort({ timestamp: -1 });

    res.status(200).send(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Server error' });
  }
});

const PORT = process.env.PORT || 4003;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
