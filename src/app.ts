import { count } from 'console';
import express from 'express';
const app = express();
const port = 3000;
app.use(express.json());
const database = new Map<string, number>();



interface Item {
  shortDescription: string;
  price: string;
}

app.post('/receipts/process', (req, res) => {
  const data = req.body;
  if(!data) {
    res.status(400).json({"error": "Receipt not found"});
    return;
  }

  let points : number = 0;
  const retailer = data.retailer;
  const date = data.purchaseDate;
  const time = data.purchaseTime;
  const total = (data.total)? parseFloat(data.total) : undefined;
  const items = data.items;

  if (!retailer || !date || !time || !total || !items) {
    res.status(400).json({"error": "Receipt data discrepancy"});
    return;
  }
  // alphanumeric character points
  points += countAlphabet(retailer);

  // round dollar amount points
  points += isRounded(total)? 50 : 0;

  // total is a multiple of 0.25 points
  points += (total && total * 100 % 25 == 0)? 25 : 0;

  // items points
  points += (total)? Math.floor(items.length / 2) * 5 : 0;

  // Odd day points
  points += isOddDay(date)? 6 : 0;

  // Trimmed length points
  points += lengthPoints(items);
  
  // Time points
  points += timePoints(time);

  const id: string = generateRandomID();
  database.set(id, points);
  const jsonData = {
    id: id
  };
  res.status(200).json(jsonData);
});

app.get('/receipts/:id/points', (req, res) => {
  const id = req.params.id;
  const points: number = database.get(id);
  if (!points) {
    res.status(400).json({error: "ID not exist"});
    return;
  }
  const jsonData = {
    points: points
  };
  res.status(200).json(jsonData);
});

function generateRandomID(): string {
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789-';
  let result = '';
  for (let i = 0; i < 36; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  return result;
}


function timePoints(time: string): number {
  const hours = parseInt(time.split('-')[0]);
  return (hours >= 14 && hours < 16)? 10 : 0;
}

function lengthPoints(items: Array<Item>): number {
  let points: number = 0;

  for (let i = 0; i < items.length; i++) {
    const shortDescription = items[i].shortDescription.trim();
    const price = parseFloat(items[i].price);
    if (shortDescription.length % 3 == 0) {
      points += Math.ceil(price * 0.2);
      console.log(Math.ceil(price * 0.2));
    }
  }

  return points;
}

function isOddDay(date: string): boolean {

  const digit = +date[date.length - 1];
  return digit % 2 == 1;
}

function isRounded(number: number): boolean {

  const ceilNumber = Math.ceil(number);
  return number === ceilNumber;
}

function countAlphabet(str: string): number {
  let count = 0;

  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (/^[a-zA-Z]$/.test(char)) {
      count++;
    }
  }

  return count;
}

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});