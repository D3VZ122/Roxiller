const express = require("express");
const axios = require("axios");
const { PrismaClient } = require("@prisma/client");
const getmonth = require("./getmonth");
const cors = require('cors');

const app = express();
const prisma = new PrismaClient();

app.use(cors());


app.get("/seed", async (req, res) => {
  try {
    const resp = await axios.get(
      "https://s3.amazonaws.com/roxiler.com/product_transaction.json"
    );

    const records = resp.data.map((record) => ({
      title: record.title,
      price: record.price.toString(),
      description: record.description,
      category: record.category,
      image: record.image,
      sold: record.sold,
      dateOfSale: record.dateOfSale,
      Month: record.dateOfSale.substr(5, 2),
    }));

    await prisma.ata.createMany({
      data: records,
    });

    return res.status(200).send({ message: "Data seeded successfully" });
  } catch (error) {
    console.error("Error seeding data:", error);
    return res
      .status(500)
      .send({ message: "Error seeding data", error: error.message });
  }
});

app.get("/all", async (req, res) => {
  var { page = 1, perpage = 10, srch = "", month = "Mar" } = req.query;
  perpage = parseInt(perpage);
  page = parseInt(page) - 1;
  const Month = getmonth(month);

  if (!srch || srch == "") {
    const resp = await prisma.ata.findMany({
      skip: perpage * page,
      take: perpage,
      where: {
        Month,
      },
    });

    return res.json({ data: resp });
  }
  const resp = await prisma.ata.findMany({
    skip: perpage * page,
    take: perpage,
    where: {
      Month,
      AND: {
        OR: [
          { title: { contains: srch, mode: "insensitive" } },
          { description: { contains: srch, mode: "insensitive" } },
          { price: { contains: srch, mode: "insensitive" } },
        ],
      },
    },
  });
  console.log(resp);

  return res.json({ data: resp });
});

app.get("/stat", async (req, res) => {
  const { month="May" } = req.query;
  const Month = getmonth(month);
  const data = await prisma.ata.findMany({
    where: {
      Month,
    },
  });

  var totalamount = 0;
  var titemsold = 0;
  var nitemsold = 0;

  data.map((val) => {
    if (val.sold == true) {
      totalamount += parseFloat(val.price);
      titemsold++;
    } else {
      nitemsold++;
    }
  });

  return res.json({data:{
    AmountSold: totalamount,
    Itemsold: titemsold,
    Notsold: nitemsold,
  }});
});

app.get("/bargraph", async (req, res) => {
  const { month } = req.query;
 
  const Month = getmonth(month);
  try {
    const transactions = await prisma.ata.findMany({
      where: {
        Month,
      },
    });

    const priceRanges = [
      { range: "0 - 100", count: 0 },
      { range: "101 - 200", count: 0 },
      { range: "201 - 300", count: 0 },
      { range: "301 - 400", count: 0 },
      { range: "401 - 500", count: 0 },
      { range: "501 - 600", count: 0 },
      { range: "601 - 700", count: 0 },
      { range: "701 - 800", count: 0 },
      { range: "801 - 900", count: 0 },
      { range: "901-above", count: 0 },
    ];

    transactions.forEach((transaction) => {
      const price = parseFloat(transaction.price);
      if (price >= 0 && price <= 100) {
        priceRanges[0].count++;
      } else if (price >= 101 && price <= 200) {
        priceRanges[1].count++;
      } else if (price >= 201 && price <= 300) {
        priceRanges[2].count++;
      } else if (price >= 301 && price <= 400) {
        priceRanges[3].count++;
      } else if (price >= 401 && price <= 500) {
        priceRanges[4].count++;
      } else if (price >= 501 && price <= 600) {
        priceRanges[5].count++;
      } else if (price >= 601 && price <= 700) {
        priceRanges[6].count++;
      } else if (price >= 701 && price <= 800) {
        priceRanges[7].count++;
      } else if (price >= 801 && price <= 900) {
        priceRanges[8].count++;
      } else if (price >= 901) {
        priceRanges[9].count++;
      }
    });

    const data = {
      month: Month,
      price_ranges: priceRanges,
    };

    res.json({data});
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/piechart", async (req, res) => {
  const { month="May" } = req.query;
  const Month = getmonth(month);
  const resp = await prisma.ata.findMany({
    where: {
      Month,
    },
  });
  const map = new Map();
  resp.forEach((val)=>{
    if(map.has(val.category)){
     var count = map.get(val.category)+1;
    map.set(val.category,count);
    }
    else{
      map.set(val.category,1);
    }
  });
  
 let data = [];
 map.forEach((value, key) => {
    data.push({category:key,Count:value});
});

return res.json({data});

});



app.get("/allstat",async(req,res)=>{
  const {month} = req.query;
  
  const resp1= await axios.get(`http://localhost:3001/stat?month=${month}`);
  const resp2= await axios.get(`http://localhost:3001/piechart?month=${month}`);
  const resp3= await axios.get(`http://localhost:3001/bargraph?month=${month}`);

  
  return res.json({Stat:resp1.data.data,piechart:resp2.data.data,bargraph:resp3.data.data.price_ranges});
})

app.listen(3001, () => {
  console.log("App running on port 3001");
});
