const { Pool } = require('pg');
const properties = require('./json/properties.json');
const users = require('./json/users.json');

const pool = new Pool({
  user: 'labber',
  password: 'labber',
  host: 'localhost',
  database: 'lightbnb'
});

pool.query(`SELECT title FROM properties LIMIT 10;`)
.then(response => {console.log(response)})

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
// const getUserWithEmail = function(email) {
//   let user;
//   for (const userId in users) {
//     user = users[userId];
//     if (user.email.toLowerCase() === email.toLowerCase()) {
//       break;
//     } else {
//       user = null;
//     }
//   }
//   return Promise.resolve(user);
// }

const getUserWithEmail = (email) => {
  return pool
    .query(`SELECT * FROM users WHERE email = $1`, [email])
    .then((result) => {
      console.log(result.rows);
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
// const getUserWithId = function(id) {
//   return Promise.resolve(users[id]);
// }

const getUserWithId = (id) => {
  return pool
    .query(`SELECT * FROM users WHERE id = $1`, [id])
    .then((result) => {
      console.log(result.rows);
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
// const addUser =  function(user) {
//   const userId = Object.keys(users).length + 1;
//   user.id = userId;
//   users[userId] = user;
//   return Promise.resolve(user);
// }

const addUser = (user) => {
  return pool
    .query(`
    INSERT INTO users (name, email, password)
    VALUES ($1, $2, $3) RETURNING *;
    `, [user.name, user.email, user.password])
    .then((result) => {
      console.log(result.rows);
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
}

exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
// const getAllReservations = function(guest_id, limit = 10) {
//   return getAllProperties(null, 2);
// }

const getAllReservations = (guest_id, limit = 10) => {
  return pool
    .query(`
      SELECT reservations.*, properties.*, avg(rating) as average_rating
      FROM reservations
      JOIN properties ON reservations.property_id = properties.id
      JOIN property_reviews ON properties.id = property_reviews.property_id
      WHERE reservations.guest_id = $1
      GROUP BY properties.id, reservations.id
      ORDER BY reservations.start_date
      LIMIT $2;
      `, [guest_id, limit])
    .then((result) => {
      console.log(result.rows);
      return result.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
};

exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
// const getAllProperties = function(options, limit = 10) {
//   const limitedProperties = {};
//   for (let i = 1; i <= limit; i++) {
//     limitedProperties[i] = properties[i];
//   }
//   return Promise.resolve(limitedProperties);
// }

// const getAllProperties = (options, limit = 10) => {
//   return pool
//     .query(`SELECT * FROM properties LIMIT $1`, [limit])
//     .then((result) => {
//       // console.log(result.rows);
//       return result.rows;
//     })
//     .catch((err) => {
//       console.log(err.message);
//     });
// };

const getAllProperties = function (options, limit = 10) {
  // 1
  const queryParams = [];
  // 2
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `;

  // 3

  if (options.owner_id) {
    console.log(options.owner_id);
    if (queryParams.length === 0) {
      queryParams.push(options.owner_id);
      queryString += `WHERE owner_id = $${queryParams.length} `;
    } else {
      queryParams.push(options.owner_id);
      queryString += `AND owner_id = $${queryParams.length} `;
    }
  }
  

  if (options.city) {
    if (queryParams === []) {
      queryParams.push(`%${options.city}%`);
      queryString += `WHERE city LIKE $${queryParams.length} `;
    } else {
      queryParams.push(`%${options.city}%`);
      queryString += `AND city LIKE $${queryParams.length} `;
    }
  }

  if (options.minimum_price_per_night) {
    if (queryParams === []) {
      queryParams.push(`${options.minimum_price_per_night}`);
      queryString += `WHERE cost_per_night >= $${queryParams.length}`;
    } else {
      queryParams.push(`${options.minimum_price_per_night}`);
      queryString += `AND cost_per_night >= $${queryParams.length}`;
    }
  }

  if (options.maximum_price_per_night) {
    if (queryParams === []) {
      queryParams.push(`${options.maximum_price_per_night}`);
      queryString += `WHERE cost_per_night <= $${queryParams.length}`;
    } else {
      queryParams.push(`${options.maximum_price_per_night}`);
      queryString += `AND cost_per_night <= $${queryParams.length}`;
    }
  }

  if (options.minimum_rating) {
    if (queryParams === []) {
      queryParams.push(`${options.minimum_rating}`);
      queryString += `WHERE rating >= $${queryParams.length}`;
    } else {
      queryParams.push(`${options.minimum_rating}`);
      queryString += `AND rating >= $${queryParams.length}`;
    }
  }

  // 4
  queryParams.push(limit);
  queryString += `
  GROUP BY properties.id
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  // 5
  console.log(queryString, queryParams);

  // 6
  return pool.query(queryString, queryParams).then((res) => res.rows);
};

exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
// const addProperty = function(property) {
//   const propertyId = Object.keys(properties).length + 1;
//   property.id = propertyId;
//   properties[propertyId] = property;
//   return Promise.resolve(property);
// }

const addProperty = (property) => {
  return pool
    .query(`
    INSERT INTO properties (
      title,
      description,
      owner_id,
      cover_photo_url,
      thumbnail_photo_url,
      cost_per_night,
      parking_spaces,
      number_of_bathrooms,
      number_of_bedrooms,
      active,
      province,
      city,
      country,
      street,
      post_code
      )
      VALUES (
        $1, /* title */
        $2, /* description */
        $3, /* owner_id */
        $4, /* cover_photo_url */
        $5, /* thumbnail_photo_url */
        $6, /* cost_per_night */
        $7, /* parking_spaces */
        $8, /* number_of_bathrooms */
        $9, /* number_of_bedrooms */
        $10, /* active */
        $11, /* province */
        $12, /* city */
        $13, /* country */
        $14, /* street */
        $15 /* post_code */
      ) RETURNING *;
    `, [
      property.title,
      property.description,
      property.owner_id,
      property.cover_photo_url,
      property.thumbnail_photo_url,
      property.cost_per_night,
      property.parking_spaces,
      property.number_of_bathrooms,
      property.number_of_bedrooms,
      true,
      property.province,
      property.city,
      property.country,
      property.street,
      property.post_code
    ])
    .then((result) => {
      console.log(result.rows);
      return result.rows;
    });
}

exports.addProperty = addProperty;
