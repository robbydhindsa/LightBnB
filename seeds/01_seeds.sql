INSERT INTO reservations (start_date, end_date, property_id, guest_id)
VALUES ('2018-09-11', '2018-09-26', 1, 1),
('2019-01-04', '2019-02-01', 2, 2),
('2021-10-01', '2021-10-14', 3, 3);

INSERT INTO users (name, email, password)
VALUES ('John Smith', 'johnsmith@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Bill Smith', 'billsmith@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Tim Smuth', 'johnsmith@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
VALUES (3, 2, 1, 3, 'message'),
VALUES (2, 2, 2, 4, 'message'),
VALUES (3, 1, 3, 4, 'message');

INSERT INTO properties (
  owner_id,
  title,
  description,
  thumbnail_photo_url,
  cover_photo_url,
  cost_per_night,
  parking_spaces,
  number_of_bathrooms,
  number_of_bedrooms,
  country,
  street,
  city,
  province,
  post_code
)
VALUES (
  1,
  'Small Apartment',
  'Sample description',
  'thumbnail.url',
  'cover.url',
  150,
  1,
  1,
  2,
  'Canada',
  '123 Street',
  'Vancouver',
  'British Columbia',
  'A1A 1A1',
),
(
  2,
  'Big House',
  'Sample description',
  'thumbnail.url2',
  'cover.url2',
  300,
  3,
  5,
  4,
  'Canada',
  'ABC Street',
  'Surrey',
  'British Columbia',
  'B2B 2B2'
),
(
  3,
  'Mansion',
  'Sample description',
  'thumbnail.url3',
  'cover.url3',
  500,
  10,
  12,
  11,
  'Canada',
  'Fake Street',
  'Burnaby',
  'British Columbia',
  'C3C 3C3'
);