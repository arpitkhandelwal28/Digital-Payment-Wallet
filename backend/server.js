const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect('mongodb+srv://akhandelwal1228:W5yEH3oBJGfSPTTL@cluster0.x12q5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
).then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    upi_id: {type: String, unique: true},
    balance: {type: Number}
});

const User = mongoose.model('User', userSchema);

const transactionSchema = new mongoose.Schema({
    sender_upi_id: {type: String, required: true},
    reciever_upi_id: {type: String, required: true},
    amount: {type: Number, required: true},
    timeStamp: {type: Date, default: Date.now}
});

const Transaction = mongoose.model('Transaction', transactionSchema);

const generateUPI = () => {
    const randomId = crypto.randomBytes(4).toString('hex');
    return `${randomId}@fastpay`;
};

app.post('/api/signup', async (req, res) => {
    try{
        const { name, email, password} = req.body;

        let user = await User.findOne({email});
        if(user){
            return res.status(400).send({message: 'User already exists'});
        }

        const upi_id = generateUPI();
        const balance = 1000;

        user = new User({name, email, password, upi_id, balance});
        await user.save();
        res.status(201).send({message: 'User registered successfully', upi_id});
    } catch(error){
        console.log(error);
        res.status(500).send({message: 'Server error'});
    }
});

app.get('/api/user/:upi_id', async(req,res) => {
    try{
        const { upi_id} = req.params;
        const user = await User.findOne({upi_id});

        if(!user){
            return res.status(404).send({message: 'User not found'});
        }

        res.status(200).send(user);
    }catch(error){
        console.error('Error fetching user:', error);
    }
});

app.post('/api/login', async(req,res) => {
    try{
        const {email, password} = req.body;

        const user = await User.findOne({email});
        if(!user || user.password !== password) {
            return res.status(400).send({message:"Invalid credentials"});
        }

        res.status(200).send({
            message: "Login successful",
            upi_id: user.upi_id,
            balance: user.balance,
        });
    }catch(error){
        console.error(error);
        res.status(500).send({message: "Server Error"});
    }
});

app.post('/api/transaction', async(req,res) => {
    try{
        const {sender_upi_id, reciever_upi_id, amount} = req.body;

        if(amount <= 0){
            return res.status(400).send({message: "Invalid amount"});
        }

        const sender = await User.findOne({upi_id: sender_upi_id});
        const reciever = await User.findOne({upi_id: reciever_upi_id});

        if(!sender){
            return res.status(404).send({message: "Sender not found"});
        }
        if(!reciever){
            return res.status(404).send({message: "Reciever not found"});
        }

        sender.balance -= amount;
        reciever.balance += amount;

        console.log("Updating sender balance:", sender);
        console.log("Updating reciever balance:", reciever);

        await sender.save();
        await reciever.save();

        console.log("Sender balance after save:", sender);
        console.log("Reciever balance after save:", reciever);

        const transaction = new Transaction({
            sender_upi_id,
            reciever_upi_id,
            amount,
        });
        await transaction.save();

        res.status(200).send({message: "Transaction successful"});
    }catch(error){
     console.error("Transaction error:", error);
     res.status(500).send({message: "Server error"});
    }
});

app.get("/api/transaction/:upi_id", async(req,res) => {
    try{
        const {upi_id} = req.params;

        const transactions = await Transaction.find({
            $or: [{ sender_upi_id: upi_id}, {reciever_upi_id: upi_id}],
        }).sort({timeStamp: -1});
        
        res.status(200).send(transactions);
    }catch(error){
        console.error(error);
        res.status(500).send({message: "Server error"});
    }
});

const PORT = process.env.PORT || 4003;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));