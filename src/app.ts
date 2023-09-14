import express from 'express';
const app = express();
const port = 3000;
app.use(express.json());
const database = new Map<string, number>();
const regexpDescription = new RegExp('^[\\w\\s\\-]+$');
const regexpPrice = new RegExp('^\\d+\\.\\d{2}$');
const regexNormal = new RegExp('^\\S+$')
interface Receipt {
  retailer: string;
  purchaseDate: string;
  purchaseTime: string;
  items: Array<Item>;
  total: string;
}

interface Item {
  shortDescription: string;
  price: string;
}

app.post('/receipts/process', (req, res) => {
  if(!req.body) {
    res.status(400).json({"description": "The receipt is invalid"});
    return;
  }
  const data = req.body as Receipt;
  if (!matchPatterns(data)) {
    res.status(400).json({"description": "The receipt is invalid"});
    return;
  }

  const retailer = data.retailer;
  const date = data.purchaseDate;
  const time = data.purchaseTime;
  const total = (data.total)? parseFloat(data.total) : undefined;
  const items = data.items;
  
  // alphanumeric character points
  const alphabetPoints = countAlphabet(retailer);
  console.log('alphabet points: ' + alphabetPoints);

  // round dollar amount points
  const roundedDollarPoints = isRounded(total)? 50 : 0;
  console.log('round dollar amount points: ' + roundedDollarPoints);

  // total is a multiple of 0.25 points
  const multipleOfQuaterPoints = (total && total * 100 % 25 == 0)? 25 : 0;
  console.log('multiple of 0.25 points: ' + multipleOfQuaterPoints);

  // items points
  const itemsPoints = (total)? Math.floor(items.length / 2) * 5 : 0;
  console.log('items points: ' + itemsPoints);

  // Odd day points
  const oddDayPoints = isOddDay(date)? 6 : 0;
  console.log('Odd day points: ' + oddDayPoints);

  // Trimmed length points
  const trimmedLengthPoints = lengthPoints(items)
  console.log('Trimmed length points: ' + trimmedLengthPoints);
  
  // Time points
  const timeInRangePoints = timePoints(time);
  console.log('Time points: ' + timeInRangePoints);


  const points = alphabetPoints + roundedDollarPoints + multipleOfQuaterPoints + itemsPoints + oddDayPoints + trimmedLengthPoints + timeInRangePoints;
  const id: string = generateRandomID();

  database.set(id, points);
  const jsonData = {
    'id': id
  };
  res.status(200).json(jsonData);
});

app.get('/receipts/:id/points', (req, res) => {
  const id = req.params.id;
  if (!id) {
    res.status(404).json({'description': 'No receipt found for that id'});
    return;
  }
  const points: number = database.get(id);
  if (!points) {
    res.status(404).json({'description': 'No receipt found for that id'});
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
    }
  }

  return points;
}

function matchPatterns(data: Receipt): boolean {
  if (!data.retailer || !data.total || !data.purchaseTime || !data.purchaseDate || !data.items)
    return false;
  

  for (let i = 0; i < data.items.length; i++) {
    const shortDescription = data.items[i].shortDescription;
    const price = data.items[i].price;
    if (!regexpDescription.test(shortDescription) || !regexpPrice.test(price))
      return false;
  }
  // The pattern wrote said reatailer should match ^\\S+$ but it seems not in the test cases
  return regexpPrice.test(data.total);
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