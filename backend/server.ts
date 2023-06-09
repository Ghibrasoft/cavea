import { Sequelize, DataTypes } from "sequelize";
import express, { Request, Response } from "express";
import { Express } from "express";
import Chance from "chance";
import cors from "cors";
require("dotenv").config();

const chance = new Chance();

const app: Express = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" }));

// Passing a connection URL
// const sequelize = new Sequelize(process.env.CONN_POSTG_URL || "", {
//   define: {
//     freezeTableName: true, // don't pluralize names globally
//   },
// });

// locally PG
const sequelize = new Sequelize({
  dialect: "postgres",
  username: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DB,
  host: process.env.HOST,
  port: Number(process.env.PORT_PG),
  define: {
    freezeTableName: true, // don't pluralize names globally
  },
});

// Creating a model
const Inventory = sequelize.define(
  "Inventory",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    item: {
      type: DataTypes.STRING,
    },
    location: {
      type: DataTypes.STRING,
    },
    price: {
      type: DataTypes.INTEGER,
    },
  },
  { freezeTableName: true } //  don't pluralize names locally
);

// Creates the table if it doesn't exist (and does nothing if it already exists)
async function addModel() {
  await Inventory.sync();
  console.log("Database sync success..!");
}
// addModel();

// generate records randomly for testing (unComment and press Ctrl + S )
const branches = [
  "Head Office",
  "Cavea Tbilisi Mall",
  "Cavea City Mall",
  "Cavea East Point",
  "Cavea Gallery",
];
const items = ["default item", "custom item", "item"];
function addItem() {
  for (let i = 1; i <= 5; i++) {
    const newItem = Inventory.build({
      item: chance.pickone(items),
      location: chance.pickone(branches),
      price: chance.integer({ min: 15, max: 30 }),
    });
    newItem.save();
  }
}
// addItem();

// GET all items
app.get("/Inventory", async (req: Request, res: Response) => {
  // pagination and sorting
  const page = Number(req.query.page) || 1;
  const limit = 20;
  const offset = (page - 1) * limit;

  const { count, rows } = await Inventory.findAndCountAll({
    limit: limit,
    offset: offset,
    order: [
      [sequelize.fn("LOWER", sequelize.col("item")), "ASC"],
      ["price", "DESC"],
    ],
  });

  const allItemsLength = await Inventory.count();
  const data = {
    rows,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    allItemsLength,
  };
  res.json(data);
});

// POST
app.post("/Inventory", async (req: Request, res: Response) => {
  const { item, location, price } = req.body;
  const newItem = await Inventory.create({ item, location, price });
  res.json(newItem);
  console.log("Item added successfully!");
});

// UPDATE
app.put("/Inventory/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { item, location, price } = req.body;

  try {
    const updatedFields = {
      ...(item && { item }),
      ...(location && { location }),
      ...(price && { price }),
    };

    const [numUpdatedRows] = await Inventory.update(updatedFields, {
      where: { id },
    });

    if (numUpdatedRows === 0) {
      return res.status(404).json({ message: `Row with ID ${id} not found` });
    }

    res.json({ message: `Row with ID ${id} updated successfully` });
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: "Internal server error" });
  }
});

// DELETE
app.delete("/Inventory/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const deleteItem = await Inventory.destroy({ where: { id } });

  if (deleteItem > 0) {
    res.json({ message: "Item deleted successfuly!" });
  } else {
    res.status(404).json({ error: "Item not found" });
  }
});

const port = process.env.PORT || 4321;
app.listen(port, () => {
  console.log(`Server is Running on ${port}`);
});

module.exports = Inventory; //  it can be imported and used by other modules in your application.
