const express = require("express");
const Sequelize = require("sequelize");
const axios = require("axios");
const cors = require("cors"); 
require("dotenv").config();
//connection established with mysql
const seq = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASSWORD,
  {
    host: process.env.HOST,
    dialect: "mysql",
  }
);

// Define the 'users' model/table
const User = seq.define(
  "users",
  {
    gender: Sequelize.STRING,
    title: Sequelize.STRING(1500),
    first_name: Sequelize.STRING,
    last_name: Sequelize.STRING,
    street_number: Sequelize.INTEGER,
    street_name: Sequelize.STRING,
    city: Sequelize.STRING,
    state: Sequelize.STRING,
    country: Sequelize.STRING,
    postcode: Sequelize.STRING,
    latitude: Sequelize.DECIMAL(10, 6),
    longitude: Sequelize.DECIMAL(10, 6),
    timezone_offset: Sequelize.STRING,
    timezone_description: Sequelize.STRING,
    email: Sequelize.STRING,
    uuid: Sequelize.STRING,
    username: Sequelize.STRING,
    password: Sequelize.STRING,
    salt: Sequelize.STRING,
    md5: Sequelize.STRING,
    sha1: Sequelize.STRING,
    sha256: Sequelize.STRING,
    dob_date: Sequelize.DATE,
    dob_age: Sequelize.INTEGER,
    registered_date: Sequelize.DATE,
    registered_age: Sequelize.INTEGER,
    phone: Sequelize.STRING,
    cell: Sequelize.STRING,
    id_name: Sequelize.STRING,
    id_value: Sequelize.STRING,
    picture_large: Sequelize.STRING,
    picture_medium: Sequelize.STRING,
    picture_thumbnail: Sequelize.STRING,
    nat: Sequelize.STRING,
  },
  {
    timestamps: false, // Disable timestamps
  }
);

const app = express();
app.use(cors());
app.set("view engine", "ejs");
app.use(express.json());

// Function to fetch users from the API and store in the database
async function fetchAndStoreUsers() {
  const numRecords = 50; 

  try {
    const response = await axios.get(
      `https://randomuser.me/api/?results=${numRecords}`
    );
    const users = response.data.results;

    for (const user of users) {
      const {
        gender,
        name: { title, first, last },
        location: {
          street: { number, name },
          city,
          state,
          country,
          postcode,
          coordinates: { latitude, longitude },
          timezone: { offset, description },
        },
        email,
        login: { uuid, username, password, salt, md5, sha1, sha256 },
        dob: { date: dob_date, age: dob_age },
        registered: { date: registered_date, age: registered_age },
        phone,
        cell,
        id: { name: id_name, value: id_value },
        picture: {
          large: picture_large,
          medium: picture_medium,
          thumbnail: picture_thumbnail,
        },
        nat,
      } = user;

      await User.create({
        gender,
        title,
        first_name: first,
        last_name: last,
        street_number: number,
        street_name: name,
        city,
        state,
        country,
        postcode,
        latitude,
        longitude,
        timezone_offset: offset,
        timezone_description: description,
        email,
        uuid,
        username,
        password,
        salt,
        md5,
        sha1,
        sha256,
        dob_date,
        dob_age,
        registered_date,
        registered_age,
        phone,
        cell,
        id_name,
        id_value,
        picture_large,
        picture_medium,
        picture_thumbnail,
        nat,
      });
    }

    console.log(`${numRecords} users fetched and stored in the database.`);
    return numRecords;
    return users;
  } catch (error) {
    console.error("Error fetching users:", error.message);
    throw error;
  }
}
app.get("/fetch-users", async (req, res) => {
  try {
    await fetchAndStoreUsers();
    const users = await User.findAll(); // Fetch all users from the database
    res.json(users); // Send the array of users as the response
  } catch (error) {
    res.status(500).send("Error fetching and storing users.");
  }
});

// Function to delete all users from the database
async function deleteAllUsers() {
  try {
    await User.destroy({
      where: {},
      truncate: true,
    });

    console.log("All users deleted from the database.");
  } catch (error) {
    console.error("Error deleting users:", error.message);
    throw error;
  }
}


app.get("/delete-users", async (req, res) => {
  try {
    await deleteAllUsers();
    res.send("All users deleted from the database.");
  } catch (error) {
    res.status(500).send("Error deleting users.");
  }
});

// Function to fetch paginated user data from the database
async function getPaginatedUsers(pageNumber, pageSize, gender) {
  try {
    let whereClause = {};
    if (gender) {
      whereClause = { gender: gender.toLowerCase() };
    }

    const { count, rows } = await User.findAndCountAll({
      where: whereClause,
      offset: (pageNumber - 1) * pageSize,
      limit: pageSize,
    });

    return {
      totalItems: count,
      totalPages: Math.ceil(count / pageSize),
      currentPage: pageNumber,
      users: rows,
    };
  } catch (error) {
    console.error("Error fetching users:", error.message);
    throw error;
  }
}

app.get("/api/users", async (req, res) => {
  const pageNumber = req.query.page || 1;
  const pageSize = 10; // Set the number of items per page
  const gender = req.query.gender; // Extract the gender query parameter (if present)

  try {
    const paginatedUsers = await getPaginatedUsers(
      pageNumber,
      pageSize,
      gender
    );

    res.json(paginatedUsers);
  } catch (error) {
    res.status(500).json({ error: "Error fetching users." });
  }
});

seq.sync().then(() => {
  app.listen(8080, () => {
    console.log("Server Started");
  });
});
